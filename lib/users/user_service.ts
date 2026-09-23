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

  const update_data: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (payload.full_name !== undefined) update_data.full_name = payload.full_name;
  if (payload.display_name !== undefined) update_data.display_name = payload.display_name;
  if (payload.profile_type !== undefined) update_data.profile_type = payload.profile_type;
  if (payload.phone !== undefined) update_data.phone = payload.phone;
  if (payload.avatar_url !== undefined) update_data.avatar_url = payload.avatar_url;

  const { data, error } = await supabase
    .from('profiles')
    .update(update_data)
    .eq('id', user_data.user.id)
    .select()
    .single();

  return { profile: data as UserProfile | null, error };
}
