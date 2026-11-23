import { create_client } from '@/lib/supabase/client';
import { NotificationItem } from '@/types/notification';

export async function get_user_notifications() {
  const supabase = create_client();
  const { data: user_data } = await supabase.auth.getUser();

  if (!user_data.user) {
    return { notifications: [], error: new Error('User not authenticated') };
  }

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user_data.user.id)
    .order('created_at', { ascending: false });

  return { notifications: (data as NotificationItem[]) || [], error };
}

export async function mark_notification_as_read(notification_id: string) {
  const supabase = create_client();
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notification_id)
    .select()
    .single();

  return { notification: data, error };
}

export async function mark_all_notifications_as_read() {
  const supabase = create_client();
  const { data: user_data } = await supabase.auth.getUser();

  if (!user_data.user) {
    return { error: new Error('User not authenticated') };
  }

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user_data.user.id)
    .eq('is_read', false);

  return { error };
}
