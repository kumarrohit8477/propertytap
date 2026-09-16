'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './admin_sidebar.css';

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin_sidebar">
      <div className="admin_sidebar_title">🛡️ Admin Panel</div>
      <Link
        href="/admin"
        className={`admin_nav_item ${pathname === '/admin' ? 'admin_nav_item_active' : ''}`}
      >
        📊 System Overview
      </Link>
      <Link
        href="/admin/users"
        className={`admin_nav_item ${pathname === '/admin/users' ? 'admin_nav_item_active' : ''}`}
      >
        👥 Users Management
      </Link>
      <Link
        href="/admin/properties"
        className={`admin_nav_item ${pathname === '/admin/properties' ? 'admin_nav_item_active' : ''}`}
      >
        🏡 Properties Moderation
      </Link>
      <Link
        href="/admin/reports"
        className={`admin_nav_item ${pathname === '/admin/reports' ? 'admin_nav_item_active' : ''}`}
      >
        🚩 User Reports
      </Link>
      <Link
        href="/admin/plans"
        className={`admin_nav_item ${pathname === '/admin/plans' ? 'admin_nav_item_active' : ''}`}
      >
        💳 Listing Plans
      </Link>
      <Link
        href="/admin/settings"
        className={`admin_nav_item ${pathname === '/admin/settings' ? 'admin_nav_item_active' : ''}`}
      >
        ⚙️ Platform Settings
      </Link>
      <Link href="/dashboard" className="admin_nav_item" style={{ marginTop: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '0.75rem' }}>
        &larr; Back to Dashboard
      </Link>
    </aside>
  );
}
