'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PropertyCard from '@/components/property/property_card';
import Button from '@/components/ui/button';
import { PropertyItem, PropertyCategory } from '@/types/property';
import Home_cta_banner from './home_cta_banner';

interface HomeFeedClientProps {
  initial_properties: PropertyItem[];
  initial_categories: PropertyCategory[];
}

const POPULAR_CITIES = ['Delhi', 'Bangalore', 'Mumbai', 'Pune', 'Hyderabad', 'Noida'];

const PURPOSE_TABS = [
  { label: 'Buy',        value: 'sale',       coming_soon: false },
  { label: 'Rent',       value: 'rent',       coming_soon: false },
  { label: 'Plot/Land',  value: 'plot',       coming_soon: true  },
  { label: 'Commercial', value: 'commercial', coming_soon: true  },
  { label: 'PGs/Hostel', value: 'pg',         coming_soon: true  },
];

const BUDGET_OPTIONS = [
  { label: 'Budget', value: '' },
  { label: 'Under ₹20 Lakh', value: '0-2000000' },
  { label: '₹20L – ₹50L', value: '2000000-5000000' },
  { label: '₹50L – ₹1 Cr', value: '5000000-10000000' },
  { label: '₹1 Cr – ₹2 Cr', value: '10000000-20000000' },
  { label: 'Above ₹2 Cr', value: '20000000-999999999' },
];

