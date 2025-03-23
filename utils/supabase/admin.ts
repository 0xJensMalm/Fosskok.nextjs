import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Create a Supabase client with service role for admin operations
// This bypasses RLS policies and should only be used in secure server contexts
export async function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://odilwecffsvoxegpxafl.supabase.co';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseServiceKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables. This will cause permission issues with admin operations.');
    // Fall back to anon key, but this won't have admin permissions
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
    return createSupabaseClient(supabaseUrl, supabaseAnonKey);
  }
  
  // Create a client with the service role key
  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
