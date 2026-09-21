import React from 'react';
import './safety.css';

export const metadata = {
  title: 'Trust & Safety | PropertyTap',
  description: 'Learn about our commitment to secure communication, verified listings, and a zero-brokerage ecosystem.',
};

export default function SafetyPage() {
  return (
    <div className="safety_page_container">
      <h1 className="safety_page_title">Trust & Safety</h1>
      
      <div className="safety_card_grid">
        <div className="safety_card">
          <div className="safety_card_icon">🛡️</div>
          <h3 className="safety_card_title">Verified Listings</h3>
          <p className="safety_card_text">
            We employ rigorous verification checks to ensure every property on our platform belongs to genuine owners.
          </p>
        </div>

        <div className="safety_card">
          <div className="safety_card_icon">🔒</div>
          <h3 className="safety_card_title">Secure Communication</h3>
          <p className="safety_card_text">
            Connect directly with owners or buyers through our trusted platform while keeping your contact details completely private.
          </p>
        </div>

        <div className="safety_card">
          <div className="safety_card_icon">🤝</div>
          <h3 className="safety_card_title">Zero Brokerage</h3>
          <p className="safety_card_text">
            Say goodbye to middleman fees. We foster an open, transparent marketplace where buyers and sellers deal entirely on their own terms.
          </p>
        </div>
      </div>
    </div>
  );
}