export default function HomeFeedClient({
  initial_properties,
  initial_categories,
}: HomeFeedClientProps) {
  const router = useRouter();

  // ── Hero Search State ──────────────────────────────────────────────
  const [active_purpose, set_active_purpose] = useState('sale');
  const [search_query, set_search_query] = useState('');
  const [property_type, set_property_type] = useState('');
  const [budget, set_budget] = useState('');

  // ── Feed State ─────────────────────────────────────────────────────
  const [properties, set_properties] = useState<PropertyItem[]>(initial_properties);
  const [loading, set_loading] = useState(false);

  // ── Search Handler ─────────────────────────────────────────────────
  const handle_search = () => {
    const params = new URLSearchParams();
    if (search_query) params.set('q', search_query);

    // Only pass purpose for valid DB enum values
    const valid_purposes = ['sale', 'rent'];
    if (valid_purposes.includes(active_purpose)) {
      params.set('purpose', active_purpose);
    }

    if (property_type) params.set('category_id', property_type);
    if (budget) {
      const [min, max] = budget.split('-');
      if (min) params.set('min_price', min);
      if (max) params.set('max_price', max);
    }
    router.push(`/search?${params.toString()}`);
  };

  const handle_city_click = (city: string) => {
    router.push(`/search?q=${encodeURIComponent(city)}`);
  };

  const handle_key_down = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handle_search();
  };


  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ═══════════════════════════════════════════════════════════ */}
  <section className="home_hero_section">
  <div className="home_hero_background">
    <img
      src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1800&auto=format&fit=crop"
      alt="Modern property"
      className="home_hero_background_image"
      fetchPriority="high"
      loading="eager"
    />
    <div className="home_hero_overlay" />
  </div>

  <div className="home_hero_inner">

    {/* LEFT CONTENT */}
    <div className="home_hero_left">

      <span className="home_hero_label">
        FIND A BETTER PLACE
      </span>

      <h1 className="home_hero_title">
        The Right Property
        <br />
        Just a Tap Away
      </h1>

      <p className="home_hero_subtitle">
        Buy, rent or list properties — homes, offices, plots and
        <br className="desktop_break" />
        more. Simple, transparent and made for everyone.
      </p>

      {/* SEARCH AREA */}
      <div className="home_search_wrapper">

        {/* PURPOSE TABS */}
        <div className="home_purpose_tabs">
          {PURPOSE_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={`home_purpose_tab ${
                active_purpose === tab.value ? 'active' : ''
              }`}
              onClick={() => set_active_purpose(tab.value)}
              title={tab.coming_soon ? 'Coming soon' : undefined}
              style={tab.coming_soon ? { opacity: 0.65 } : undefined}
            >
              {tab.label}
              {tab.coming_soon && (
                <span style={{
                  marginLeft: '4px',
                  fontSize: '8px',
                  fontWeight: 700,
                  color: '#19845f',
                  background: '#d1fae5',
                  borderRadius: '4px',
                  padding: '1px 4px',
                  verticalAlign: 'middle',
                  letterSpacing: '0.02em',
                }}>
                  SOON
                </span>
              )}
            </button>
          ))}
        </div>

        {/* MAIN SEARCH BAR */}
        <div className="home_search_box">

          {/* LOCATION */}
          <div className="home_search_location">
            <span className="home_search_icon">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
            </span>

            <input
              type="text"
              className="home_search_input"
              placeholder="Enter location, landmark or project"
              value={search_query}
              onChange={(e) => set_search_query(e.target.value)}
              onKeyDown={handle_key_down}
            />
          </div>

          {/* DIVIDER */}
          <div className="home_search_divider" />

          {/* PROPERTY TYPE */}
          <div className="home_search_field">
            <select
              className="home_search_select"
              value={property_type}
              onChange={(e) => set_property_type(e.target.value)}
            >
              <option value="">Property Type</option>

              {initial_categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <span className="home_select_arrow">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </div>

          {/* DIVIDER */}
          <div className="home_search_divider" />

          {/* BUDGET */}
          <div className="home_search_field budget_field">
            <select
              className="home_search_select"
              value={budget}
              onChange={(e) => set_budget(e.target.value)}
            >
              {BUDGET_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <span className="home_select_arrow">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </div>

          {/* SEARCH BUTTON */}
          <button
            type="button"
            className="home_search_btn"
            onClick={handle_search}
          >
            Search
          </button>
        </div>

        {/* POPULAR CITIES */}
        <div className="home_popular_row">

          <span className="home_popular_label">
            Popular:
          </span>

          {POPULAR_CITIES.map((city) => (
            <button
              key={city}
              type="button"
              className="home_popular_chip"
              onClick={() => handle_city_click(city)}
            >
              {city}
            </button>
          ))}

        </div>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="home_hero_right">

      {/* HANDWRITTEN MESSAGE */}
      <div className="home_hero_script">
        <span>More</span>
        <span>Possibilities</span>
        <span>A Brighter You</span>

        <div className="home_script_line" />
      </div>

      {/* BOTTOM FLOATING CARD */}
      <div className="home_hero_bottom_card">

        <div className="home_bottom_card_icon">
          <svg
            width="30"
            height="30"
            viewBox="0 0 48 48"
            fill="none"
          >
            <circle
              cx="24"
              cy="24"
              r="22"
              fill="#EAF5EE"
            />

            <path
              d="M24 37C24 37 16 29.7 16 21.5C16 17.4 19.6 14 24 14C28.4 14 32 17.4 32 21.5C32 29.7 24 37 24 37Z"
              fill="#247C5C"
            />

            <path
              d="M24 30C20.5 26.8 20 22.8 20.8 19.8C22.6 20.4 24.2 22 25 24C25.8 22.3 27 21.1 28.7 20.3C29 24.3 27.5 27.6 24 30Z"
              fill="#76A982"
            />
          </svg>
        </div>

        <div className="home_bottom_card_text">
          <span>Spaces for</span>
          <strong>A Brighter Tomorrow</strong>
        </div>

        <button
          type="button"
          className="home_bottom_card_arrow"
          aria-label="Explore properties"
          onClick={() => router.push('/search')}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </button>

      </div>
    </div>

  </div>
</section>
      {/* ═══════════════════════════════════════════════════════════
          SECTION 2 — WHY CHOOSE PROPERTY TAP?
      ═══════════════════════════════════════════════════════════ */}
     <section className="home_why_section">
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
          <span>⚡</span>
        </div>

        <div className="home_why_content">
          <h3 className="home_why_card_title">Easy &amp; Fast</h3>
          <p className="home_why_card_text">
            Find or list a property
            <br />
            in minutes.
          </p>
        </div>
      </div>

      <div className="home_why_card">
        <div className="home_why_icon">
          <span>🛡️</span>
        </div>

        <div className="home_why_content">
          <h3 className="home_why_card_title">Verified Listings</h3>
          <p className="home_why_card_text">
            Real properties,
            <br />
            real people.
          </p>
        </div>
      </div>

      <div className="home_why_card">
        <div className="home_why_icon">
          <span>👥</span>
        </div>

        <div className="home_why_content">
          <h3 className="home_why_card_title">For Everyone</h3>
          <p className="home_why_card_text">
            Owners, buyers, tenants
            <br />
            — all in one place.
          </p>
        </div>
      </div>

      <div className="home_why_card">
        <div className="home_why_icon">
          <span>🌿</span>
        </div>

        <div className="home_why_content">
          <h3 className="home_why_card_title">
            Completely Free
            <br />
            for Owners
          </h3>
          <p className="home_why_card_text">
            List your property
            <br />
            at zero cost.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3 — LATEST PROPERTY FEED
      ═══════════════════════════════════════════════════════════ */}
      <section className="home_feed_section">
        {/* Feed Header */}
        <div className="home_feed_header">
          <div>
            <h2 className="home_feed_title">Latest Property Feed</h2>
            <p className="home_feed_subtitle">Discover new properties added by owners and agents.</p>
          </div>
          <Link href="/search" className="home_feed_view_all">
            View All →
          </Link>
        </div>

        {/* Property Grid */}
        {loading ? (
          <div className="home_feed_loading">
            <p>Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="home_feed_empty">
            <h3>No properties found</h3>
            <p style={{ marginTop: '0.5rem' }}>
              Be the first to list a property!
            </p>
            <div style={{ marginTop: '1.25rem' }}>
              <Link href="/dashboard/properties/new">
                <Button variant="primary">+ Post Property Free</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="home_feed_grid">
            {properties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4 — CTA BANNER
      ═══════════════════════════════════════════════════════════ */}
      <div className="home_cta_section">
        <Home_cta_banner />
      </div>
    </>
  );
}