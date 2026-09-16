import { useEffect, useState, useCallback } from 'react';
import { get_user_notifications, mark_notification_as_read } from '@/lib/notifications/notification_service';
import { NotificationItem } from '@/types/notification';

export function use_notifications() {
  const [notifications, set_notifications] = useState<NotificationItem[]>([]);
  const [loading, set_loading] = useState(true);

  const fetch_notifications = useCallback(async () => {
    set_loading(true);
    const { notifications: data } = await get_user_notifications();
    set_notifications(data);
    set_loading(false);
  }, []);

  useEffect(() => {
    fetch_notifications();
  }, [fetch_notifications]);

  const mark_read = async (id: string) => {
    await mark_notification_as_read(id);
    set_notifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_read: true } : item))
    );
  };

  const unread_count = notifications.filter((n) => !n.is_read).length;

  return { notifications, unread_count, loading, mark_read, refetch: fetch_notifications };
}
