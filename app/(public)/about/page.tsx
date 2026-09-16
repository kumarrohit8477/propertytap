import React from 'react';
import './about.css';

export default function AboutPage() {
  return (
    <div className="about_page_container">
      <h1 className="about_page_title">About Property Tap</h1>
      <p className="about_page_text">
        Property Tap is a modern real-estate social discovery platform designed to connect property listers (owners, landlords, dealers, brokers) directly with property seekers.
      </p>
      <p className="about_page_text">
        Our core philosophy is simple: <strong>Zero Brokerage</strong>. Property Tap operates purely as an information and connection mediator and is not a party to any property transaction. We eliminate middleman commissions and make real-estate discovery seamless and transparent.
      </p>
    </div>
  );
}
