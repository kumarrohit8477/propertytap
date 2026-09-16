'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { sign_out_user } from '@/lib/auth/auth_service';
import './dashboard_sidebar.css';

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="dashboard_sidebar">
      <div className="dashboard_sidebar_title">User Dashboard</div>
      <Link
        href="/dashboard"
        className={`dashboard_nav_item ${pathname === '/dashboard' ? 'dashboard_nav_item_active' : ''}`}
      >
        📊 Overview
      </Link>
      <Link
        href="/dashboard/properties"
        className={`dashboard_nav_item ${pathname.startsWith('/dashboard/properties') ? 'dashboard_nav_item_active' : ''}`}
      >
        🏡 My Properties
      </Link>
      <Link
        href="/dashboard/interests"
        className={`dashboard_nav_item ${pathname === '/dashboard/interests' ? 'dashboard_nav_item_active' : ''}`}
      >
        🤝 Interests
      </Link>
      <Link
        href="/dashboard/notifications"
        className={`dashboard_nav_item ${pathname === '/dashboard/notifications' ? 'dashboard_nav_item_active' : ''}`}
      >
        🔔 Notifications
      </Link>
      <Link
        href="/dashboard/profile"
        className={`dashboard_nav_item ${pathname === '/dashboard/profile' ? 'dashboard_nav_item_active' : ''}`}
      >
        👤 Profile
      </Link>
      <Link
        href="/dashboard/settings"
        className={`dashboard_nav_item ${pathname === '/dashboard/settings' ? 'dashboard_nav_item_active' : ''}`}
      >
        ⚙️ Settings
      </Link>
      <button
        onClick={() => sign_out_user().then(() => (window.location.href = '/'))}
        className="dashboard_nav_item"
        style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left', color: '#ef4444' }}
      >
        🚪 Logout
      </button>
    </aside>
  );
}
