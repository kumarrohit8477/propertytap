'use client';

import React, { useState } from 'react';
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
  const [sort_by, set_sort_by] = useState<string>(initial_filters.sort_by || 'newest');

  const handle_apply = () => {
    on_filter_change({
      city: city || undefined,
      purpose: (purpose as any) || undefined,
      category_id: category_id || undefined,
      min_price: min_price ? Number(min_price) : undefined,
      max_price: max_price ? Number(max_price) : undefined,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
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
    set_sort_by('newest');

    on_filter_change({ sort_by: 'newest' });
  };

  return (
    <div className="property_filters_card">
      <h3 className="property_filters_title">Filter & Discover Properties</h3>
      
      <div className="property_filters_grid">
        <div className="property_filters_group">
          <label className="property_filters_label">City</label>
          <input
            type="text"
            className="property_filters_input"
            placeholder="e.g. Agra, Delhi..."
            value={city}
            onChange={(e) => set_city(e.target.value)}
          />
        </div>

        <div className="property_filters_group">
          <label className="property_filters_label">Purpose</label>
          <select
            className="property_filters_select"
            value={purpose}
            onChange={(e) => set_purpose(e.target.value)}
          >
            <option value="">All Purposes</option>
            <option value="rent">For Rent</option>
            <option value="sale">For Sale</option>
          </select>
        </div>

        <div className="property_filters_group">
          <label className="property_filters_label">Category</label>
          <select
            className="property_filters_select"
            value={category_id}
            onChange={(e) => set_category_id(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="property_filters_group">
          <label className="property_filters_label">Min Price (₹)</label>
          <input
            type="number"
            className="property_filters_input"
            placeholder="Min"
            value={min_price}
            onChange={(e) => set_min_price(e.target.value)}
          />
        </div>

        <div className="property_filters_group">
          <label className="property_filters_label">Max Price (₹)</label>
          <input
            type="number"
            className="property_filters_input"
            placeholder="Max"
            value={max_price}
            onChange={(e) => set_max_price(e.target.value)}
          />
        </div>

        <div className="property_filters_group">
          <label className="property_filters_label">Bedrooms</label>
          <select
            className="property_filters_select"
            value={bedrooms}
            onChange={(e) => set_bedrooms(e.target.value)}
          >
            <option value="">Any</option>
            <option value="1">1+ BHK</option>
            <option value="2">2+ BHK</option>
            <option value="3">3+ BHK</option>
            <option value="4">4+ BHK</option>
          </select>
        </div>

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
        <Button variant="primary" onClick={handle_apply}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
