'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PropertyCard from '@/components/property/property_card';
import PropertyFilters from '@/components/property/property_filters';
import Button from '@/components/ui/button';
import { get_properties, get_categories } from '@/lib/properties/property_service';
import { PropertyItem, PropertyCategory, PropertyFilterParams } from '@/types/property';

interface HomeFeedClientProps {
  initial_properties: PropertyItem[];
  initial_categories: PropertyCategory[];
}

export default function HomeFeedClient({
  initial_properties,
  initial_categories,
}: HomeFeedClientProps) {
  const [properties, set_properties] = useState<PropertyItem[]>(initial_properties);
  const [categories] = useState<PropertyCategory[]>(initial_categories);
  const [loading, set_loading] = useState(false);
  const [active_category_id, set_active_category_id] = useState<string>('');
  const [filters, set_filters] = useState<PropertyFilterParams>({});

  const apply_filters = async (new_filters: PropertyFilterParams) => {
    set_loading(true);
    const { properties: fetched } = await get_properties(new_filters);
    set_properties(fetched);
    set_loading(false);
  };

  const handle_category_pill_click = (cat_id: string) => {
    const new_cat = active_category_id === cat_id ? '' : cat_id;
    set_active_category_id(new_cat);
    const new_filters = { ...filters, category_id: new_cat || undefined };
    set_filters(new_filters);
    apply_filters(new_filters);
  };

  const handle_filter_change = (new_filters: PropertyFilterParams) => {
    set_filters(new_filters);
    apply_filters(new_filters);
  };

  return (
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
            <p style={{ marginTop: '0.5rem' }}>
              Try adjusting your filters or be the first to list a property in this location!
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
      </div>

      <div className="home_cta_banner">
        <div>
          <h3 className="home_cta_title">Have a Property to Rent or Sell?</h3>
          <p className="home_cta_text">
            Post your property listing today for ₹0. Reach thousands of property seekers directly.
          </p>
        </div>
        <Link href="/dashboard/properties/new">
          <Button
            variant="secondary"
            style={{ backgroundColor: '#ffffff', color: '#047857', fontWeight: 700 }}
          >
            List Property Now (Free)
          </Button>
        </Link>
      </div>
    </section>
  );
}
