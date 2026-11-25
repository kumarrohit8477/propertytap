import { useEffect, useState } from 'react';
import { create_client } from '@/lib/supabase/client';
import { UserProfile } from '@/types/user';
import { User } from '@supabase/supabase-js';

// Module-level shared cache & single inflight promise to avoid flooding network
let cached_user: User | null = null;
let cached_profile: UserProfile | null = null;
let cached_loading = true;
let inflight_promise: Promise<{ user: User | null; profile: UserProfile | null }> | null = null;
const subscribers = new Set<() => void>();

function notify_subscribers() {
  subscribers.forEach((cb) => {
    try {
      cb();
    } catch {
      // Ignore listener error
    }
  });
}

async function get_shared_auth() {
  if (inflight_promise) return inflight_promise;

  inflight_promise = (async () => {
    try {
      const supabase = create_client();
      const { data: { session } } = await supabase.auth.getSession();
      cached_user = session?.user || null;

      if (session?.user) {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          cached_profile = data as UserProfile | null;
        } catch {
          cached_profile = null;
        }
      } else {
        cached_profile = null;
      }
    } catch (err) {
      console.warn('Auth session check skipped or offline:', err);
      cached_user = null;
      cached_profile = null;
    } finally {
      cached_loading = false;
      inflight_promise = null;
      notify_subscribers();
    }
    return { user: cached_user, profile: cached_profile };
  })();

  return inflight_promise;
}

let auth_listener_initialized = false;
function init_auth_listener() {
  if (auth_listener_initialized || typeof window === 'undefined') return;
  auth_listener_initialized = true;

  try {
    const supabase = create_client();
    supabase.auth.onAuthStateChange(async (_event, session) => {
      cached_user = session?.user || null;
      if (session?.user) {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          cached_profile = data as UserProfile | null;
        } catch {
          cached_profile = null;
        }
      } else {
        cached_profile = null;
      }
      cached_loading = false;
      notify_subscribers();
    });
  } catch (e) {
    console.warn('Could not initialize auth listener', e);
  }
}

export function use_auth() {
  const [state, set_state] = useState({
    user: cached_user,
    profile: cached_profile,
    loading: cached_loading,
  });

  useEffect(() => {
    init_auth_listener();

    const update = () => {
      set_state({
        user: cached_user,
        profile: cached_profile,
        loading: cached_loading,
      });
    };

    subscribers.add(update);

    if (cached_loading) {
      get_shared_auth();
    } else {
      update();
    }

    return () => {
      subscribers.delete(update);
    };
  }, []);

  return {
    user: state.user,
    profile: state.profile,
    loading: state.loading,
    is_admin: state.profile?.role === 'admin',
  };
}
