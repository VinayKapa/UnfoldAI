import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.ts';
import { users, studentProfiles } from '../db/schema.ts';
import { supabase, supabaseAdmin, isSupabaseConfigured } from './supabase.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'unfold-ai-secure-jwt-key-2026';

export interface UserPayload {
  uid: string;
  email: string;
  name: string;
  educationLevel?: string;
}

// Generate unique random UID
export function generateUid(): string {
  return 'usr_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

// Register user in database (Supabase if configured, otherwise PostgreSQL)
export async function registerUserInDb(name: string, email: string, pass: string, eduLevel: string = 'graduation') {
  const normalizedEmail = email.trim().toLowerCase();

  // If Supabase is configured via env vars, register in Supabase
  if (isSupabaseConfigured() && (supabaseAdmin || supabase)) {
    const client = supabaseAdmin || supabase!;

    // Check if user exists in Supabase
    const { data: existingSupabaseUsers } = await client
      .from('users')
      .select('email')
      .eq('email', normalizedEmail);

    if (existingSupabaseUsers && existingSupabaseUsers.length > 0) {
      throw new Error('An account with this email address already exists. Please sign in instead.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(pass, salt);
    const uid = generateUid();
    const now = new Date().toISOString();

    // Insert user into Supabase table 'users'
    const { data: insertedUser, error } = await client
      .from('users')
      .insert([
        {
          uid,
          name: name.trim(),
          email: normalizedEmail,
          password_hash: passwordHash,
          education_level: eduLevel,
          created_at: now,
          last_login_at: now,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase user creation error:', error);
      // Fallback or throw error if table missing
    } else if (insertedUser) {
      const token = jwt.sign(
        { uid: insertedUser.uid, email: insertedUser.email, name: insertedUser.name, educationLevel: insertedUser.education_level },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      return {
        token,
        user: {
          uid: insertedUser.uid,
          name: insertedUser.name,
          email: insertedUser.email,
          educationLevel: insertedUser.education_level,
          createdAt: insertedUser.created_at,
          lastLoginAt: insertedUser.last_login_at,
        }
      };
    }
  }

  // PostgreSQL Database fallback/primary connection
  const existingUsers = await db.select().from(users).where(eq(users.email, normalizedEmail));
  if (existingUsers.length > 0) {
    throw new Error('An account with this email address already exists. Please sign in instead.');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(pass, salt);

  const uid = generateUid();
  const now = new Date();

  const [newUser] = await db.insert(users).values({
    uid,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    educationLevel: eduLevel,
    createdAt: now,
    lastLoginAt: now,
  }).returning();

  const token = jwt.sign(
    { uid: newUser.uid, email: newUser.email, name: newUser.name, educationLevel: newUser.educationLevel },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  return {
    token,
    user: {
      uid: newUser.uid,
      name: newUser.name,
      email: newUser.email,
      educationLevel: newUser.educationLevel,
      createdAt: newUser.createdAt?.toISOString(),
      lastLoginAt: newUser.lastLoginAt?.toISOString(),
    }
  };
}

// Login user from database (Supabase or PostgreSQL)
export async function loginUserInDb(email: string, pass: string) {
  const normalizedEmail = email.trim().toLowerCase();

  // Check Supabase if configured
  if (isSupabaseConfigured() && (supabaseAdmin || supabase)) {
    const client = supabaseAdmin || supabase!;

    const { data: supUsers } = await client
      .from('users')
      .select('*')
      .eq('email', normalizedEmail);

    if (supUsers && supUsers.length > 0) {
      const uRecord = supUsers[0];
      const isMatch = await bcrypt.compare(pass, uRecord.password_hash);
      if (!isMatch) {
        throw new Error('Invalid email or password. Please check your credentials.');
      }

      const now = new Date().toISOString();
      await client.from('users').update({ last_login_at: now }).eq('uid', uRecord.uid);

      const token = jwt.sign(
        { uid: uRecord.uid, email: uRecord.email, name: uRecord.name, educationLevel: uRecord.education_level },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      return {
        token,
        user: {
          uid: uRecord.uid,
          name: uRecord.name,
          email: uRecord.email,
          educationLevel: uRecord.education_level,
          createdAt: uRecord.created_at,
          lastLoginAt: now,
        }
      };
    }
  }

  // Check PostgreSQL Database
  const existingUsers = await db.select().from(users).where(eq(users.email, normalizedEmail));
  if (existingUsers.length === 0) {
    throw new Error('Invalid email or password. Please check your credentials.');
  }

  const userRecord = existingUsers[0];

  const isMatch = await bcrypt.compare(pass, userRecord.passwordHash);
  if (!isMatch) {
    throw new Error('Invalid email or password. Please check your credentials.');
  }

  const now = new Date();
  await db.update(users)
    .set({ lastLoginAt: now })
    .where(eq(users.uid, userRecord.uid));

  const token = jwt.sign(
    { uid: userRecord.uid, email: userRecord.email, name: userRecord.name, educationLevel: userRecord.educationLevel },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  return {
    token,
    user: {
      uid: userRecord.uid,
      name: userRecord.name,
      email: userRecord.email,
      educationLevel: userRecord.educationLevel,
      createdAt: userRecord.createdAt?.toISOString(),
      lastLoginAt: now.toISOString(),
    }
  };
}

// Verify token
export function verifyUserToken(token: string): UserPayload {
  return jwt.verify(token, JWT_SECRET) as UserPayload;
}

// Save or update student profile in database
export async function saveProfileToDb(userId: string, profileData: {
  name: string;
  educationLevel: string;
  gradeOrField?: string;
  inputs?: any;
  careerDna?: any;
}) {
  if (isSupabaseConfigured() && (supabaseAdmin || supabase)) {
    const client = supabaseAdmin || supabase!;
    const now = new Date().toISOString();

    const { data: existing } = await client
      .from('student_profiles')
      .select('id')
      .eq('user_id', userId);

    if (existing && existing.length > 0) {
      await client
        .from('student_profiles')
        .update({
          name: profileData.name,
          education_level: profileData.educationLevel,
          grade_or_field: profileData.gradeOrField || '',
          inputs: profileData.inputs || {},
          career_dna: profileData.careerDna || {},
          updated_at: now,
        })
        .eq('user_id', userId);
    } else {
      await client
        .from('student_profiles')
        .insert([
          {
            user_id: userId,
            name: profileData.name,
            education_level: profileData.educationLevel,
            grade_or_field: profileData.gradeOrField || '',
            inputs: profileData.inputs || {},
            career_dna: profileData.careerDna || {},
            updated_at: now,
          }
        ]);
    }
  }

  // Also maintain in PostgreSQL database
  const existingProfiles = await db.select().from(studentProfiles).where(eq(studentProfiles.userId, userId));
  const now = new Date();

  if (existingProfiles.length > 0) {
    await db.update(studentProfiles)
      .set({
        name: profileData.name,
        educationLevel: profileData.educationLevel,
        gradeOrField: profileData.gradeOrField || '',
        inputs: profileData.inputs || {},
        careerDna: profileData.careerDna || {},
        updatedAt: now,
      })
      .where(eq(studentProfiles.userId, userId));
  } else {
    await db.insert(studentProfiles).values({
      userId,
      name: profileData.name,
      educationLevel: profileData.educationLevel,
      gradeOrField: profileData.gradeOrField || '',
      inputs: profileData.inputs || {},
      careerDna: profileData.careerDna || {},
      updatedAt: now,
    });
  }
}

// Load student profile from database
export async function loadProfileFromDb(userId: string) {
  if (isSupabaseConfigured() && (supabaseAdmin || supabase)) {
    const client = supabaseAdmin || supabase!;
    const { data } = await client
      .from('student_profiles')
      .select('*')
      .eq('user_id', userId);

    if (data && data.length > 0) {
      const rec = data[0];
      return {
        name: rec.name,
        educationLevel: rec.education_level,
        gradeOrField: rec.grade_or_field,
        inputs: rec.inputs,
        careerDna: rec.career_dna,
      };
    }
  }

  const profiles = await db.select().from(studentProfiles).where(eq(studentProfiles.userId, userId));
  if (profiles.length === 0) return null;
  return profiles[0];
}
