'use client';

import React from 'react';
import { use_notifications } from '@/hooks/use_notifications';
import DashboardSidebar from '@/components/layout/dashboard_sidebar';
import NotificationList from '@/components/notifications/notification_list';
import './notifications.css';

export default function NotificationsPage() {
  const { notifications, loading, mark_read } = use_notifications();

  return (
    <div className="dashboard_layout_container">
      <DashboardSidebar />

      <main className="dashboard_main_content">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: 0 }}>
            Notifications &amp; Contact Exchange
          </h1>
          <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>
            Private contact details for expressed interests are securely delivered here.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <h3>Loading notifications...</h3>
          </div>
        ) : (
          <NotificationList notifications={notifications} on_mark_read={mark_read} />
        )}
      </main>
    </div>
  );
}
