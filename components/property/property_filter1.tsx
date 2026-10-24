'use client';

import React, { useState } from 'react';
import { PropertyFilterParams, PropertyCategory } from '@/types/property';
import {
  get_filter_group_for_category,
  PropertyFilterGroup,
  SEEKER_FILTER_GROUPS,
  get_category_ids_for_filter,
  get_seeker_group_key,
} from '@/lib/config/property_filters_config';
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
  const [category_id, set_category_id] = useState<string>(
    () => get_seeker_group_key(initial_filters.category_id, categories) || initial_filters.category_id || ''
  );
  const [budget, set_budget] = useState('');

  // Dynamic filter state
  const [pg_type, set_pg_type] = useState('');
  const [sharing_type, set_sharing_type] = useState('');
  const [land_type, set_land_type] = useState('');
  const [facing, set_facing] = useState('');
  const [bedrooms, set_bedrooms] = useState('');

  const filter_group: PropertyFilterGroup = get_filter_group_for_category(category_id, categories);

  const handle_category_change = (new_cat_id: string) => {
    set_category_id(new_cat_id);
    const new_group = get_filter_group_for_category(new_cat_id, categories);
    if (new_group !== 'residential' && new_group !== 'all') set_bedrooms('');
    if (new_group !== 'pg' && new_group !== 'hostel') { set_pg_type(''); set_sharing_type(''); }
    if (new_group !== 'land') { set_land_type(''); set_facing(''); }
    if (new_group === 'pg') set_purpose('rent');
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

    const cat_ids = get_category_ids_for_filter(category_id, categories);

    on_filter_change({
      city: city.trim() || undefined,
      purpose: (filter_group === 'pg' ? 'rent' : (purpose as PropertyFilterParams['purpose'])) || undefined,
      category_id: category_id || undefined,
      category_ids: cat_ids.length > 0 ? cat_ids : undefined,
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
      {/* Search Box */}
      <div className="hero_search_box">
        {/* Location Input */}
        <div className="hero_search_location">
          <div className="hero_search_icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            type="text"
            className="hero_search_input"
            placeholder="Search location, city or area..."
            value={city}
            onChange={(e) => set_city(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handle_search()}
          />
        </div>

        <div className="hero_search_divider" />

        {/* Property Type */}
        <div className="hero_search_field">
          <div className="hero_search_field_inner">
            <span className="hero_field_label">Property Type</span>
            <select
              className="hero_search_select"
              value={category_id}
              onChange={(e) => handle_category_change(e.target.value)}
            >
              <option value="">Any Type</option>
              {SEEKER_FILTER_GROUPS.map((group) => (
                <option key={group.key} value={group.key}>{group.label}</option>
              ))}
            </select>
          </div>
          <div className="hero_select_arrow">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>

        <div className="hero_search_divider" />

        {/* Budget */}
        <div className="hero_search_field">
          <div className="hero_search_field_inner">
            <span className="hero_field_label">Budget</span>
            <select
              className="hero_search_select"
              value={budget}
              onChange={(e) => set_budget(e.target.value)}
            >
              <option value="">Any Budget</option>
              <option value="0-5000000">Up to ₹50 L</option>
              <option value="5000000-10000000">₹50 L – 1 Cr</option>
              <option value="10000000-50000000">₹1 Cr – 5 Cr</option>
              <option value="50000000-999999999">₹5 Cr+</option>
            </select>
          </div>
          <div className="hero_select_arrow">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>

        {/* Search Button */}
        <button type="button" className="hero_search_btn" onClick={handle_search}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          Search
        </button>
      </div>
    </div>
  );
}