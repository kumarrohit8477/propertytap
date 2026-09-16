'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { use_auth } from '@/hooks/use_auth';
import { get_user_my_properties } from '@/lib/properties/property_service';
import { get_user_notifications } from '@/lib/notifications/notification_service';
import Button from '@/components/ui/button';
import DashboardSidebar from '@/components/layout/dashboard_sidebar';
import './dashboard.css';

export default function DashboardOverviewPage() {
  const { profile } = use_auth();
  const [properties_count, set_properties_count] = useState(0);
  const [unread_notifications_count, set_unread_notifications_count] = useState(0);

  useEffect(() => {
    async function load_stats() {
      const { properties } = await get_user_my_properties();
      set_properties_count(properties.length);

      const { notifications } = await get_user_notifications();
      set_unread_notifications_count(notifications.filter((n) => !n.is_read).length);
    }
    load_stats();
  }, []);

  return (
    <div className="dashboard_layout_container">
      <DashboardSidebar />

      <main className="dashboard_main_content">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: 0 }}>
            Welcome back, {profile?.full_name || 'User'}! 👋
          </h1>
          <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>
            Manage your listed properties, interests, and contact details from your central dashboard.
          </p>
        </div>

        <div className="dashboard_stats_grid">
          <div className="dashboard_stat_card">
            <span className="dashboard_stat_number">{properties_count}</span>
            <span className="dashboard_stat_label">Listed Properties</span>
          </div>

          <div className="dashboard_stat_card">
            <span className="dashboard_stat_number">{unread_notifications_count}</span>
            <span className="dashboard_stat_label">Unread Notifications</span>
          </div>

          <div className="dashboard_stat_card">
            <span className="dashboard_stat_number" style={{ color: '#10b981' }}>₹0</span>
            <span className="dashboard_stat_label">Brokerage Charged</span>
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>Post a New Property</h3>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>Take advantage of our 100% launch discount and post for ₹0.</p>
          </div>
          <Link href="/dashboard/properties/new">
            <Button variant="primary">+ Add Property (Free)</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
