import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Safe environment variable getter across Vite browser environment and Node environment
const getEnvVar = (key: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  const meta = import.meta as any;
  if (meta && meta.env && meta.env[key]) {
    return meta.env[key] as string;
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || getEnvVar('SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || getEnvVar('SUPABASE_ANON_KEY');
const supabaseServiceKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY');

// Public Supabase client (used for Auth, client-side requests, and public queries)
export const supabase: SupabaseClient | null = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : null;

// Admin Supabase client (used on server-side for admin user creation, RLS bypass)
export const supabaseAdmin: SupabaseClient | null = (supabaseUrl && (supabaseServiceKey || supabaseAnonKey))
  ? createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    })
  : null;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && (supabaseAnonKey || supabaseServiceKey));
};
