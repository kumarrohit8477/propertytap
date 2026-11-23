'use client';

import React, { useState } from 'react';
import { use_notifications } from '@/hooks/use_notifications';
import NotificationList from '@/components/notifications/notification_list';
import { CheckCheck } from 'lucide-react';
import '@/app/dashboard/dashboard.css';
import './notifications.css';

type Tab = 'unread' | 'all';

export default function NotificationsPage() {
  const { notifications, unread_count, loading, mark_read, mark_all_read } = use_notifications();
  const [active_tab, set_active_tab] = useState<Tab>('unread');

  const filtered = active_tab === 'unread'
    ? notifications.filter((n) => !n.is_read)
    : notifications;

  return (
    <div className="dashboard_layout_container">
      <main className="dashboard_main_content">
        <div className="notifications_page_wrapper">
          <div className="notifications_header_row">
            <div className="notifications_header_text">
              <h1 className="notifications_title">Notifications</h1>
            </div>

            <div className="notifications_actions_row">
              {unread_count > 0 ? (
                <>
                  <span className="notifications_count_pill">
                    {unread_count} Unread
                  </span>
                  <button
                    type="button"
                    onClick={() => mark_all_read()}
                    className="notifications_mark_all_btn"
                  >
                    <CheckCheck size={16} />
                    <span>Mark all as read</span>
                  </button>
                </>
              ) : (
                <span
                  className="notifications_count_pill"
                  style={{ backgroundColor: '#f1f5f9', color: '#64748b', borderColor: '#e2e8f0' }}
                >
                  All Caught Up
                </span>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="notifications_tabs">
            <button
              type="button"
              className={`notifications_tab_btn ${active_tab === 'unread' ? 'tab_active' : ''}`}
              onClick={() => set_active_tab('unread')}
            >
              Current
              {unread_count > 0 && (
                <span className="tab_count_badge">{unread_count}</span>
              )}
            </button>
            <button
              type="button"
              className={`notifications_tab_btn ${active_tab === 'all' ? 'tab_active' : ''}`}
              onClick={() => set_active_tab('all')}
            >
              All Notifications
              <span className="tab_count_badge tab_count_grey">{notifications.length}</span>
            </button>
          </div>

          {loading ? (
            <div className="notifications_loading_box">
              <p>Loading your notifications...</p>
            </div>
          ) : (
            <NotificationList
              notifications={filtered}
              on_mark_read={mark_read}
            />
          )}
        </div>
      </main>
    </div>
  );
}
