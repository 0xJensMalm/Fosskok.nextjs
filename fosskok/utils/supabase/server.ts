import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Create a Supabase client for server-side usage
export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://odilwecffsvoxegpxafl.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kaWx3ZWNmZnN2b3hlZ3B4YWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3MjgyMzAsImV4cCI6MjA1ODMwNDIzMH0.CAepYs-Wts96y89rCRj-WlXqTNQQIuOc__OdiQR0UGI';
  
  // Create a simple Supabase client without cookie handling
  // This is a simpler approach that will work for our needs
  return createSupabaseClient(supabaseUrl, supabaseKey);
}
