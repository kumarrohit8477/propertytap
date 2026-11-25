import { createClient } from '@supabase/supabase-js';

const supabase_url =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  '';

const supabase_anon_key =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  '';

let client_instance: ReturnType<typeof createClient> | null = null;

export function create_client() {
  if (!supabase_url || !supabase_anon_key) {
    throw new Error(
      'Missing Supabase credentials! Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file.'
    );
  }

  if (!client_instance) {
    client_instance = createClient(supabase_url, supabase_anon_key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client_instance;
}
