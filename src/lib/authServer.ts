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

// Register user using Supabase Auth + Supabase Database "profiles" table
export async function registerUserInDb(name: string, email: string, pass: string, eduLevel: string = 'graduation') {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    throw new Error('Please enter a valid email address.');
  }

  if (!pass || pass.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }

  if (!name || !name.trim()) {
    throw new Error('Please enter your full name.');
  }

  // Primary path: Supabase Authentication and Supabase Database
  if (isSupabaseConfigured() && (supabaseAdmin || supabase)) {
    const client = supabaseAdmin || supabase!;

    // 1. Check if email already exists in profiles or users tables before creating
    try {
      const { data: existingProfiles } = await client
        .from('profiles')
        .select('email')
        .eq('email', normalizedEmail);

      if (existingProfiles && existingProfiles.length > 0) {
        console.warn('[Supabase Registration] Email already exists in profiles table:', normalizedEmail);
        throw new Error('An account with this email address already exists. Please sign in instead.');
      }

      const { data: existingUsers } = await client
        .from('users')
        .select('email')
        .eq('email', normalizedEmail);

      if (existingUsers && existingUsers.length > 0) {
        console.warn('[Supabase Registration] Email already exists in users table:', normalizedEmail);
        throw new Error('An account with this email address already exists. Please sign in instead.');
      }
    } catch (checkErr: any) {
      if (checkErr.message?.includes('already exists')) {
        throw checkErr;
      }
      console.warn('[Supabase DB Note] Pre-registration email check warning:', checkErr.message);
    }

    // 2. Register user in Supabase Authentication (supabase.auth.signUp)
    let authUser: { id: string; email: string } | null = null;
    let authError: any = null;

    if (supabaseAdmin && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('[Supabase Auth] Registering user via admin auth client:', normalizedEmail);
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: normalizedEmail,
        password: pass,
        email_confirm: true,
        user_metadata: { full_name: name.trim(), education_level: eduLevel }
      });

      if (error) {
        authError = error;
      } else if (data?.user) {
        authUser = { id: data.user.id, email: data.user.email || normalizedEmail };
      }
    }

    if (!authUser && supabase) {
      console.log('[Supabase Auth] Registering user via public auth client (signUp):', normalizedEmail);
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: pass,
        options: {
          data: { full_name: name.trim(), education_level: eduLevel }
        }
      });

      if (error) {
        authError = error;
      } else if (data?.user) {
        authUser = { id: data.user.id, email: data.user.email || normalizedEmail };
      }
    }

    if (authError) {
      console.error('[Supabase Auth Error]:', authError);
      const msg = authError.message || '';
      if (
        msg.toLowerCase().includes('already registered') ||
        msg.toLowerCase().includes('already in use') ||
        msg.toLowerCase().includes('already exists') ||
        authError.status === 422 ||
        authError.code === 'user_already_exists'
      ) {
        throw new Error('An account with this email address already exists. Please sign in instead.');
      }
      throw new Error(msg || 'Failed to register user in Supabase Authentication.');
    }

    if (!authUser) {
      throw new Error('Failed to create user account in Supabase Authentication.');
    }

    console.log('[Supabase Auth Success] Created user in Supabase Auth:', authUser.id, authUser.email);

    const now = new Date().toISOString();

    // 3. Upsert into Supabase "profiles" table with Auth UUID as primary key
    const profileRow = {
      id: authUser.id,
      user_id: authUser.id,
      full_name: name.trim(),
      email: normalizedEmail,
      education_level: eduLevel,
      created_at: now,
      last_login_at: now
    };

    const { error: profileError } = await client
      .from('profiles')
      .upsert([profileRow], { onConflict: 'id' });

    if (profileError) {
      console.error('[Supabase DB Error] Failed to upsert profile record:', profileError);
    } else {
      console.log('[Supabase DB Success] Profile record created in profiles table for user:', authUser.id);
    }

    // 4. Upsert into "users" table for compatibility
    const userRow = {
      id: authUser.id,
      uid: authUser.id,
      name: name.trim(),
      email: normalizedEmail,
      password_hash: 'supabase_auth_managed',
      education_level: eduLevel,
      created_at: now,
      last_login_at: now
    };

    const { error: userError } = await client
      .from('users')
      .upsert([userRow], { onConflict: 'id' });

    if (userError) {
      console.warn('[Supabase DB Note] Users table insert note:', userError.message);
    } else {
      console.log('[Supabase DB Success] User record created in users table for user:', authUser.id);
    }

    const token = jwt.sign(
      { uid: authUser.id, email: authUser.email, name: name.trim(), educationLevel: eduLevel },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return {
      token,
      user: {
        uid: authUser.id,
        name: name.trim(),
        email: authUser.email,
        educationLevel: eduLevel,
        createdAt: now,
        lastLoginAt: now
      }
    };
  }

  // Fallback to PostgreSQL database if Supabase env is not configured
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

