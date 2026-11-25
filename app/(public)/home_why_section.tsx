import React from 'react';
import Image from 'next/image';
import './home_why_section.css';

const FEATURES = [
  {
    icon: (
      <div className="hwy_icon_circle hwy_icon_blue">
        <Image src="/assets/call.png" alt="Direct Connectivity" width={35} height={35} style={{ width: 'auto', height: 'auto' }} />
      </div>
    ),
    title: 'Direct Connectivity',
    desc: 'Connect directly with owners and genuine property seekers.',
  },
  {
    icon: (
      <div className="hwy_icon_circle hwy_icon_green">
        <Image src="/assets/batch.png" alt="Verified Listings" width={45} height={45} style={{ width: 'auto', height: 'auto' }} />
      </div>
    ),
    title: 'Verified Listings',
    desc: 'Authentic and verified properties.',
  },
  {
    icon: (
      <div className="hwy_icon_circle hwy_icon_blue">
        <Image src="/assets/home.png" alt="Wide Range" width={40} height={40} style={{ width: 'auto', height: 'auto' }} />
      </div>
    ),
    title: 'Wide Range',
    desc: 'Homes, PGs, offices, shops and more.',
  },
  {
    icon: (
      <div className="hwy_icon_circle hwy_icon_amber">
        <Image src="/assets/flash.png" alt="Easy & Fast" width={32} height={32} style={{ width: 'auto', height: 'auto' }} />
      </div>
    ),
    title: 'Easy & Fast',
    desc: 'Find the right property quickly with smart filters.',
  },
];



export default function HomeWhySection() {
  return (
    <section className="hwy_section">
      <div className="hwy_container">
        <div className="hwy_header">
          <h2 className="hwy_title">Why Choose PropertyTap?</h2>
          <p className="hwy_subtitle">We make property search simple, transparent and hassle-free.</p>
        </div>

        {/* Feature cards */}
        <div className="hwy_grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="hwy_card">
              <div className="hwy_icon">{f.icon}</div>
              <div>
                <h3 className="hwy_card_title">{f.title}</h3>
                <p className="hwy_card_desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
