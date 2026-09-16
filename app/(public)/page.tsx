'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import PropertyCard from '@/components/property/property_card';
import PropertyFilters from '@/components/property/property_filters';
import { get_properties, get_categories } from '@/lib/properties/property_service';
import { PropertyItem, PropertyCategory, PropertyFilterParams } from '@/types/property';
import Button from '@/components/ui/button';
import './home.css';

export default function HomePage() {
  const [properties, set_properties] = useState<PropertyItem[]>([]);
  const [categories, set_categories] = useState<PropertyCategory[]>([]);
  const [loading, set_loading] = useState(true);
  const [active_category_id, set_active_category_id] = useState<string>('');
  const [filters, set_filters] = useState<PropertyFilterParams>({});

  useEffect(() => {
    async function load_data() {
      set_loading(true);
      const [props_res, cats_res] = await Promise.all([
        get_properties(filters),
        get_categories(),
      ]);
      set_properties(props_res.properties);
      set_categories(cats_res.categories);
      set_loading(false);
    }
    load_data();
  }, [filters]);

  const handle_category_pill_click = (cat_id: string) => {
    const new_cat = active_category_id === cat_id ? '' : cat_id;
    set_active_category_id(new_cat);
    set_filters((prev) => ({ ...prev, category_id: new_cat || undefined }));
  };

  const handle_filter_change = (new_filters: PropertyFilterParams) => {
    set_filters(new_filters);
  };

  return (
    <div>
      <section className="home_hero_section">
        <div className="home_hero_container">
          <span className="home_hero_badge">✨ 100% Launch Discount — Free Listing</span>
          <h1 className="home_hero_title">Property Discovery Meets Social Platform</h1>
          <p className="home_hero_subtitle">
            Connect directly with verified property owners, landlords, and listers. No middleman charges. <strong>₹0 Brokerage forever.</strong>
          </p>
        </div>
      </section>

      <section className="home_feed_section">
        <PropertyFilters
          categories={categories}
          initial_filters={filters}
          on_filter_change={handle_filter_change}
        />

        <div className="home_categories_bar">
          <button
            className={`home_category_pill ${active_category_id === '' ? 'home_category_pill_active' : ''}`}
            onClick={() => handle_category_pill_click('')}
          >
            🔥 All Properties
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`home_category_pill ${active_category_id === cat.id ? 'home_category_pill_active' : ''}`}
              onClick={() => handle_category_pill_click(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: '#111827' }}>
            Latest Property Feed
          </h2>

          {loading ? (
            <div className="home_feed_empty">
              <h3>Loading properties...</h3>
            </div>
          ) : properties.length === 0 ? (
            <div className="home_feed_empty">
              <h3>No properties found</h3>
              <p style={{ marginTop: '0.5rem' }}>Try adjusting your filters or be the first to list a property in this location!</p>
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
        </div>

        <div className="home_cta_banner">
          <div>
            <h3 className="home_cta_title">Have a Property to Rent or Sell?</h3>
            <p className="home_cta_text">Post your property listing today for ₹0. Reach thousands of property seekers directly.</p>
          </div>
          <Link href="/dashboard/properties/new">
            <Button variant="secondary" style={{ backgroundColor: '#ffffff', color: '#047857', fontWeight: 700 }}>
              List Property Now (Free)
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
