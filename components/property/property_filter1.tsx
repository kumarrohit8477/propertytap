'use client';

import React, { useState } from 'react';
import { PropertyFilterParams, PropertyCategory } from '@/types/property';
import { get_filter_group_for_category, PropertyFilterGroup } from '@/lib/config/property_filters_config';
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
  const [bedrooms, set_bedrooms] = useState('');

  // Dynamic filter state
  const [pg_type, set_pg_type] = useState('');
  const [sharing_type, set_sharing_type] = useState('');
  const [land_type, set_land_type] = useState('');
  const [facing, set_facing] = useState('');

  const filter_group: PropertyFilterGroup = get_filter_group_for_category(category_id, categories);

  const handle_category_change = (new_cat_id: string) => {
    set_category_id(new_cat_id);
    const new_group = get_filter_group_for_category(new_cat_id, categories);

    // Reset non-applicable fields when changing category
    if (new_group !== 'residential' && new_group !== 'all') {
      set_bedrooms('');
    }
    if (new_group !== 'pg' && new_group !== 'hostel') {
      set_pg_type('');
      set_sharing_type('');
    }
    if (new_group !== 'land') {
      set_land_type('');
      set_facing('');
    }

    if (new_group === 'pg' || new_group === 'hostel') {
      set_purpose('rent');
    }
  };

  const handle_search = () => {
    let min_price, max_price;

    if (budget) {
      const parts = budget.split('-');
      min_price = parts[0] ? Number(parts[0]) : undefined;
      max_price = parts[1] ? Number(parts[1]) : undefined;
    }

    const is_residential = filter_group === 'residential' || filter_group === 'all';
    const is_pg_or_hostel = filter_group === 'pg' || filter_group === 'hostel';
    const is_land = filter_group === 'land';

    on_filter_change({
      city: city.trim() || undefined,
      purpose: (purpose as PropertyFilterParams['purpose']) || undefined,
      category_id: category_id || undefined,
      min_price,
      max_price,
      bedrooms: is_residential && bedrooms ? Number(bedrooms) : undefined,
      pg_type: is_pg_or_hostel && pg_type ? pg_type : undefined,
      sharing_type: is_pg_or_hostel && sharing_type ? sharing_type : undefined,
      land_type: is_land && land_type ? land_type : undefined,
      facing: is_land && facing ? facing : undefined,
      sort_by: 'newest',
    });
  };

  return (
    <div className="hero_search_wrapper">
      {/* Purpose Tabs */}
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
            placeholder="Enter location, city or landmark"
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
            onChange={(e) => handle_category_change(e.target.value)}
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

        {/* DYNAMIC CONTEXT SPECIFIC FILTERS */}
        {/* 1. RESIDENTIAL: BHK Dropdown */}
        {(filter_group === 'residential' || filter_group === 'all') && (
          <>
            <div className="hero_search_divider" />
            <div className="hero_search_field">
              <select
                className="hero_search_select"
                value={bedrooms}
                onChange={(e) => set_bedrooms(e.target.value)}
              >
                <option value="">BHK</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK</option>
                <option value="5">5+ BHK</option>
              </select>
              <div className="hero_select_arrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>
          </>
        )}

        {/* 2. PG / HOSTEL: PG Type & Sharing Dropdown (NO BHK) */}
        {(filter_group === 'pg' || filter_group === 'hostel') && (
          <>
            <div className="hero_search_divider" />
            <div className="hero_search_field">
              <select
                className="hero_search_select"
                value={pg_type}
                onChange={(e) => set_pg_type(e.target.value)}
              >
                <option value="">{filter_group === 'pg' ? 'PG Type' : 'Hostel Type'}</option>
                <option value="boys">Boys</option>
                <option value="girls">Girls</option>
                <option value="co-living">Co-Living</option>
              </select>
              <div className="hero_select_arrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>

            <div className="hero_search_divider" />
            <div className="hero_search_field">
              <select
                className="hero_search_select"
                value={sharing_type}
                onChange={(e) => set_sharing_type(e.target.value)}
              >
                <option value="">Sharing</option>
                <option value="single">Single Room</option>
                <option value="double">Double Sharing</option>
                <option value="triple">Triple Sharing</option>
                <option value="four_plus">4+ Sharing</option>
              </select>
              <div className="hero_select_arrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>
          </>
        )}

        {/* 3. LAND / PLOT: Land Type & Facing Dropdown (NO BHK) */}
        {filter_group === 'land' && (
          <>
            <div className="hero_search_divider" />
            <div className="hero_search_field">
              <select
                className="hero_search_select"
                value={land_type}
                onChange={(e) => set_land_type(e.target.value)}
              >
                <option value="">Land Type</option>
                <option value="residential_plot">Residential Plot</option>
                <option value="commercial_plot">Commercial Plot</option>
                <option value="agricultural_land">Agricultural Land</option>
              </select>
              <div className="hero_select_arrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>

            <div className="hero_search_divider" />
            <div className="hero_search_field">
              <select
                className="hero_search_select"
                value={facing}
                onChange={(e) => set_facing(e.target.value)}
              >
                <option value="">Facing</option>
                <option value="north">North</option>
                <option value="south">South</option>
                <option value="east">East</option>
                <option value="west">West</option>
                <option value="north_east">North-East</option>
                <option value="north_west">North-West</option>
                <option value="south_east">South-East</option>
                <option value="south_west">South-West</option>
              </select>
              <div className="hero_select_arrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>
          </>
        )}

        {/* Search Action */}
        <button type="button" className="hero_search_btn" onClick={handle_search}>
          Search
        </button>
      </div>
    </div>
  );
}