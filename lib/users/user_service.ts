import { create_client } from '@/lib/supabase/client';
import { UserProfile } from '@/types/user';

export async function get_current_user_profile() {
  const supabase = create_client();
  const { data: user_data } = await supabase.auth.getUser();

  if (!user_data.user) {
    return { profile: null, error: null };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user_data.user.id)
    .single();

  return { profile: data as UserProfile | null, error };
}

export async function update_user_profile(payload: Partial<UserProfile>) {
  const supabase = create_client();
  const { data: user_data } = await supabase.auth.getUser();

  if (!user_data.user) {
    return { profile: null, error: new Error('User not authenticated') };
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name: payload.full_name,
      phone: payload.phone,
      avatar_url: payload.avatar_url,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user_data.user.id)
    .select()
    .single();

  return { profile: data as UserProfile | null, error };
}
