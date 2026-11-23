'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { sign_out_user } from '@/lib/auth/auth_service';
import './dashboard_sidebar.css';

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar (visible on desktop, hidden on mobile) */}
      <aside className="dashboard_sidebar">
        <div className="dashboard_sidebar_title">User Dashboard</div>
        <Link
          href="/dashboard"
          className={`dashboard_nav_item ${pathname === '/dashboard' ? 'dashboard_nav_item_active' : ''}`}
        >
          <Image
            src="/assets/dashboard.png"
            alt="Overview"
            width={20}
            height={20}
            className="dashboard_nav_icon"
          />
          <span>Overview</span>
        </Link>
        <Link
          href="/dashboard/properties"
          className={`dashboard_nav_item ${pathname.startsWith('/dashboard/properties') ? 'dashboard_nav_item_active' : ''}`}
        >
          <Image
            src="/assets/home-icon.png"
            alt="My Properties"
            width={20}
            height={20}
            className="dashboard_nav_icon"
          />
          <span>My Properties</span>
        </Link>
        <Link
          href="/dashboard/interests"
          className={`dashboard_nav_item ${pathname === '/dashboard/interests' ? 'dashboard_nav_item_active' : ''}`}
        >
          <Image
            src="/assets/interests.png"
            alt="Interests"
            width={20}
            height={20}
            className="dashboard_nav_icon"
          />
          <span>Interests</span>
        </Link>
        <Link
          href="/dashboard/notifications"
          className={`dashboard_nav_item ${pathname === '/dashboard/notifications' ? 'dashboard_nav_item_active' : ''}`}
        >
          <Image
            src="/assets/notification.png"
            alt="Notifications"
            width={20}
            height={20}
            className="dashboard_nav_icon"
          />
          <span>Notifications</span>
        </Link>
        <Link
          href="/dashboard/profile"
          className={`dashboard_nav_item ${pathname === '/dashboard/profile' ? 'dashboard_nav_item_active' : ''}`}
        >
          <Image
            src="/assets/profile.png"
            alt="Profile"
            width={20}
            height={20}
            className="dashboard_nav_icon"
          />
          <span>Profile</span>
        </Link>
        <button
          onClick={() => sign_out_user().then(() => (window.location.href = '/'))}
          className="dashboard_nav_item"
          style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left', color: '#ef4444' }}
        >
          <Image
            src="/assets/logout.png"
            alt="Logout"
            width={20}
            height={20}
            className="dashboard_nav_icon"
          />
          <span>Logout</span>
        </button>
      </aside>

      {/* Mobile App-style Bottom Tab Bar (shown ONLY on mobile, containing ONLY Overview, My Properties, Interest, Profile) */}
      <nav className="dashboard_bottom_bar" aria-label="Dashboard mobile navigation">
        <Link
          href="/dashboard"
          className={`dashboard_bottom_tab ${pathname === '/dashboard' ? 'dashboard_bottom_tab_active' : ''}`}
        >
          <Image
            src="/assets/dashboard.png"
            alt="Overview"
            width={22}
            height={22}
            className="dashboard_bottom_icon"
          />
          <span className="dashboard_bottom_label">Overview</span>
        </Link>

        <Link
          href="/dashboard/properties"
          className={`dashboard_bottom_tab ${pathname.startsWith('/dashboard/properties') ? 'dashboard_bottom_tab_active' : ''}`}
        >
          <Image
            src="/assets/home-icon.png"
            alt="My Properties"
            width={22}
            height={22}
            className="dashboard_bottom_icon"
          />
          <span className="dashboard_bottom_label">My Properties</span>
        </Link>

        <Link
          href="/dashboard/interests"
          className={`dashboard_bottom_tab ${pathname.startsWith('/dashboard/interests') ? 'dashboard_bottom_tab_active' : ''}`}
        >
          <Image
            src="/assets/interests.png"
            alt="Interest"
            width={22}
            height={22}
            className="dashboard_bottom_icon"
          />
          <span className="dashboard_bottom_label">Interest</span>
        </Link>

        <Link
          href="/dashboard/profile"
          className={`dashboard_bottom_tab ${pathname.startsWith('/dashboard/profile') ? 'dashboard_bottom_tab_active' : ''}`}
        >
          <Image
            src="/assets/profile.png"
            alt="Profile"
            width={22}
            height={22}
            className="dashboard_bottom_icon"
          />
          <span className="dashboard_bottom_label">Profile</span>
        </Link>
      </nav>
    </>
  );
}
