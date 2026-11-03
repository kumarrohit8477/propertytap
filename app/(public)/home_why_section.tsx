import React from 'react';
import Image from 'next/image';
import './home_why_section.css';

const FEATURES = [
  {
    icon: (
      <div className="hwy_icon_circle hwy_icon_blue">
        <Image src="/assets/call.png" alt="Direct Connectivity" width={35} height={35} />
      </div>
    ),
    title: 'Direct Connectivity',
    desc: 'Connect directly with owners and genuine property seekers.',
  },
  {
    icon: (
      <div className="hwy_icon_circle hwy_icon_green">
        <Image src="/assets/batch.png" alt="Verified Listings" width={45} height={45} />
      </div>
    ),
    title: 'Verified Listings',
    desc: 'Authentic and verified properties.',
  },
  {
    icon: (
      <div className="hwy_icon_circle hwy_icon_blue">
        <Image src="/assets/home.png" alt="Wide Range" width={40} height={40} />
      </div>
    ),
    title: 'Wide Range',
    desc: 'Homes, PGs, offices, shops and more.',
  },
  {
    icon: (
      <div className="hwy_icon_circle hwy_icon_amber">
        <Image src="/assets/flash.png" alt="Easy & Fast" width={32} height={32} />
      </div>
    ),
    title: 'Easy & Fast',
    desc: 'Find the right property quickly with smart filters.',
  },
];

const STATS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
        <path d="M9 22v-4h6v4"/>
        <path d="M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01"/>
      </svg>
    ),
    value: '10K+',
    label: 'Registered Users',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    value: '5K+',
    label: 'Active Listings',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l.77.77L12 20.66l7.65-7.66.77-.77a5.4 5.4 0 0 0 0-7.65z"/>
      </svg>
    ),
    value: '1K+',
    label: 'Successful Connections',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="#475569" stroke="#475569" strokeWidth="1">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    value: '4.8/5',
    label: 'User Rating',
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

        {/* Stats bar */}
        <div className="hwy_stats">
          {STATS.map((s) => (
            <div key={s.label} className="hwy_stat_item">
              <div className="hwy_stat_icon">{s.icon}</div>
              <div className="hwy_stat_text">
                <span className="hwy_stat_value">{s.value}</span>
                <span className="hwy_stat_label">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
