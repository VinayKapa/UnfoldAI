import { pgTable, serial, text, timestamp, json, integer } from 'drizzle-orm/pg-core';

// Users table storing login credentials & profiles in PostgreSQL
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  educationLevel: text('education_level').default('graduation'),
  createdAt: timestamp('created_at').defaultNow(),
  lastLoginAt: timestamp('last_login_at').defaultNow(),
});

// Student profiles storing career assessment and AI workspace state
export const studentProfiles = pgTable('student_profiles', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.uid),
  name: text('name'),
  educationLevel: text('education_level'),
  gradeOrField: text('grade_or_field'),
  inputs: json('inputs'),
  careerDna: json('career_dna'),
  updatedAt: timestamp('updated_at').defaultNow(),
});
