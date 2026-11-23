'use client';

import React from 'react';
import Link from 'next/link';
import { NotificationItem as NotificationType } from '@/types/notification';
import NotificationItem from './notification_item';
import { BellOff, ArrowRight } from 'lucide-react';
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
      <div className="notif_empty_container">
        <div className="notif_empty_icon_box">
          <BellOff size={32} />
        </div>
        <h3 className="notif_empty_title">No Notifications Yet</h3>
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
