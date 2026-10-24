import React from 'react';
import Link from 'next/link';
import './home_cta_bottom.css';

export default function HomeCtaBottom() {
  return (
    <section className="hcb_section">
      <div className="hcb_container">
        <h2 className="hcb_title">Ready to Find Your Next Property?</h2>
        <p className="hcb_desc">
          Join PropertyTap today and explore thousands of verified properties.
        </p>
        <div className="hcb_btns">
          <Link href="/signup" className="hcb_btn_primary">Get Started</Link>
          <Link href="/properties" className="hcb_btn_secondary">Explore Listings</Link>
        </div>
      </div>
    </section>
  );
}
