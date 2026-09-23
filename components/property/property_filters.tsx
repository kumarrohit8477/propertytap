'use client';

import React, { useState, useEffect } from 'react';
import { PropertyFilterParams, PropertyCategory } from '@/types/property';
import Button from '@/components/ui/button';
import './property_filters.css';

interface PropertyFiltersProps {
  categories: PropertyCategory[];
  initial_filters?: PropertyFilterParams;
  on_filter_change: (filters: PropertyFilterParams) => void;
}

export default function PropertyFilters({
  categories = [],
  initial_filters = {},
  on_filter_change,
}: PropertyFiltersProps) {
  const [city, set_city] = useState(initial_filters.city || '');
  const [purpose, set_purpose] = useState<string>(initial_filters.purpose || '');
  const [category_id, set_category_id] = useState(initial_filters.category_id || '');
  const [min_price, set_min_price] = useState<string>(
    initial_filters.min_price ? String(initial_filters.min_price) : ''
  );
  const [max_price, set_max_price] = useState<string>(
    initial_filters.max_price ? String(initial_filters.max_price) : ''
  );
  const [bedrooms, set_bedrooms] = useState<string>(
    initial_filters.bedrooms ? String(initial_filters.bedrooms) : ''
  );
  const [furnishing, set_furnishing] = useState<string>(initial_filters.furnishing || '');
  const [sort_by, set_sort_by] = useState<string>(initial_filters.sort_by || 'newest');

  // Sync sidebar fields whenever initial_filters changes
  useEffect(() => {
    set_city(initial_filters.city || '');
    set_purpose(initial_filters.purpose || '');
    set_category_id(initial_filters.category_id || '');
    set_min_price(initial_filters.min_price ? String(initial_filters.min_price) : '');
    set_max_price(initial_filters.max_price ? String(initial_filters.max_price) : '');
    set_bedrooms(initial_filters.bedrooms ? String(initial_filters.bedrooms) : '');
    set_furnishing(initial_filters.furnishing || '');
    set_sort_by(initial_filters.sort_by || 'newest');
  }, [
    initial_filters.city,
    initial_filters.purpose,
    initial_filters.category_id,
    initial_filters.min_price,
    initial_filters.max_price,
    initial_filters.bedrooms,
    initial_filters.furnishing,
    initial_filters.sort_by,
  ]);

  // Count active filters
  const active_count = [
    city,
    purpose,
    category_id,
    min_price,
    max_price,
    bedrooms,
    furnishing,
    sort_by !== 'newest' ? sort_by : '',
  ].filter(Boolean).length;

  const handle_apply = () => {
    on_filter_change({
      city: city || undefined,
      purpose: (purpose as any) || undefined,
      category_id: category_id || undefined,
      min_price: min_price ? Number(min_price) : undefined,
      max_price: max_price ? Number(max_price) : undefined,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      furnishing: furnishing || undefined,
      sort_by: sort_by as any,
    });
  };

  const handle_reset = () => {
    set_city('');
    set_purpose('');
    set_category_id('');
    set_min_price('');
    set_max_price('');
    set_bedrooms('');
    set_furnishing('');
    set_sort_by('newest');

    on_filter_change({ sort_by: 'newest' });
  };

  return (
    <div className="property_filters_card">
      <div className="property_filters_header">
        <div className="property_filters_header_title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          <h3>Filters</h3>
          {active_count > 0 && (
            <span className="property_filters_badge">{active_count}</span>
          )}
        </div>
        {active_count > 0 && (
          <button type="button" className="property_filters_reset_btn" onClick={handle_reset}>
            Reset
          </button>
        )}
      </div>

      <div className="property_filters_body">
        {/* Purpose Filter Pills */}
        <div className="property_filters_group">
          <label className="property_filters_label">Property Purpose</label>
          <div className="property_filters_pills">
            <button
              type="button"
              className={`property_filter_pill ${purpose === '' ? 'active' : ''}`}
              onClick={() => set_purpose('')}
            >
              All
            </button>
            <button
              type="button"
              className={`property_filter_pill ${purpose === 'rent' ? 'active' : ''}`}
              onClick={() => set_purpose('rent')}
            >
              Rent
            </button>
            <button
              type="button"
              className={`property_filter_pill ${purpose === 'sale' ? 'active' : ''}`}
              onClick={() => set_purpose('sale')}
            >
              Sale
            </button>
          </div>
        </div>

        {/* City Filter */}
        <div className="property_filters_group">
          <label className="property_filters_label">City / Location</label>
          <div className="property_filters_input_wrapper">
            <svg className="input_icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <input
              type="text"
              className="property_filters_input with_icon"
              placeholder="e.g. Agra, Delhi..."
              value={city}
              onChange={(e) => set_city(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="property_filters_group">
          <label className="property_filters_label">Category</label>
          <select
            className="property_filters_select"
            value={category_id}
            onChange={(e) => set_category_id(e.target.value)}
          >
            <option value="">All Property Types</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="property_filters_group">
          <label className="property_filters_label">Budget Range (₹)</label>
          <div className="property_filters_price_row">
            <input
              type="number"
              className="property_filters_input"
              placeholder="Min"
              value={min_price}
              onChange={(e) => set_min_price(e.target.value)}
            />
            <span className="price_divider">-</span>
            <input
              type="number"
              className="property_filters_input"
              placeholder="Max"
              value={max_price}
              onChange={(e) => set_max_price(e.target.value)}
            />
          </div>
        </div>

        {/* Bedrooms BHK */}
        <div className="property_filters_group">
          <label className="property_filters_label">Bedrooms (BHK)</label>
          <div className="property_filters_bhk_row">
            {['', '1', '2', '3', '4'].map((val) => (
              <button
                key={val}
                type="button"
                className={`bhk_chip ${bedrooms === val ? 'active' : ''}`}
                onClick={() => set_bedrooms(val)}
              >
                {val === '' ? 'Any' : `${val}${val === '4' ? '+' : ''}`}
              </button>
            ))}
          </div>
        </div>

        {/* Furnishing */}
        <div className="property_filters_group">
          <label className="property_filters_label">Furnishing</label>
          <select
            className="property_filters_select"
            value={furnishing}
            onChange={(e) => set_furnishing(e.target.value)}
          >
            <option value="">Any Furnishing</option>
            <option value="unfurnished">Unfurnished</option>
            <option value="semi-furnished">Semi-Furnished</option>
            <option value="furnished">Fully Furnished</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="property_filters_group">
          <label className="property_filters_label">Sort By</label>
          <select
            className="property_filters_select"
            value={sort_by}
            onChange={(e) => set_sort_by(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="property_filters_actions">
        <Button variant="secondary" onClick={handle_reset}>
          Reset
        </Button>
        <Button variant="primary" onClick={handle_apply} full_width={true}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
