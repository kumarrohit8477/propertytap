import { useEffect, useState, useCallback } from 'react';
import {
  get_user_notifications,
  mark_notification_as_read,
  mark_all_notifications_as_read,
} from '@/lib/notifications/notification_service';
import { NotificationItem } from '@/types/notification';

export function use_notifications(userId?: string | null | boolean) {
  const [notifications, set_notifications] = useState<NotificationItem[]>([]);
  const [loading, set_loading] = useState(false);

  const fetch_notifications = useCallback(async () => {
    if (userId === null || userId === false) {
      set_notifications([]);
      set_loading(false);
      return;
    }

    set_loading(true);
    const { notifications: data } = await get_user_notifications();
    set_notifications(data);
    set_loading(false);
  }, [userId]);

  useEffect(() => {
    if (userId === null || userId === false) {
      set_notifications([]);
      set_loading(false);
      return;
    }
    fetch_notifications();
  }, [userId, fetch_notifications]);

  const mark_read = async (id: string) => {
    await mark_notification_as_read(id);
    set_notifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_read: true } : item))
    );
  };

  const mark_all_read = async () => {
    await mark_all_notifications_as_read();
    set_notifications((prev) =>
      prev.map((item) => ({ ...item, is_read: true }))
    );
  };

  const unread_count = notifications.filter((n) => !n.is_read).length;

  return {
    notifications,
    unread_count,
    loading,
    mark_read,
    mark_all_read,
    refetch: fetch_notifications,
  };
}
