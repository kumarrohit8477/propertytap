import { useEffect, useState } from 'react';
import { create_client } from '@/lib/supabase/client';
import { UserProfile } from '@/types/user';
import { User } from '@supabase/supabase-js';

export function use_auth() {
  const [user, set_user] = useState<User | null>(null);
  const [profile, set_profile] = useState<UserProfile | null>(null);
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    const supabase = create_client();

    async function fetch_session() {
      const { data: { session } } = await supabase.auth.getSession();
      set_user(session?.user || null);

      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        set_profile(data as UserProfile | null);
      } else {
        set_profile(null);
      }
      set_loading(false);
    }

    fetch_session();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      set_user(session?.user || null);
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        set_profile(data as UserProfile | null);
      } else {
        set_profile(null);
      }
      set_loading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, profile, loading, is_admin: profile?.role === 'admin' };
}
