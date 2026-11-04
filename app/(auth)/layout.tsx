import React from 'react';
import './auth_layout.css';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth_page_layout">
      {/* Blurred background image and overlay */}
      <div className="auth_backdrop" aria-hidden="true">
        <img
          src="/assets/herobg.png"
          alt=""
          className="auth_backdrop_image"
        />
        <div className="auth_backdrop_overlay" />
      </div>

      <div className="auth_page_content">
        {children}
      </div>
    </div>
  );
}
