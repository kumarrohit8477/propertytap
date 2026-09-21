'use client';

import React, { useState } from 'react';
import { PropertyFilterParams, PropertyCategory } from '@/types/property';
import './property_filter1.css';

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
  const [purpose, set_purpose] = useState<string>(initial_filters.purpose || 'sale');
  const [city, set_city] = useState(initial_filters.city || '');
  const [category_id, set_category_id] = useState(initial_filters.category_id || '');
  const [budget, set_budget] = useState('');

  const handle_search = () => {
    let min_price, max_price;
    
    if (budget) {
      const parts = budget.split('-');
      min_price = parts[0] ? Number(parts[0]) : undefined;
      max_price = parts[1] ? Number(parts[1]) : undefined;
    }

    on_filter_change({
      city: city.trim() || undefined,
      purpose: (purpose as PropertyFilterParams['purpose']) || undefined,
      category_id: category_id || undefined,
      min_price,
      max_price,
      sort_by: 'newest',
    });
  };

  return (
    <div className="hero_search_wrapper">
      {/* Buy / Rent Tabs */}
      <div className="hero_purpose_tabs">
        <button
          type="button"
          className={`hero_purpose_tab ${purpose === 'sale' ? 'active' : ''}`}
          onClick={() => set_purpose('sale')}
        >
          Buy
        </button>
        <button
          type="button"
          className={`hero_purpose_tab ${purpose === 'rent' ? 'active' : ''}`}
          onClick={() => set_purpose('rent')}
        >
          Rent
        </button>
      </div>

      {/* Main Search Bar */}
      <div className="hero_search_box">
        
        {/* Location Input */}
        <div className="hero_search_location">
          <div className="hero_search_icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            type="text"
            className="hero_search_input"
            placeholder="Enter location, landmark or project"
            value={city}
            onChange={(e) => set_city(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handle_search()}
          />
        </div>
        
        <div className="hero_search_divider" />
        
        {/* Property Type Dropdown */}
        <div className="hero_search_field">
          <select
            className="hero_search_select"
            value={category_id}
            onChange={(e) => set_category_id(e.target.value)}
          >
            <option value="">Property Type</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <div className="hero_select_arrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>

        <div className="hero_search_divider" />

        {/* Budget Dropdown */}
        <div className="hero_search_field hero_budget_field">
          <select
            className="hero_search_select"
            value={budget}
            onChange={(e) => set_budget(e.target.value)}
          >
            <option value="">Budget</option>
            <option value="0-5000000">Up to ₹50 L</option>
            <option value="5000000-10000000">₹50 L - 1 Cr</option>
            <option value="10000000-50000000">₹1 Cr - 5 Cr</option>
            <option value="50000000-999999999">₹5 Cr+</option>
          </select>
          <div className="hero_select_arrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>

        {/* Search Action */}
        <button type="button" className="hero_search_btn" onClick={handle_search}>
          Search
        </button>
      </div>
    </div>
  );
}