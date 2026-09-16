import React from 'react';
import './privacy.css';

export default function PrivacyPage() {
  return (
    <div className="privacy_page_container">
      <h1 className="privacy_page_title">Privacy Policy</h1>
      <p className="privacy_page_text">
        At Property Tap, we respect your privacy. Phone numbers and email addresses remain strictly hidden from public property listings. Private contact details are shared ONLY with another user when you explicitly click &ldquo;Show Interest&rdquo; on a property.
      </p>
      <p className="privacy_page_text">
        We do not sell user data to third parties. All stored authentication tokens and credentials are securely protected via Supabase infrastructure and Row Level Security.
      </p>
    </div>
  );
}