// Login user using Supabase Auth + Update last_login_at in Supabase Database
export async function loginUserInDb(email: string, pass: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !pass) {
    throw new Error('Please enter both email and password.');
  }

  if (isSupabaseConfigured() && (supabaseAdmin || supabase)) {
    const client = supabaseAdmin || supabase!;

    console.log('[Supabase Auth] Attempting sign in for email:', normalizedEmail);

    let authUser: { id: string; email: string; user_metadata?: any } | null = null;
    let authError: any = null;

    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: pass
      });

      if (error) {
        authError = error;
      } else if (data?.user) {
        authUser = {
          id: data.user.id,
          email: data.user.email || normalizedEmail,
          user_metadata: data.user.user_metadata
        };
      }
    }

    if (!authUser && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        email: normalizedEmail,
        password: pass
      });

      if (error) {
        authError = error;
      } else if (data?.user) {
        authUser = {
          id: data.user.id,
          email: data.user.email || normalizedEmail,
          user_metadata: data.user.user_metadata
        };
      }
    }

    if (authError || !authUser) {
      console.error('[Supabase Auth Error] Login failed:', authError?.message || 'Invalid credentials');
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    console.log('[Supabase Auth Success] Authenticated user:', authUser.id, authUser.email);

    const now = new Date().toISOString();

    // Update last_login_at in "profiles" and "users" tables
    const { error: profileUpdateErr } = await client
      .from('profiles')
      .update({ last_login_at: now })
      .eq('id', authUser.id);

    if (profileUpdateErr) {
      console.warn('[Supabase DB Note] Update profiles last_login_at note:', profileUpdateErr.message);
    } else {
      console.log('[Supabase DB Success] Updated last_login_at in profiles table for:', authUser.id, 'at', now);
    }

    await client
      .from('users')
      .update({ last_login_at: now })
      .eq('id', authUser.id);

    // Fetch user details from profiles table
    let userName = authUser.user_metadata?.full_name || authUser.email.split('@')[0];
    let eduLevel = authUser.user_metadata?.education_level || 'graduation';
    let createdAt = now;

    const { data: profiles } = await client
      .from('profiles')
      .select('*')
      .eq('id', authUser.id);

    if (profiles && profiles.length > 0) {
      userName = profiles[0].full_name || userName;
      eduLevel = profiles[0].education_level || eduLevel;
      createdAt = profiles[0].created_at || now;
    } else {
      // Ensure profile row exists if missing
      console.log('[Supabase DB] Profile missing during login, auto-creating row for:', authUser.id);
      await client.from('profiles').upsert([{
        id: authUser.id,
        user_id: authUser.id,
        full_name: userName,
        email: authUser.email,
        education_level: eduLevel,
        created_at: now,
        last_login_at: now
      }], { onConflict: 'id' });
    }

    const token = jwt.sign(
      { uid: authUser.id, email: authUser.email, name: userName, educationLevel: eduLevel },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return {
      token,
      user: {
        uid: authUser.id,
        name: userName,
        email: authUser.email,
        educationLevel: eduLevel,
        createdAt,
        lastLoginAt: now
      }
    };
  }

  // Fallback to PostgreSQL database
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

// Verify JWT token
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

// Seed initial JSON user data into Supabase if configured
export async function seedDataToSupabase() {
  if (!isSupabaseConfigured() || (!supabaseAdmin && !supabase)) {
    return { success: false, message: 'Supabase credentials not configured in environment variables.' };
  }

  const client = supabaseAdmin || supabase!;

  try {
    const fs = await import('fs');
    const path = await import('path');

    const usersPath = path.join(process.cwd(), 'supabase_users.json');
    const profilesPath = path.join(process.cwd(), 'supabase_student_profiles.json');

    if (!fs.existsSync(usersPath)) {
      return { success: false, message: 'supabase_users.json file not found' };
    }

    const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
    const profilesData = fs.existsSync(profilesPath) ? JSON.parse(fs.readFileSync(profilesPath, 'utf-8')) : [];

    // Seed into profiles table
    const formattedProfiles = usersData.map((u: any) => ({
      id: u.uid.startsWith('usr_') ? '00000000-0000-0000-0000-' + u.uid.substring(4, 16).padStart(12, '0') : u.uid,
      user_id: u.uid.startsWith('usr_') ? '00000000-0000-0000-0000-' + u.uid.substring(4, 16).padStart(12, '0') : u.uid,
      full_name: u.name,
      email: u.email,
      education_level: u.education_level || 'graduation',
      created_at: u.created_at || new Date().toISOString(),
      last_login_at: u.last_login_at || new Date().toISOString(),
    }));

    const { data: insertedProfiles, error: profileError } = await client
      .from('profiles')
      .upsert(formattedProfiles, { onConflict: 'id' })
      .select();

    if (profileError) {
      console.error('Error seeding profiles to Supabase:', profileError);
    }

    // Seed into users table
    const { data: insertedUsers, error: userError } = await client
      .from('users')
      .upsert(usersData.map((u: any) => ({
        ...u,
        id: u.uid.startsWith('usr_') ? '00000000-0000-0000-0000-' + u.uid.substring(4, 16).padStart(12, '0') : u.uid
      })), { onConflict: 'id' })
      .select();

    if (userError) {
      console.error('Error seeding users to Supabase:', userError);
    }

    return {
      success: true,
      message: 'Successfully seeded user registration data to Supabase profiles and users tables!',
      insertedCount: insertedProfiles?.length || insertedUsers?.length || usersData.length
    };
  } catch (err: any) {
    console.error('Exception during Supabase seeding:', err);
    return { success: false, error: err.message };
  }
}
