import { create_client } from '@/lib/supabase/client';

export async function get_listing_plans() {
  const supabase = create_client();
  const { data, error } = await supabase
    .from('listing_plans')
    .select('*')
    .order('price', { ascending: true });

  return { plans: data || [], error };
}

export async function get_user_payment_history() {
  const supabase = create_client();
  const { data: user_data } = await supabase.auth.getUser();

  if (!user_data.user) {
    return { payments: [], error: new Error('User not authenticated') };
  }

  const { data, error } = await supabase
    .from('payments')
    .select(`
      *,
      property:properties(id, title)
    `)
    .eq('user_id', user_data.user.id)
    .order('created_at', { ascending: false });

  return { payments: data || [], error };
}
