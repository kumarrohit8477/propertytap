import React from 'react';
import './safety.css';

export default function SafetyPage() {
  return (
    <div className="safety_page_container">
      <h1 className="safety_page_title">Safety &amp; Verification Guidelines</h1>
      <p style={{ color: '#4b5563', fontSize: '1.05rem' }}>
        Property Tap is dedicated to creating a trustworthy connection platform. Please read these mandatory safety guidelines carefully before engaging in any property transactions.
      </p>

      <div className="safety_card_grid">
        <div className="safety_card">
          <span className="safety_card_icon">🚫</span>
          <h3 className="safety_card_title">Never Send Money Upfront</h3>
          <p className="safety_card_text">
            Do not transfer token amounts, security deposits, booking fees, or advance payments to anyone before inspecting the property in person.
          </p>
        </div>

        <div className="safety_card">
          <span className="safety_card_icon">🔍</span>
          <h3 className="safety_card_title">Verify Property Ownership</h3>
          <p className="safety_card_text">
            Request to inspect physical ownership documents, title deeds, electricity bills, and government ID of the lister before proceeding.
          </p>
        </div>

        <div className="safety_card">
          <span className="safety_card_icon">🏢</span>
          <h3 className="safety_card_title">Visit Property Physically</h3>
          <p className="safety_card_text">
            Always schedule an in-person visit to verify that the property exists, matches the pictures, and is vacant as advertised.
          </p>
        </div>

        <div className="safety_card">
          <span className="safety_card_icon">📝</span>
          <h3 className="safety_card_title">Sign Formal Agreements</h3>
          <p className="safety_card_text">
            Ensure all terms, monthly rent, security deposit refund terms, and notice periods are documented in a formal lease or sale agreement.
          </p>
        </div>
      </div>
    </div>
  );
}
