import React from 'react';
import './terms.css';

export default function TermsPage() {
  return (
    <div className="terms_page_container">
      <h1 className="terms_page_title">Terms of Service</h1>
      <p className="terms_page_text">
        By accessing Property Tap, you agree to these Terms of Service. Property Tap functions solely as a mediator connecting property seekers and property listers.
      </p>
      <p className="terms_page_text">
        Property Tap does NOT charge brokerage and is NOT a party to any lease, sale, purchase, or rental transaction. Users are solely responsible for independently verifying all property details, ownership documents, physical conditions, and identity credentials before executing any transactions.
      </p>
    </div>
  );
}
