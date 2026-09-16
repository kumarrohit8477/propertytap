import { createBrowserClient } from '@supabase/ssr';

export function create_client() {
  const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabase_anon_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabase_url || !supabase_anon_key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
    );
  }

  return createBrowserClient(supabase_url, supabase_anon_key);
}
