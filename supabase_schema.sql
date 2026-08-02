-- ==========================================
-- SUPABASE DATABASE SCHEMA FOR UNFOLD AI
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ==========================================

-- 1. Create 'users' table
CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  uid TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  education_level TEXT DEFAULT 'graduation',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) or public policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role full access on users" 
ON public.users FOR ALL 
USING (true) 
WITH CHECK (true);

-- 2. Create 'student_profiles' table
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(uid) ON DELETE CASCADE,
  name TEXT,
  education_level TEXT,
  grade_or_field TEXT,
  inputs JSONB,
  career_dna JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on student_profiles
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role full access on student_profiles" 
ON public.student_profiles FOR ALL 
USING (true) 
WITH CHECK (true);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_uid ON public.users(uid);
CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON public.student_profiles(user_id);
