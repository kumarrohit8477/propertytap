import { createClient } from '@supabase/supabase-js';

const supabase_url =
  process.env.PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  '';

const supabase_anon_key =
  process.env.PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  '';

let client_instance: ReturnType<typeof createClient> | null = null;

export function create_client() {
  if (!supabase_url || !supabase_anon_key) {
    throw new Error(
      'Missing Supabase credentials! Please ensure PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file.'
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
