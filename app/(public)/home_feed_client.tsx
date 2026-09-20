'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PropertyCard from '@/components/property/property_card';
import Button from '@/components/ui/button';
import { PropertyItem, PropertyCategory } from '@/types/property';
import Home_cta_banner from './home_cta_banner';
import Property_filter from '@/components/property/property_filter1'
interface HomeFeedClientProps {
  initial_properties: PropertyItem[];
  initial_categories: PropertyCategory[];
}

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
              <Property_filter
                categories={initial_categories}
                on_filter_change={(filters) => {
                  const params = new URLSearchParams();
                  if (filters.city) {
                    params.set('q', filters.city);
                  }
                  if (filters.purpose) {
                    params.set('purpose', filters.purpose);
                  }
                  if (filters.category_id) {
                    params.set('category_id', filters.category_id);
                  }
                  if (filters.min_price !== undefined) {
                    params.set(
                      'min_price',
                      String(filters.min_price)
                    );
                  }
                  if (filters.max_price !== undefined) {
                    params.set(
                      'max_price',
                      String(filters.max_price)
                    );
                  }

                  if (filters.sort_by) {
                    params.set(
                      'sort_by',
                      filters.sort_by
                    );
                  }

                  router.push(
                    `/search?${params.toString()}`
                  );
                }}
              />
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
          SECTION 3 — BROWSE BY PROPERTY TYPE + LATEST FEED
      ═══════════════════════════════════════════════════════════ */}
      <section className="home_feed_section">

        {/* ── Property Type Cards ── */}
        <div className="home_type_header">
          <h2 className="home_feed_title">Browse by Property Type</h2>
          <p className="home_feed_subtitle">Find exactly what you're looking for.</p>
        </div>

        <div className="home_type_grid">

          {/* House */}
          <button
            type="button"
            className="home_type_card"
            onClick={() => router.push('/search?q=house')}
          >
            <div className="home_type_icon home_type_icon--blue">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
                <path d="M9 21V12h6v9" />
              </svg>
            </div>
            <span className="home_type_label">House</span>
            <span className="home_type_sublabel">Independent homes</span>
          </button>

          {/* Flat / Apartment */}
          <button
            type="button"
            className="home_type_card"
            onClick={() => router.push('/search?q=flat')}
          >
            <div className="home_type_icon home_type_icon--purple">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M3 15h18M9 3v18" />
              </svg>
            </div>
            <span className="home_type_label">Flat / Apartment</span>
            <span className="home_type_sublabel">Ready-to-move units</span>
          </button>

          {/* PG / Hostel */}
          <button
            type="button"
            className="home_type_card"
            onClick={() => router.push('/search?q=pg')}
          >
            <div className="home_type_icon home_type_icon--orange">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 20h20M4 20V8l8-5 8 5v12" />
                <rect x="9" y="13" width="6" height="7" />
                <path d="M9 9h.01M15 9h.01" />
              </svg>
            </div>
            <span className="home_type_label">PG / Hostel</span>
            <span className="home_type_sublabel">Rooms &amp; shared spaces</span>
          </button>

          {/* Land & Plot */}
          <button
            type="button"
            className="home_type_card"
            onClick={() => router.push('/search?q=plot')}
          >
            <div className="home_type_icon home_type_icon--green">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="1" />
                <path d="M3 11 12 3l9 8" />
                <path d="M8 21v-5h8v5" />
              </svg>
            </div>
            <span className="home_type_label">Land &amp; Plot</span>
            <span className="home_type_sublabel">Open plots &amp; farmland</span>
          </button>

          {/* Office */}
          <button
            type="button"
            className="home_type_card"
            onClick={() => router.push('/search?q=office')}
          >
            <div className="home_type_icon home_type_icon--teal">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="18" rx="2" />
                <path d="M8 3v18M16 3v18M2 9h20M2 15h20" />
              </svg>
            </div>
            <span className="home_type_label">Office Space</span>
            <span className="home_type_sublabel">Commercial &amp; coworking</span>
          </button>

          {/* Shop */}
          <button
            type="button"
            className="home_type_card"
            onClick={() => router.push('/search?q=shop')}
          >
            <div className="home_type_icon home_type_icon--red">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <line x1="3" x2="21" y1="6" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <span className="home_type_label">Shop / Showroom</span>
            <span className="home_type_sublabel">Retail &amp; commercial</span>
          </button>

          {/* Villa */}
          <button
            type="button"
            className="home_type_card"
            onClick={() => router.push('/search?q=villa')}
          >
            <div className="home_type_icon home_type_icon--pink">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21V9l9-7 9 7v12H3Z" />
                <path d="M9 21V13h6v8" />
                <path d="M3 9h18" />
              </svg>
            </div>
            <span className="home_type_label">Villa</span>
            <span className="home_type_sublabel">Luxury &amp; premium homes</span>
          </button>

          {/* Warehouse */}
          <button
            type="button"
            className="home_type_card"
            onClick={() => router.push('/search?q=warehouse')}
          >
            <div className="home_type_icon home_type_icon--gray">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 20h20V8L12 2 2 8v12Z" />
                <path d="M12 2v6M2 8h20" />
                <rect x="8" y="14" width="8" height="6" />
              </svg>
            </div>
            <span className="home_type_label">Warehouse</span>
            <span className="home_type_sublabel">Storage &amp; industrial</span>
          </button>
        </div>
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