import React from 'react';
import Link from 'next/link';

function Home_cta_banner() {
  return (
    <div className="home_cta_banner">
      <div className="home_cta_content">
        <h3 className="home_cta_title">Have a property to list?</h3>
        <p className="home_cta_text">
          Reach thousands of genuine buyers and tenants — completely free.
        </p>
      </div>
      <Link href="/dashboard/properties/new" className="home_cta_btn">
        List Your Property →
      </Link>
    </div>
  );
}

export default Home_cta_banner;