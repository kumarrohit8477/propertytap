'use client';

import React from 'react';
import { NotificationItem as NotificationType } from '@/types/notification';
import NotificationItem from './notification_item';
import './notification_list.css';

interface NotificationListProps {
  notifications: NotificationType[];
  on_mark_read: (id: string) => void;
}

export default function NotificationList({
  notifications,
  on_mark_read,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="notification_list_empty">
        <h3>No Notifications Yet</h3>
        <p>When you express interest in a property or someone expresses interest in yours, contact details and updates will appear here.</p>
      </div>
    );
  }

  return (
    <div className="notification_list_container">
      {notifications.map((n) => (
        <NotificationItem key={n.id} notification={n} on_mark_read={on_mark_read} />
      ))}
    </div>
  );
}
