'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PropertyFilterParams, PropertyCategory } from '@/types/property';
import {
  get_filter_group_for_category,
  PropertyFilterGroup,
  SEEKER_FILTER_GROUPS,
  get_category_ids_for_filter,
  get_seeker_group_key,
} from '@/lib/config/property_filters_config';
import NearMeModal, { NearMeSelection } from './near_me_modal';
import './property_filter1.css';

interface PropertyFiltersProps {
  categories: PropertyCategory[];
  initial_filters?: PropertyFilterParams;
  on_filter_change: (filters: PropertyFilterParams) => void;
}

const BUDGET_OPTIONS = [
  { value: '', label: 'Any' },
  { value: '0-5000000', label: 'Up to ₹50 L' },
  { value: '5000000-10000000', label: '₹50 L – 1 Cr' },
  { value: '10000000-50000000', label: '₹1 Cr – 5 Cr' },
  { value: '50000000-999999999', label: '₹5 Cr+' },
];

export default function PropertyFilters({
  categories = [],
  initial_filters = {},
  on_filter_change,
}: PropertyFiltersProps) {
  const [purpose, set_purpose] = useState<string>(initial_filters.purpose || '');
  const [city, set_city] = useState(initial_filters.city || '');
  const [category_id, set_category_id] = useState<string>(
    () => get_seeker_group_key(initial_filters.category_id, categories) || initial_filters.category_id || ''
  );
  const [budget, set_budget] = useState(() => {
    if (initial_filters.min_price !== undefined || initial_filters.max_price !== undefined) {
      const min = initial_filters.min_price || 0;
      const max = initial_filters.max_price || 999999999;
      return `${min}-${max}`;
    }
    return '';
  });

  const [open_dropdown, set_open_dropdown] = useState<'type' | 'budget' | null>(null);
  const type_ref = useRef<HTMLDivElement>(null);
  const budget_ref = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    const handle_click_outside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        type_ref.current &&
        !type_ref.current.contains(target) &&
        budget_ref.current &&
        !budget_ref.current.contains(target)
      ) {
        set_open_dropdown(null);
      }
    };

    const handle_key_down = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        set_open_dropdown(null);
      }
    };

    document.addEventListener('mousedown', handle_click_outside);
    document.addEventListener('keydown', handle_key_down);
    return () => {
      document.removeEventListener('mousedown', handle_click_outside);
      document.removeEventListener('keydown', handle_key_down);
    };
  }, []);

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
    if (new_group === 'pg') {
      set_purpose('rent');
    } else if (!new_cat_id) {
      set_purpose('');
    }
  };

  const handle_search = () => {
    set_open_dropdown(null);
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
      purpose: (filter_group === 'pg' ? 'rent' : (purpose ? (purpose as PropertyFilterParams['purpose']) : undefined)) || undefined,
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

  const handle_near_me_select = (selection: NearMeSelection) => {
    const chosen_city = selection.city;
    set_city(chosen_city);

    const chosen_cat_id = selection.category_id || '';
    set_category_id(chosen_cat_id);

    const cat_ids = get_category_ids_for_filter(chosen_cat_id, categories);

    on_filter_change({
      city: chosen_city,
      category_id: chosen_cat_id || undefined,
      category_ids: cat_ids.length > 0 ? cat_ids : undefined,
      purpose: chosen_cat_id === 'hostel-pg' ? 'rent' : undefined,
      sort_by: 'newest',
    });
  };

  const selected_group = SEEKER_FILTER_GROUPS.find((g) => g.key === category_id);
  const type_display_label = selected_group ? selected_group.label : 'Property Type';

  const selected_budget = BUDGET_OPTIONS.find((b) => b.value === budget && b.value !== '');
  const budget_display_label = selected_budget ? selected_budget.label : 'Budget';

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
            aria-label="Search location, city or area"
          />
          {city && (
            <button
              type="button"
              className="hero_search_clear"
              onClick={() => set_city('')}
              aria-label="Clear location search"
            >
              &times;
            </button>
          )}
        </div>

        <div className="hero_search_divider hero_search_divider_1" />

        {/* Group of Filters (Property Type + Budget) */}
        <div className="hero_search_filters_group">
          {/* Property Type Dropdown */}
          <div className="hero_search_field hero_search_field_type" ref={type_ref}>
            <button
              type="button"
              className={`hero_search_dropdown_btn ${!category_id ? 'hero_select_placeholder' : ''}`}
              onClick={() => set_open_dropdown(open_dropdown === 'type' ? null : 'type')}
              aria-haspopup="listbox"
              aria-expanded={open_dropdown === 'type'}
            >
              <span className="hero_search_field_icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </span>
              <span className="hero_search_btn_text">{type_display_label}</span>
              <div className={`hero_select_arrow ${open_dropdown === 'type' ? 'hero_arrow_open' : ''}`}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </button>

            {open_dropdown === 'type' && (
              <div className="hero_search_menu hero_search_menu_type" role="listbox">
                <button
                  type="button"
                  className={`hero_menu_item ${!category_id ? 'hero_menu_item_selected' : ''}`}
                  onClick={() => {
                    handle_category_change('');
                    set_open_dropdown(null);
                  }}
                  role="option"
                  aria-selected={!category_id}
                >
                  <span>All Property Types</span>
                  {!category_id && (
                    <svg className="hero_menu_check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
                {SEEKER_FILTER_GROUPS.map((group) => {
                  const is_selected = category_id === group.key;
                  return (
                    <button
                      key={group.key}
                      type="button"
                      className={`hero_menu_item ${is_selected ? 'hero_menu_item_selected' : ''}`}
                      onClick={() => {
                        handle_category_change(group.key);
                        set_open_dropdown(null);
                      }}
                      role="option"
                      aria-selected={is_selected}
                    >
                      <span>{group.label}</span>
                      {is_selected && (
                        <svg className="hero_menu_check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="hero_search_divider hero_search_divider_2" />

          {/* Budget Dropdown */}
          <div className="hero_search_field hero_search_field_budget" ref={budget_ref}>
            <button
              type="button"
              className={`hero_search_dropdown_btn ${!budget ? 'hero_select_placeholder' : ''}`}
              onClick={() => set_open_dropdown(open_dropdown === 'budget' ? null : 'budget')}
              aria-haspopup="listbox"
              aria-expanded={open_dropdown === 'budget'}
            >
              <span className="hero_search_field_icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <text x="3" y="16" fontSize="13" fontWeight="bold" fill="currentColor">₹</text>
                </svg>
              </span>
              <span className="hero_search_btn_text">{budget_display_label}</span>
              <div className={`hero_select_arrow ${open_dropdown === 'budget' ? 'hero_arrow_open' : ''}`}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </button>

            {open_dropdown === 'budget' && (
              <div className="hero_search_menu hero_search_menu_budget" role="listbox">
                {BUDGET_OPTIONS.map((opt) => {
                  const is_selected = budget === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      className={`hero_menu_item ${is_selected ? 'hero_menu_item_selected' : ''}`}
                      onClick={() => {
                        set_budget(opt.value);
                        set_open_dropdown(null);
                      }}
                      role="option"
                      aria-selected={is_selected}
                    >
                      <span>{opt.label}</span>
                      {is_selected && (
                        <svg className="hero_menu_check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Search Button */}
        <button type="button" className="hero_search_btn" onClick={handle_search}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span className="hero_search_btn_label">Search</span>
        </button>
      </div>

      {/* Near Me Button - Placed just right of the search box */}
      <div className="hero_search_near_me">
        <NearMeModal
          on_select={handle_near_me_select}
          trigger_button_text="Near Me"
          className="hero_near_me_btn"
          show_icon
        />
      </div>
    </div>
  );
}
