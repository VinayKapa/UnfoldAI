-- =========================================================
-- SUPABASE AUTH & DATABASE PRODUCTION SCHEMA FOR UNFOLD AI
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- =========================================================

-- 1. Create 'profiles' table linked to Supabase Auth (auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  education_level TEXT DEFAULT 'graduation',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to prevent conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role full access on profiles" ON public.profiles;

-- RLS Policy: Users can view only their own profile data
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id OR auth.uid() = user_id);

-- RLS Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id OR auth.uid() = user_id);

-- RLS Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id OR auth.uid() = user_id)
WITH CHECK (auth.uid() = id OR auth.uid() = user_id);

-- RLS Policy: Service role (backend server) has full access
CREATE POLICY "Service role full access on profiles"
ON public.profiles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- 2. Create 'users' table alias for full backward compatibility
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  uid TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  education_level TEXT DEFAULT 'graduation',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own users row" ON public.users;
DROP POLICY IF EXISTS "Users can insert own users row" ON public.users;
DROP POLICY IF EXISTS "Users can update own users row" ON public.users;
DROP POLICY IF EXISTS "Service role full access on users" ON public.users;

CREATE POLICY "Users can view own users row" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own users row" 
ON public.users FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own users row" 
ON public.users FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Service role full access on users"
ON public.users FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- 3. Create 'student_profiles' table for career assessments & roadmaps
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT,
  education_level TEXT,
  grade_or_field TEXT,
  inputs JSONB,
  career_dna JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own student_profiles" ON public.student_profiles;
DROP POLICY IF EXISTS "Users can insert own student_profiles" ON public.student_profiles;
DROP POLICY IF EXISTS "Users can update own student_profiles" ON public.student_profiles;
DROP POLICY IF EXISTS "Service role full access on student_profiles" ON public.student_profiles;

CREATE POLICY "Users can view own student_profiles" 
ON public.student_profiles FOR SELECT 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own student_profiles" 
ON public.student_profiles FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own student_profiles" 
ON public.student_profiles FOR UPDATE 
USING (auth.uid()::text = user_id);

CREATE POLICY "Service role full access on student_profiles"
ON public.student_profiles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON public.student_profiles(user_id);
