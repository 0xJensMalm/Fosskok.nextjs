import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Create a Supabase client for client-side usage
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://odilwecffsvoxegpxafl.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kaWx3ZWNmZnN2b3hlZ3B4YWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3MjgyMzAsImV4cCI6MjA1ODMwNDIzMH0.CAepYs-Wts96y89rCRj-WlXqTNQQIuOc__OdiQR0UGI';
  
  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
}
