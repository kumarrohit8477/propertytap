import React from 'react';
import Image from 'next/image';
import './home_why_section.css';

export default function HomeWhySection() {
  return (
    <div className="home_why_container">
      <div className="home_why_header">
        <h2 className="home_why_title">Why Choose Property Tap?</h2>
        <p className="home_why_subtitle">
          A simpler, safer and smarter way to find or list properties.
        </p>
      </div>

      <div className="home_why_grid">
        <div className="home_why_card">
          <div className="home_why_icon">
            <Image 
              src="/assets/flash.png" 
              alt="Easy and Fast" 
              width={40}
              height={40}
            />
          </div>
          <div className="home_why_content">
            <h3 className="home_why_card_title">Easy &amp; Fast</h3>
            <p className="home_why_card_text">
              Find or list a property<br />in minutes.
            </p>
          </div>
        </div>

        <div className="home_why_card">
          <div className="home_why_icon">
            <Image 
              src="/assets/batch.png" 
              alt="Verified Listings" 
              width={45}
              height={45}
            />
          </div>
          <div className="home_why_content">
            <h3 className="home_why_card_title">Verified Listings</h3>
            <p className="home_why_card_text">
              Real properties,<br />real people.
            </p>
          </div>
        </div>

        <div className="home_why_card">
          <div className="home_why_icon">
            <Image 
              src="/assets/people.png" 
              alt="For Everyone" 
              width={50}
              height={35}
            />
          </div>
          <div className="home_why_content">
            <h3 className="home_why_card_title">For Everyone</h3>
            <p className="home_why_card_text">
              Owners, buyers, tenants<br />— all in one place.
            </p>
          </div>
        </div>

        <div className="home_why_card">
          <div className="home_why_icon">
            <Image 
              src="/assets/leaf.png" 
              alt="Free for Owners" 
              width={40}
              height={40}
            />
          </div>
          <div className="home_why_content">
            <h3 className="home_why_card_title">Completely Free<br />for Owners</h3>
            <p className="home_why_card_text">
              List your property<br />at zero cost.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}