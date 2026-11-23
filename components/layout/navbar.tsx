'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { use_auth } from '@/hooks/use_auth';
import { use_notifications } from '@/hooks/use_notifications';
import { sign_out_user } from '@/lib/auth/auth_service';
import { LayoutDashboard, LogOut, Home, Heart, User as UserIcon, Shield, X, Bell, PlusCircle } from 'lucide-react';
import './navbar.css';

export default function Navbar() {
  const pathname = usePathname();
  const { user, profile, is_admin } = use_auth();
  const { unread_count } = use_notifications();
  const [mobile_open, set_mobile_open] = useState(false);
  const [user_modal_open, set_user_modal_open] = useState(false);

  // Close mobile drawer and user modal on route change
  useEffect(() => {
    set_mobile_open(false);
    set_user_modal_open(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobile_open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobile_open]);

  // Handle escape key
  useEffect(() => {
    const on_key_down = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (user_modal_open) set_user_modal_open(false);
        if (mobile_open) set_mobile_open(false);
      }
    };
    window.addEventListener('keydown', on_key_down);
    return () => window.removeEventListener('keydown', on_key_down);
  }, [mobile_open, user_modal_open]);

  const handle_sign_out = async () => {
    set_user_modal_open(false);
    await sign_out_user();
    window.location.href = '/';
  };

  const is_auth_page =
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/signup') ||
    pathname?.startsWith('/forgot_password') ||
    pathname?.startsWith('/reset_password');

  if (is_auth_page) {
    return null;
  }

  return (
    <header className="navbar_header">
      <div className="navbar_container">
        {/* Brand Logo & Name */}
        <Link href="/" className="navbar_brand" aria-label="PropertyTap Home">
          <Image
            src="/assets/logo.png"
            alt="PropertyTap Logo"
            width={34}
            height={34}
            className="navbar_logo_img"
            priority
          />
          <span className="navbar_logo_text">
            Property<span className="navbar_logo_blue">Tap</span>
          </span>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <nav className="navbar_nav_links" aria-label="Main Navigation">
          <Link href="/" className={`navbar_nav_item ${pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>
          <Link
            href="/properties"
            className={`navbar_nav_item ${pathname?.startsWith('/properties') ? 'active' : ''}`}
          >
            Properties
          </Link>
          <Link href="/about" className={`navbar_nav_item ${pathname === '/about' ? 'active' : ''}`}>
            About
          </Link>
          <Link
            href="/how-it-works"
            className={`navbar_nav_item ${pathname === '/how-it-works' ? 'active' : ''}`}
          >
            How it works
          </Link>
          <Link
            href="/contact"
            className={`navbar_nav_item ${pathname === '/contact' ? 'active' : ''}`}
          >
            Contact
          </Link>
        </nav>

        {/* Right Actions (Desktop) */}
        <div className="navbar_actions">
          {user ? (
            <div className="navbar_user_menu">
              <Link
                href="/dashboard/notifications"
                className="navbar_notification_badge"
                aria-label="Notifications"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {unread_count > 0 && (
                  <span className="navbar_badge_count">{unread_count}</span>
                )}
              </Link>

              <button
                type="button"
                className="navbar_avatar navbar_avatar_btn"
                onClick={() => set_user_modal_open(!user_modal_open)}
                aria-label="Account Options"
                title="Account Options"
                aria-expanded={user_modal_open}
              >
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
              </button>

              <Link
                href="/dashboard/properties/new"
                className="navbar_get_started_btn"
              >
                + List Property
              </Link>

              {is_admin && (
                <Link href="/admin" className="navbar_admin_link">
                  Admin
                </Link>
              )}
            </div>
          ) : (
            <>
              <Link
                href={`/login?redirect=${encodeURIComponent(pathname || '/')}`}
                className="navbar_login_btn"
              >
                Sign In
              </Link>
              <Link href="/dashboard/properties/new" className="navbar_get_started_btn">
                + List Property
              </Link>
            </>
          )}
        </div>

        {/* Mobile Quick Action & Hamburger */}
        <div className="navbar_mobile_actions">
          {user ? (
            <>
              <Link
                href="/dashboard/notifications"
                className="navbar_mobile_quick_icon"
                aria-label="Notifications"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {unread_count > 0 && <span className="navbar_badge_count">{unread_count}</span>}
              </Link>
              <button
                type="button"
                className="navbar_mobile_avatar_btn"
                onClick={() => set_user_modal_open(!user_modal_open)}
                aria-label="Account Options"
              >
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
              </button>
            </>
          ) : (
            <>
              <Link
                href={`/login?redirect=${encodeURIComponent(pathname || '/')}`}
                className="navbar_mobile_signin_pill"
              >
                Sign In
              </Link>
              <Link href="/dashboard/properties/new" className="navbar_mobile_quick_cta">
                + List
              </Link>
            </>
          )}

          <button
            className={`navbar_hamburger ${mobile_open ? 'is_active' : ''}`}
            onClick={() => set_mobile_open(!mobile_open)}
            aria-label={mobile_open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobile_open}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* ── User Account Modal (Desktop & Mobile) ── */}
      {user && user_modal_open && (
        <div className="navbar_user_modal_backdrop" onClick={() => set_user_modal_open(false)}>
          <div
            className="navbar_user_modal_card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Account Overview"
          >
            <div className="navbar_modal_card_header">
              <div className="navbar_modal_avatar_circle">
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="navbar_modal_user_details">
                <h3 className="navbar_modal_user_name">{profile?.full_name || 'My Account'}</h3>
                <span className="navbar_modal_user_email">{user.email}</span>
              </div>
              <button
                type="button"
                className="navbar_modal_close_btn"
                onClick={() => set_user_modal_open(false)}
                aria-label="Close Account Menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="navbar_modal_divider" />

            <div className="navbar_modal_nav_list">
              <Link
                href="/dashboard/properties"
                className="navbar_modal_menu_item"
                onClick={() => set_user_modal_open(false)}
              >
                <Home size={17} />
                <span>My Properties</span>
              </Link>

              <Link
                href="/dashboard/interests"
                className="navbar_modal_menu_item"
                onClick={() => set_user_modal_open(false)}
              >
                <Heart size={17} />
                <span>My Interests</span>
              </Link>

              <Link
                href="/dashboard/profile"
                className="navbar_modal_menu_item"
                onClick={() => set_user_modal_open(false)}
              >
                <UserIcon size={17} />
                <span>Profile &amp; Password</span>
              </Link>

              {is_admin && (
                <Link
                  href="/admin"
                  className="navbar_modal_menu_item navbar_modal_admin_item"
                  onClick={() => set_user_modal_open(false)}
                >
                  <Shield size={17} />
                  <span>Admin Panel</span>
                </Link>
              )}
            </div>

            <div className="navbar_modal_divider" />

            <button
              type="button"
              className="navbar_modal_signout_btn"
              onClick={handle_sign_out}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer Backdrop & Menu */}
      {mobile_open && (
        <div className="navbar_mobile_backdrop" onClick={() => set_mobile_open(false)} />
      )}

      <div className={`navbar_mobile_drawer ${mobile_open ? 'is_open' : ''}`}>
        {/* Mobile User Card if logged in */}
        {user ? (
          <div className="navbar_mobile_user_card">
            <div className="navbar_mobile_avatar">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="navbar_mobile_user_info">
              <span className="navbar_mobile_user_name">
                {profile?.full_name || 'My Account'}
              </span>
              <span className="navbar_mobile_user_email">
                {user.email}
              </span>
            </div>
            <Link
              href="/dashboard"
              className="navbar_mobile_profile_btn"
              onClick={() => set_mobile_open(false)}
            >
              Dashboard
            </Link>
          </div>
        ) : null}

        {/* Mobile Nav Links */}
        <nav className="navbar_mobile_nav_list" aria-label="Mobile Navigation Links">
          <Link
            href="/"
            className={`navbar_mobile_item ${pathname === '/' ? 'active' : ''}`}
            onClick={() => set_mobile_open(false)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Home</span>
          </Link>
          <Link
            href="/properties"
            className={`navbar_mobile_item ${pathname?.startsWith('/properties') ? 'active' : ''}`}
            onClick={() => set_mobile_open(false)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
            <span>Properties</span>
          </Link>
          <Link
            href="/about"
            className={`navbar_mobile_item ${pathname === '/about' ? 'active' : ''}`}
            onClick={() => set_mobile_open(false)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>About</span>
          </Link>
          <Link
            href="/how-it-works"
            className={`navbar_mobile_item ${pathname === '/how-it-works' ? 'active' : ''}`}
            onClick={() => set_mobile_open(false)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" />
            </svg>
            <span>How it works</span>
          </Link>
          <Link
            href="/contact"
            className={`navbar_mobile_item ${pathname === '/contact' ? 'active' : ''}`}
            onClick={() => set_mobile_open(false)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>Contact</span>
          </Link>

          {is_admin && (
            <Link
              href="/admin"
              className="navbar_mobile_item navbar_mobile_admin_item"
              onClick={() => set_mobile_open(false)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span>Admin Panel</span>
            </Link>
          )}
        </nav>

        {/* Mobile Action Buttons */}
        <div className="navbar_mobile_footer_actions">
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              <Link
                href="/dashboard/properties/new"
                className="navbar_mobile_cta_primary"
                onClick={() => set_mobile_open(false)}
              >
                + List Property (Free)
              </Link>
              <Link
                href="/dashboard"
                className="navbar_mobile_cta_secondary"
                onClick={() => set_mobile_open(false)}
              >
                Go to Dashboard
              </Link>
              <button
                type="button"
                className="navbar_mobile_signout_btn"
                onClick={() => {
                  set_mobile_open(false);
                  handle_sign_out();
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link
                href={`/login?redirect=${encodeURIComponent(pathname || '/')}`}
                className="navbar_mobile_cta_secondary"
                onClick={() => set_mobile_open(false)}
              >
                Sign In
              </Link>
              <Link
                href="/dashboard/properties/new"
                className="navbar_mobile_cta_primary"
                onClick={() => set_mobile_open(false)}
              >
                + List Property (Free)
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
