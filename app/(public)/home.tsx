'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PropertyCategory, PropertyFilterParams } from '@/types/property';
import PropertyFilters from '@/components/property/property_filter1';
import HomePropertyTypes from './home_property_types';
import HomeLatestFeed from './home_latest_feed';
import HomeMobileApp from './home_mobile_app';
import HomeWhySection from './home_why_section';
import HomeTestimonials from './home_testimonials';
import HomeCtaBottom from './home_cta_bottom';
import './home.css';

interface HomeFeedClientProps {
  initial_categories: PropertyCategory[];
}

export default function HomeFeedClient({ initial_categories }: HomeFeedClientProps) {
  const router = useRouter();

  const handle_filter_change = (filters: PropertyFilterParams) => {
    const params = new URLSearchParams();
    if (filters.city) params.set('q', filters.city);
    if (filters.purpose) params.set('purpose', filters.purpose);
    if (filters.category_id) params.set('category_id', filters.category_id);
    if (filters.min_price !== undefined) params.set('min_price', String(filters.min_price));
    if (filters.max_price !== undefined) params.set('max_price', String(filters.max_price));
    if (filters.sort_by && filters.sort_by !== 'newest') params.set('sort_by', filters.sort_by);
    const qs = params.toString();
    router.push(`/properties${qs ? `?${qs}` : ''}`);
  };

  return (
    <>
      {/* ── HERO ─────────────────────────────────── */}
      <section className="home_hero_section">
        <div className="home_hero_background">
          <img
            src="/assets/herobg.png"
            alt="Modern property"
            className="home_hero_background_image"
            fetchPriority="high"
            loading="eager"
          />
          <div className="home_hero_overlay" />
        </div>

        <div className="home_hero_inner">
          <div className="home_hero_left">
            <span className="home_hero_label">
              <span className="home_hero_label_icon">🏠</span>
              Find Your Perfect Property
            </span>
            <h1 className="home_hero_title">
              Buy, Rent or Discover<br />
              <span className="home_hero_title_blue">Your Next Property</span>
            </h1>
            <p className="home_hero_subtitle">
              PropertyTap connects property seekers and owners directly.<br className="desktop_break" />
              Find homes, apartments, PGs, offices, shops and more —<br className="desktop_break" />
              all in one place.
            </p>

            {/* Search Bar */}
            <PropertyFilters
              categories={initial_categories}
              on_filter_change={handle_filter_change}
            />

            {/* Trust badges */}
            <div className="home_hero_trust_badges">
              <span className="home_hero_badge">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                Verified Listings
              </span>
              <span className="home_hero_badge">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Direct Owner Contact
              </span>
              <span className="home_hero_badge">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                Trusted Platform
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── BROWSE BY PROPERTY TYPE ─────────────── */}
      <HomePropertyTypes />
      {/* ── LATEST PROPERTY FEED ────────────────── */}
      <HomeLatestFeed />
      {/* ── WHY CHOOSE PROPERTYTAP ──────────────── */}
      <HomeWhySection />
      {/* ── TESTIMONIALS ────────────────────────── */}
      <HomeTestimonials />
      {/* ── MOBILE APP SECTION ──────────────────── */}
      <HomeMobileApp />
      {/* ── FINAL CTA ───────────────────────────── */}
      <HomeCtaBottom />
    </>
  );
}