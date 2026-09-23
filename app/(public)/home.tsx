'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PropertyCategory, PropertyFilterParams } from '@/types/property';
import Home_cta_banner from './home_cta_banner';
import PropertyFilters from '@/components/property/property_filter1';
import HomePropertyTypes from './home_property_types';
import HomeWhySection from './home_why_section';
import Image from 'next/image';
import { FiArrowRight } from 'react-icons/fi';

interface HomeFeedClientProps {
  initial_categories: PropertyCategory[];
}

export default function HomeFeedClient({
  initial_categories,
}: HomeFeedClientProps) {
  const router = useRouter();

  // ── Centralized Filter Handler ──────────────────────────────────────
  const handle_filter_change = (filters: PropertyFilterParams) => {
    const params = new URLSearchParams();

    if (filters.city) params.set('q', filters.city);
    if (filters.purpose) params.set('purpose', filters.purpose);
    if (filters.category_id) params.set('category_id', filters.category_id);
    if (filters.min_price !== undefined) params.set('min_price', String(filters.min_price));
    if (filters.max_price !== undefined) params.set('max_price', String(filters.max_price));
    if (filters.sort_by) params.set('sort_by', filters.sort_by);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <>
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

            {/* INJECTED MODULAR SEARCH COMPONENT */}
            <PropertyFilters
              categories={initial_categories}
              on_filter_change={handle_filter_change}
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="home_hero_right">
            <div className="home_hero_script">
              <span>More</span>
              <span>Possibilities</span>
              <span>A Brighter You</span>
              <div className="home_script_line" />
            </div>

            <div className="home_hero_bottom_card">
              <div className="home_bottom_card_icon">
                <Image
                  src="/assets/flower.png"
                  alt="Free for Owners"
                  width={40}
                  height={40}
                />
              </div>
              <div className="home_bottom_card_text">
                <span>Spaces for a</span>
                <strong>Brighter Tomorrow</strong>
              </div>
              <button
                type="button"
                className="home_bottom_card_arrow"
                onClick={() => router.push('/search')}
              >
                <FiArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>
      <HomeWhySection />
      <HomePropertyTypes />
      <Home_cta_banner />
    </>
  );
}