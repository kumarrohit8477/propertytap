'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
        {/* Brand Logo & Name */}
        <Link href="/" className="navbar_brand">
          <Image 
            src="/assets/logo.png" 
            alt="Property Tap Logo" 
            width={40} 
            height={40} 
            className="navbar_logo_img"
          />
          <span className="navbar_logo_text">Property Tap</span>
        </Link>

        {/* Right Actions */}
        <div className="navbar_actions">
          <Link href="/dashboard/properties/new" className="navbar_list_btn">
            List Property
          </Link>

          {user ? (
            <div className="navbar_user_menu">
              <Link href="/dashboard/notifications" className="navbar_notification_badge" aria-label="Notifications">
                {/* Clean SVG Bell Icon */}
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
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
            <Link href="/login" className="navbar_signin_btn">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}