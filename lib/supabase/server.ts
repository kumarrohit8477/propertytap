import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function create_server_client() {
  const cookie_store = cookies();

  const supabase_url = process.env.PUBLIC_SUPABASE_URL;
  const supabase_anon_key = process.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!supabase_url || !supabase_anon_key) {
    throw new Error(
      'Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY environment variables.'
    );
  }

  return createServerClient(supabase_url, supabase_anon_key, {
    cookies: {
      get(name: string) {
        return cookie_store.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookie_store.set({ name, value, ...options });
        } catch {
          // Server component set cookie ignored
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookie_store.set({ name, value: '', ...options });
        } catch {
          // Server component remove cookie ignored
        }
      },
    },
  });
}
