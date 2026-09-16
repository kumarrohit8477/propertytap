'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { use_auth } from '@/hooks/use_auth';
import { use_notifications } from '@/hooks/use_notifications';
import './navbar.css';

export default function Navbar() {
  const pathname = usePathname();
  const { user, profile, is_admin } = use_auth();
  const { unread_count } = use_notifications();

  return (
    <header className="navbar_header">
      <div className="navbar_container">
        <Link href="/" className="navbar_brand">
          <div className="navbar_logo_icon">T</div>
          <span className="navbar_logo_text">Property Tap</span>
          <span className="navbar_logo_tag">₹0 Brokerage</span>
        </Link>

        <nav className="navbar_nav_links">
          <Link
            href="/"
            className={`navbar_link ${pathname === '/' ? 'navbar_link_active' : ''}`}
          >
            Feed
          </Link>
          <Link
            href="/search"
            className={`navbar_link ${pathname.startsWith('/search') ? 'navbar_link_active' : ''}`}
          >
            Search
          </Link>
          <Link
            href="/pricing"
            className={`navbar_link ${pathname === '/pricing' ? 'navbar_link_active' : ''}`}
          >
            Pricing
          </Link>
          <Link
            href="/safety"
            className={`navbar_link ${pathname === '/safety' ? 'navbar_link_active' : ''}`}
          >
            Safety
          </Link>
        </nav>

        <div className="navbar_actions">
          <Link href="/dashboard/properties/new" className="navbar_post_button">
            + Post Property (Free)
          </Link>

          {user ? (
            <div className="navbar_user_menu">
              <Link href="/dashboard/notifications" className="navbar_notification_badge">
                🔔
                {unread_count > 0 && (
                  <span className="navbar_badge_count">{unread_count}</span>
                )}
              </Link>
              <Link href="/dashboard" className="navbar_avatar">
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
              </Link>
              {is_admin && (
                <Link href="/admin" className="navbar_link" style={{ fontWeight: 700, color: '#dc2626' }}>
                  Admin
                </Link>
              )}
            </div>
          ) : (
            <div className="navbar_user_menu">
              <Link href="/login" className="navbar_link">
                Login
              </Link>
              <Link href="/signup" className="navbar_link" style={{ fontWeight: 600 }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
