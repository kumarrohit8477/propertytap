'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import './safety_banner.css';

export default function SafetyBanner() {
  const pathname = usePathname();
  const [is_dismissed, set_is_dismissed] = useState(false);

  if (is_dismissed || pathname === '/') return null;

  return (
    <div className="safety_banner_wrapper" role="region" aria-label="Safety Warning">
      <div className="safety_banner_container">
        <div className="safety_banner_content">
          <span className="safety_banner_icon" aria-hidden="true">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </span>
          <p className="safety_banner_text">
            <strong className="safety_banner_title">Safety First:</strong> Property Tap is a discovery platform, not a party to any transaction. Never send money without independently verifying identity, ownership, documents, and physical existence.
          </p>
        </div>
        <button
          className="safety_banner_dismiss"
          onClick={() => set_is_dismissed(true)}
          aria-label="Dismiss safety banner"
        >
          &times;
        </button>
      </div>
    </div>
  );
}