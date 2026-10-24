'use client';

import React from 'react';
import Link from 'next/link';
import './home_latest_feed.css';

const SAMPLE_PROPERTIES = [
  {
    id: '1',
    badge: 'For Sale',
    badge_color: 'indigo',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    title: '3 BHK Independent House',
    price: '₹85,00,000',
    price_suffix: '',
    location: 'Indira Nagar, Lucknow',
    beds: 3,
    baths: 3,
    area: '1,600',
    href: '/properties',
  },
  {
    id: '2',
    badge: 'For Rent',
    badge_color: 'sky',
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
    title: '2 BHK Apartment',
    price: '₹18,000',
    price_suffix: '/ month',
    location: 'Sector 62, Noida',
    beds: 2,
    baths: 2,
    area: '1,200',
    href: '/properties',
  },
  {
    id: '3',
    badge: 'PG / Hostel',
    badge_color: 'purple',
    img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80',
    title: 'Girls PG (Fully Furnished)',
    price: '₹7,500',
    price_suffix: '/ month',
    location: 'Lajpat Nagar, Delhi',
    beds: 1,
    baths: 1,
    area: '360',
    href: '/properties',
  },
  {
    id: '4',
    badge: 'Commercial',
    badge_color: 'amber',
    img: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80',
    title: 'Shop for Rent',
    price: '₹45,000',
    price_suffix: '/ month',
    location: 'MG Road, Gurgaon',
    beds: null,
    baths: null,
    area: '1,000',
    href: '/properties',
  },
];

const BADGE_COLORS: Record<string, string> = {
  indigo: '#4f46e5',
  sky: '#0284c7',
  purple: '#7c3aed',
  amber: '#ea580c',
};

export default function HomeLatestFeed() {
  return (
    <section className="hlf_section">
      <div className="hlf_container">
        <div className="hlf_header">
          <div>
            <h2 className="hlf_title">Latest Property Feed</h2>
            <p className="hlf_subtitle">Discover recently added properties from across cities</p>
          </div>
          <Link href="/properties" className="hlf_view_all">
            View All →
          </Link>
        </div>

        <div className="hlf_grid">
          {SAMPLE_PROPERTIES.map((prop) => (
            <Link href={prop.href} key={prop.id} className="hlf_card">
              <div className="hlf_img_wrap">
                <img src={prop.img} alt={prop.title} className="hlf_img" />
                <span
                  className="hlf_badge"
                  style={{ background: BADGE_COLORS[prop.badge_color] }}
                >
                  {prop.badge}
                </span>
                <button className="hlf_wishlist" aria-label="Save">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>
              <div className="hlf_content">
                <h3 className="hlf_card_title">{prop.title}</h3>
                <div className="hlf_price">
                  {prop.price}
                  {prop.price_suffix && <span className="hlf_price_suffix">{prop.price_suffix}</span>}
                </div>
                <div className="hlf_location">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {prop.location}
                </div>
                <div className="hlf_meta">
                  {prop.beds !== null && (
                    <span>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/>
                        <path d="M2 14h20M6 14v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/>
                      </svg>
                      {prop.beds} Beds
                    </span>
                  )}
                  {prop.baths !== null && (
                    <span>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 12h16M4 12a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H4z"/>
                      </svg>
                      {prop.baths} Baths
                    </span>
                  )}
                  <span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <path d="M3 9h18M9 21V9"/>
                    </svg>
                    {prop.area} sq.ft
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
