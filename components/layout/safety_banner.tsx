'use client';

import React, { useState } from 'react';
import './safety_banner.css';

export default function SafetyBanner() {
  const [is_dismissed, set_is_dismissed] = useState(false);

  if (is_dismissed) return null;

  return (
    <div className="safety_banner_wrapper">
      <div className="safety_banner_container">
        <div className="safety_banner_content">
          <span className="safety_banner_icon">⚠️</span>
          <div>
            <strong className="safety_banner_title">Safety First:</strong>
            Property Tap connects property seekers with property listers. Property Tap is not a party to any property transaction. Never send money directly without independently verifying identity, property ownership, physical existence, documents, and transaction details.
          </div>
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
