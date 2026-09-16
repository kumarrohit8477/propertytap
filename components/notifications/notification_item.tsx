'use client';

import React from 'react';
import { NotificationItem as NotificationType } from '@/types/notification';
import { format_date } from '@/lib/utils/utils';
import Button from '@/components/ui/button';
import './notification_item.css';

interface NotificationItemProps {
  notification: NotificationType;
  on_mark_read: (id: string) => void;
}

export default function NotificationItem({
  notification,
  on_mark_read,
}: NotificationItemProps) {
  return (
    <div
      className={`notification_item_card ${
        !notification.is_read ? 'notification_item_unread' : ''
      }`}
    >
      <div className="notification_item_header">
        <h4 className="notification_item_title">
          {!notification.is_read && '🔵 '}
          {notification.title}
        </h4>
        <span className="notification_item_time">
          {format_date(notification.created_at)}
        </span>
      </div>

      <div className="notification_item_message">
        {notification.message}
      </div>

      {!notification.is_read && (
        <div className="notification_item_actions">
          <Button
            variant="outline"
            style={{ fontSize: '0.8rem', padding: '0.25rem 0.6rem' }}
            onClick={() => on_mark_read(notification.id)}
          >
            Mark as Read
          </Button>
        </div>
      )}
    </div>
  );
}
