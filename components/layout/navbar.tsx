'use client';

import React, { useState } from 'react';
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
  const [mobile_open, set_mobile_open] = useState(false);

  return (
    <header className="navbar_header">
      <div className="navbar_container">
        {/* Brand Logo & Name */}
        <Link href="/" className="navbar_brand">
          <Image
            src="/assets/logo.png"
            alt="PropertyTap Logo"
            width={36}
            height={36}
            className="navbar_logo_img"
          />
          <span className="navbar_logo_text">Property<span className="navbar_logo_blue">Tap</span></span>
        </Link>

        {/* Center Nav Links */}
        <nav className="navbar_nav_links">
          <Link href="/" className={`navbar_nav_item ${pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link href="/properties" className={`navbar_nav_item ${pathname?.startsWith('/properties') ? 'active' : ''}`}>Properties</Link>
          <Link href="/about" className={`navbar_nav_item ${pathname === '/about' ? 'active' : ''}`}>About</Link>
          <Link href="/how-it-works" className={`navbar_nav_item ${pathname === '/how-it-works' ? 'active' : ''}`}>How it works</Link>
          <Link href="/contact" className={`navbar_nav_item ${pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
        </nav>

        {/* Right Actions */}
        <div className="navbar_actions">
          {user ? (
            <div className="navbar_user_menu">
              <Link href="/dashboard/notifications" className="navbar_notification_badge" aria-label="Notifications">
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
                <Link href="/admin" className="navbar_admin_link">Admin</Link>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="navbar_login_btn">Sign In</Link>
              <Link href="/dashboard/properties/new" className="navbar_get_started_btn">List Property</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="navbar_hamburger" onClick={() => set_mobile_open(!mobile_open)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobile_open && (
        <div className="navbar_mobile_menu">
          <Link href="/" className="navbar_mobile_item" onClick={() => set_mobile_open(false)}>Home</Link>
          <Link href="/properties" className="navbar_mobile_item" onClick={() => set_mobile_open(false)}>Properties</Link>
          <Link href="/about" className="navbar_mobile_item" onClick={() => set_mobile_open(false)}>About</Link>
          <Link href="/how-it-works" className="navbar_mobile_item" onClick={() => set_mobile_open(false)}>How it works</Link>
          <Link href="/contact" className="navbar_mobile_item" onClick={() => set_mobile_open(false)}>Contact</Link>
          {!user && (
            <>
              <Link href="/login" className="navbar_mobile_item" onClick={() => set_mobile_open(false)}>Login</Link>
              <Link href="/dashboard/properties/new" className="navbar_mobile_cta" onClick={() => set_mobile_open(false)}>List Property</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}