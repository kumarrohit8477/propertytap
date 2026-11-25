'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { PropertyFilterParams, PropertyCategory } from '@/types/property';
import {
  get_filter_group_for_category,
  PropertyFilterGroup,
  SEEKER_FILTER_GROUPS,
  get_category_ids_for_filter,
  get_seeker_group_key,
} from '@/lib/config/property_filters_config';
import NearMeModal, { NearMeSelection } from './near_me_modal';
import Button from '@/components/ui/button';
import './property_filters.css';

interface PropertyFiltersProps {
  categories: PropertyCategory[];
  initial_filters?: PropertyFilterParams;
  on_filter_change: (filters: PropertyFilterParams) => void;
}

type IconName =
  | 'filter'
  | 'reset'
  | 'home'
  | 'tag'
  | 'location'
  | 'budget'
  | 'bed'
  | 'bath'
  | 'floor'
  | 'furnishing'
  | 'parking'
  | 'sort'
  | 'building';

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.9,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (name) {
    case 'filter':
      return <svg {...common}><path d="M4 5h16l-6.2 7.1v5.1l-3.6 1.8v-6.9L4 5Z" /></svg>;
    case 'reset':
      return <svg {...common}><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg>;
    case 'home':
      return <svg {...common}><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9" /><path d="M9 20v-6h6v6" /></svg>;
    case 'tag':
      return <svg {...common}><path d="m20 13-7 7-9-9V4h7l9 9Z" /><circle cx="8" cy="8" r="1.2" /></svg>;
    case 'location':
      return <svg {...common}><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
    case 'budget':
      return <svg {...common}><path d="M5 20V10M12 20V4M19 20v-7M3 20h18" /></svg>;
    case 'bed':
      return <svg {...common}><path d="M3 18v-7h18v7M3 14h18M6 11V7h5a3 3 0 0 1 3 3v1M3 18v2M21 18v2" /></svg>;
    case 'bath':
      return <svg {...common}><path d="M4 12h16M6 12V7a3 3 0 0 1 5.5-1.5M9 6v3M4 12v2a5 5 0 0 0 5 5h6a5 5 0 0 0 5-5v-2M8 19v2M16 19v2" /></svg>;
    case 'floor':
      return <svg {...common}><path d="M5 21V5h14v16M8 8h2M14 8h2M8 12h2M14 12h2M8 16h2M14 16h2M3 21h18" /></svg>;
    case 'furnishing':
      return <svg {...common}><path d="M4 13v6h16v-6M5 13V9a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4M7 10h10M6 19v2M18 19v2" /></svg>;
    case 'parking':
      return <svg {...common}><path d="M5 17h14l-1-7H6l-1 7ZM7 10 8 7h8l1 3" /><circle cx="8" cy="17" r="1.2" /><circle cx="16" cy="17" r="1.2" /></svg>;
    case 'sort':
      return <svg {...common}><path d="M8 4v16M8 4 5 7M8 4l3 3M16 20V4m0 16 3-3m-3 3-3-3" /></svg>;
    case 'building':
      return <svg {...common}><path d="M5 21V4h14v17M8 8h2M14 8h2M8 12h2M14 12h2M8 16h2M14 16h2M3 21h18" /></svg>;
  }
}

function FilterField({
  children,
  className = '',
}: {
  icon?: IconName;
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`property_filters_group ${className}`}>
      {children}
    </div>
  );
}

function SelectField({
  value,
  onChange,
  placeholder,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`property_filters_select_wrap ${value ? 'has_selected_value' : ''}`}>
      <select
        className={`property_filters_select ${!value ? 'property_select_placeholder' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {children}
      </select>
      <span className="property_filters_select_arrow">⌄</span>
    </div>
  );
}

const SALE_BUDGET_OPTIONS = [
  { value: '2000000', label: 'Up to ₹20 L' },
  { value: '3000000', label: 'Up to ₹30 L' },
  { value: '5000000', label: 'Up to ₹50 L' },
  { value: '7500000', label: 'Up to ₹75 L' },
  { value: '10000000', label: 'Up to ₹1 Cr' },
  { value: '15000000', label: 'Up to ₹1.5 Cr' },
  { value: '20000000', label: 'Up to ₹2 Cr' },
  { value: '30000000', label: 'Up to ₹3 Cr' },
  { value: '50000000', label: 'Up to ₹5 Cr' },
  { value: '100000000', label: 'Up to ₹10 Cr' },
];

const RENT_BUDGET_OPTIONS = [
  { value: '5000', label: 'Up to ₹5,000' },
  { value: '10000', label: 'Up to ₹10,000' },
  { value: '15000', label: 'Up to ₹15,000' },
  { value: '20000', label: 'Up to ₹20,000' },
  { value: '25000', label: 'Up to ₹25,000' },
  { value: '35000', label: 'Up to ₹35,000' },
  { value: '50000', label: 'Up to ₹50,000' },
  { value: '75000', label: 'Up to ₹75,000' },
  { value: '100000', label: 'Up to ₹1 Lakh' },
  { value: '150000', label: 'Up to ₹1.5 Lakh' },
  { value: '200000', label: 'Up to ₹2 Lakh' },
];

export default function PropertyFilters({
  categories = [],
  initial_filters = {},
  on_filter_change,
}: PropertyFiltersProps) {
  const [city, set_city] = useState(initial_filters.city || '');
  const [purpose, set_purpose] = useState<string>(initial_filters.purpose || '');
  const [category_id, set_category_id] = useState<string>(
    () =>
      get_seeker_group_key(initial_filters.category_id, categories) ||
      initial_filters.category_id ||
      '',
  );

  const [max_price, set_max_price] = useState(
    initial_filters.max_price ? String(initial_filters.max_price) : '',
  );
  const [bedrooms, set_bedrooms] = useState(
    initial_filters.bedrooms ? String(initial_filters.bedrooms) : '',
  );
  const [bathrooms, set_bathrooms] = useState(
    initial_filters.bathrooms ? String(initial_filters.bathrooms) : '',
  );
  const [furnishing, set_furnishing] = useState(initial_filters.furnishing || '');
  const [parking, set_parking] = useState(
    initial_filters.parking !== undefined
      ? initial_filters.parking
        ? 'true'
        : 'false'
      : '',
  );
  const [floor, set_floor] = useState(
    initial_filters.floor !== undefined ? String(initial_filters.floor) : '',
  );

  const [pg_type, set_pg_type] = useState(initial_filters.pg_type || '');
  const [sharing_type, set_sharing_type] = useState(initial_filters.sharing_type || '');
  const [food_included, set_food_included] = useState(
    initial_filters.food_included !== undefined
      ? initial_filters.food_included
        ? 'true'
        : 'false'
      : '',
  );

  const [land_type, set_land_type] = useState(initial_filters.land_type || '');
  const [facing, set_facing] = useState(initial_filters.facing || '');
  const [min_area, set_min_area] = useState(
    initial_filters.min_area ? String(initial_filters.min_area) : '',
  );
  const [max_area, set_max_area] = useState(
    initial_filters.max_area ? String(initial_filters.max_area) : '',
  );
  const [sort_by, set_sort_by] = useState<string>(initial_filters.sort_by || 'newest');

  const filter_group: PropertyFilterGroup =
    get_filter_group_for_category(category_id, categories);

  const is_residential = filter_group === 'residential' || filter_group === 'all';
  const is_pg_or_hostel = filter_group === 'pg' || filter_group === 'hostel';
  const is_land = filter_group === 'land';
  const is_commercial = filter_group === 'commercial';

  const is_rent = purpose === 'rent' || is_pg_or_hostel;
  const budget_options = is_rent ? RENT_BUDGET_OPTIONS : SALE_BUDGET_OPTIONS;

  const handle_purpose_change = (new_purpose: string) => {
    set_purpose(new_purpose);
    const new_is_rent = new_purpose === 'rent' || is_pg_or_hostel;
    const target_options = new_is_rent ? RENT_BUDGET_OPTIONS : SALE_BUDGET_OPTIONS;
    if (max_price && !target_options.some((opt) => opt.value === max_price)) {
      set_max_price('');
    }
  };

  const handle_near_me_select = (selection: NearMeSelection) => {
    const chosen_city = selection.city;
    set_city(chosen_city);

    const chosen_cat_id = selection.category_id || '';
    set_category_id(chosen_cat_id);

    const new_group = get_filter_group_for_category(chosen_cat_id, categories);
    const new_purpose = new_group === 'pg' ? 'rent' : purpose;
    if (new_group === 'pg') set_purpose('rent');

    const cat_ids = get_category_ids_for_filter(chosen_cat_id, categories);

    on_filter_change({
      city: chosen_city,
      category_id: chosen_cat_id || undefined,
      category_ids: cat_ids.length > 0 ? cat_ids : undefined,
      purpose: new_purpose ? (new_purpose as PropertyFilterParams['purpose']) : undefined,
      sort_by: sort_by as PropertyFilterParams['sort_by'],
    });
  };

  useEffect(() => {
    set_city(initial_filters.city || '');
    set_purpose(initial_filters.purpose || '');
    const resolved_group = get_seeker_group_key(initial_filters.category_id, categories);
    set_category_id(resolved_group || initial_filters.category_id || '');
    set_max_price(initial_filters.max_price ? String(initial_filters.max_price) : '');
    set_bedrooms(initial_filters.bedrooms ? String(initial_filters.bedrooms) : '');
    set_bathrooms(initial_filters.bathrooms ? String(initial_filters.bathrooms) : '');
    set_furnishing(initial_filters.furnishing || '');
    set_parking(
      initial_filters.parking !== undefined
        ? initial_filters.parking ? 'true' : 'false'
        : '',
    );
    set_floor(initial_filters.floor !== undefined ? String(initial_filters.floor) : '');
    set_pg_type(initial_filters.pg_type || '');
    set_sharing_type(initial_filters.sharing_type || '');
    set_food_included(
      initial_filters.food_included !== undefined
        ? initial_filters.food_included ? 'true' : 'false'
        : '',
    );
    set_land_type(initial_filters.land_type || '');
    set_facing(initial_filters.facing || '');
    set_min_area(initial_filters.min_area ? String(initial_filters.min_area) : '');
    set_max_area(initial_filters.max_area ? String(initial_filters.max_area) : '');
    set_sort_by(initial_filters.sort_by || 'newest');
  }, [
    initial_filters.city,
    initial_filters.purpose,
    initial_filters.category_id,
    initial_filters.max_price,
    initial_filters.bedrooms,
    initial_filters.bathrooms,
    initial_filters.furnishing,
    initial_filters.parking,
    initial_filters.floor,
    initial_filters.pg_type,
    initial_filters.sharing_type,
    initial_filters.food_included,
    initial_filters.land_type,
    initial_filters.facing,
    initial_filters.min_area,
    initial_filters.max_area,
    initial_filters.sort_by,
    categories,
  ]);

  const active_count = useMemo(
    () =>
      [
        city,
        purpose,
        category_id,
        max_price,
        is_residential ? bedrooms : '',
        filter_group === 'residential' ? bathrooms : '',
        is_residential || is_commercial ? furnishing : '',
        is_residential || is_commercial ? parking : '',
        filter_group === 'residential' ? floor : '',
        is_pg_or_hostel ? pg_type : '',
        is_pg_or_hostel ? sharing_type : '',
        is_pg_or_hostel ? food_included : '',
        is_land ? land_type : '',
        is_land ? facing : '',
        is_land || is_commercial ? min_area : '',
        is_land || is_commercial ? max_area : '',
        sort_by !== 'newest' ? sort_by : '',
      ].filter(Boolean).length,
    [
      city, purpose, category_id, max_price, bedrooms, bathrooms,
      furnishing, parking, floor, pg_type, sharing_type, food_included,
      land_type, facing, min_area, max_area, sort_by,
      is_residential, is_commercial, is_pg_or_hostel, is_land, filter_group,
    ],
  );

  const handle_category_change = (new_cat_id: string) => {
    set_category_id(new_cat_id);

    const new_group = get_filter_group_for_category(new_cat_id, categories);

    if (new_group === 'pg') {
      set_purpose('rent');
      if (max_price && !RENT_BUDGET_OPTIONS.some((opt) => opt.value === max_price)) {
        set_max_price('');
      }
      set_bedrooms('');
      set_bathrooms('');
      set_floor('');
      set_furnishing('');
      set_parking('');
      set_land_type('');
      set_facing('');
    } else if (new_group === 'land') {
      set_bedrooms('');
      set_bathrooms('');
      set_furnishing('');
      set_parking('');
      set_floor('');
      set_pg_type('');
      set_sharing_type('');
      set_food_included('');
    } else if (new_group === 'commercial') {
      set_bedrooms('');
      set_bathrooms('');
      set_floor('');
      set_pg_type('');
      set_sharing_type('');
      set_food_included('');
      set_land_type('');
      set_facing('');
    } else if (new_group === 'residential' || new_group === 'all') {
      set_pg_type('');
      set_sharing_type('');
      set_food_included('');
      set_land_type('');
      set_facing('');
    }
  };

  const emit_filter_change = (overrides?: Partial<{
    city: string;
    purpose: string;
    category_id: string;
    max_price: string;
    bedrooms: string;
    bathrooms: string;
    floor: string;
    furnishing: string;
    parking: string;
    sort_by: string;
    pg_type: string;
    sharing_type: string;
    food_included: string;
    land_type: string;
    facing: string;
    min_area: string;
    max_area: string;
  }>) => {
    const eff_city = overrides && 'city' in overrides ? overrides.city! : city;
    const eff_purpose = overrides && 'purpose' in overrides ? overrides.purpose! : purpose;
    const eff_cat = overrides && 'category_id' in overrides ? overrides.category_id! : category_id;
    const eff_max_price = overrides && 'max_price' in overrides ? overrides.max_price! : max_price;
    const eff_bedrooms = overrides && 'bedrooms' in overrides ? overrides.bedrooms! : bedrooms;
    const eff_bathrooms = overrides && 'bathrooms' in overrides ? overrides.bathrooms! : bathrooms;
    const eff_floor = overrides && 'floor' in overrides ? overrides.floor! : floor;
    const eff_furnishing = overrides && 'furnishing' in overrides ? overrides.furnishing! : furnishing;
    const eff_parking = overrides && 'parking' in overrides ? overrides.parking! : parking;
    const eff_sort = overrides && 'sort_by' in overrides ? overrides.sort_by! : sort_by;
    const eff_pg_type = overrides && 'pg_type' in overrides ? overrides.pg_type! : pg_type;
    const eff_sharing = overrides && 'sharing_type' in overrides ? overrides.sharing_type! : sharing_type;
    const eff_food = overrides && 'food_included' in overrides ? overrides.food_included! : food_included;
    const eff_land = overrides && 'land_type' in overrides ? overrides.land_type! : land_type;
    const eff_facing = overrides && 'facing' in overrides ? overrides.facing! : facing;
    const eff_min_area = overrides && 'min_area' in overrides ? overrides.min_area! : min_area;
    const eff_max_area = overrides && 'max_area' in overrides ? overrides.max_area! : max_area;

    const cat_ids = get_category_ids_for_filter(eff_cat, categories);
    const eff_group = get_filter_group_for_category(eff_cat, categories);
    const eff_is_res = eff_group === 'residential' || eff_group === 'all';
    const eff_is_comm = eff_group === 'commercial';
    const eff_is_pg = eff_group === 'pg' || eff_group === 'hostel';
    const eff_is_land = eff_group === 'land';

    on_filter_change({
      city: eff_city.trim() || undefined,
      purpose: (eff_group === 'pg' ? 'rent' : eff_purpose) as PropertyFilterParams['purpose'] || undefined,
      category_id: eff_cat || undefined,
      category_ids: cat_ids.length > 0 ? cat_ids : undefined,
      min_price: undefined,
      max_price: eff_max_price ? Number(eff_max_price) : undefined,
      bedrooms: eff_is_res && eff_bedrooms ? Number(eff_bedrooms) : undefined,
      bathrooms: eff_group === 'residential' && eff_bathrooms ? Number(eff_bathrooms) : undefined,
      furnishing:
        (eff_is_res || eff_is_comm) && eff_furnishing
          ? eff_furnishing
          : undefined,
      parking:
        (eff_is_res || eff_is_comm) && eff_parking !== ''
          ? eff_parking === 'true'
          : undefined,
      floor:
        eff_group === 'residential' && eff_floor !== ''
          ? Number(eff_floor)
          : undefined,
      pg_type: eff_is_pg && eff_pg_type ? eff_pg_type : undefined,
      sharing_type: eff_is_pg && eff_sharing ? eff_sharing : undefined,
      food_included:
        eff_is_pg && eff_food !== ''
          ? eff_food === 'true'
          : undefined,
      land_type: eff_is_land && eff_land ? eff_land : undefined,
      facing: eff_is_land && eff_facing ? eff_facing : undefined,
      min_area:
        (eff_is_land || eff_is_comm) && eff_min_area
          ? Number(eff_min_area)
          : undefined,
      max_area:
        (eff_is_land || eff_is_comm) && eff_max_area
          ? Number(eff_max_area)
          : undefined,
      sort_by: (eff_sort || 'newest') as PropertyFilterParams['sort_by'],
    });
  };

  const handle_apply = () => {
    emit_filter_change();
  };

  // Debounced search on city input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (city !== (initial_filters.city || '')) {
        emit_filter_change({ city });
      }
    }, 450);
    return () => clearTimeout(timer);
  }, [city, initial_filters.city]);

  const handle_purpose_select = (new_p: string) => {
    handle_purpose_change(new_p);
    let new_max_price = max_price;
    if (new_p === 'rent' && max_price && Number(max_price) > 500000) {
      new_max_price = '';
      set_max_price('');
    } else if (new_p === 'sale' && max_price && Number(max_price) < 500000) {
      new_max_price = '';
      set_max_price('');
    }
    emit_filter_change({ purpose: new_p, max_price: new_max_price });
  };

  const handle_category_select = (new_cat_id: string) => {
    handle_category_change(new_cat_id);
    const new_group = get_filter_group_for_category(new_cat_id, categories);
    let new_purpose = purpose;
    let new_max_price = max_price;
    let new_bedrooms = bedrooms;
    let new_bathrooms = bathrooms;
    let new_floor = floor;
    let new_furnishing = furnishing;
    let new_parking = parking;

    if (new_group === 'pg') {
      new_purpose = 'rent';
      if (max_price && !RENT_BUDGET_OPTIONS.some((opt) => opt.value === max_price)) {
        new_max_price = '';
      }
      new_bedrooms = '';
      new_bathrooms = '';
      new_floor = '';
      new_furnishing = '';
      new_parking = '';
    } else if (new_group === 'land') {
      new_bedrooms = '';
      new_bathrooms = '';
      new_furnishing = '';
      new_parking = '';
      new_floor = '';
    } else if (new_group === 'commercial') {
      new_bedrooms = '';
      new_bathrooms = '';
      new_floor = '';
    }

    emit_filter_change({
      category_id: new_cat_id,
      purpose: new_purpose,
      max_price: new_max_price,
      bedrooms: new_bedrooms,
      bathrooms: new_bathrooms,
      floor: new_floor,
      furnishing: new_furnishing,
      parking: new_parking,
    });
  };

  const handle_budget_select = (val: string) => {
    set_max_price(val);
    emit_filter_change({ max_price: val });
  };

  const handle_bedrooms_select = (val: string) => {
    set_bedrooms(val);
    emit_filter_change({ bedrooms: val });
  };

  const handle_bathrooms_select = (val: string) => {
    set_bathrooms(val);
    emit_filter_change({ bathrooms: val });
  };

  const handle_floor_select = (val: string) => {
    set_floor(val);
    emit_filter_change({ floor: val });
  };

  const handle_furnishing_select = (val: string) => {
    set_furnishing(val);
    emit_filter_change({ furnishing: val });
  };

  const handle_parking_select = (val: string) => {
    set_parking(val);
    emit_filter_change({ parking: val });
  };

  const handle_sort_select = (val: string) => {
    set_sort_by(val);
    emit_filter_change({ sort_by: val });
  };

  const handle_reset = () => {
    set_city('');
    set_purpose('');
    set_category_id('');
    set_max_price('');
    set_bedrooms('');
    set_bathrooms('');
    set_furnishing('');
    set_parking('');
    set_floor('');
    set_pg_type('');
    set_sharing_type('');
    set_food_included('');
    set_land_type('');
    set_facing('');
    set_min_area('');
    set_max_area('');
    set_sort_by('newest');

    on_filter_change({ sort_by: 'newest' });
  };

  return (
    <div className="property_filters_card">
      <div className="property_filters_header">
        <div className="property_filters_header_title">
          <span className="property_filters_header_icon">
            <Icon name="filter" size={20} />
          </span>
          <h3>Filters</h3>
          {active_count > 0 && (
            <span className="property_filters_badge">{active_count}</span>
          )}
        </div>

        <button
          type="button"
          className="property_filters_reset_btn"
          onClick={handle_reset}
        >
          <Icon name="reset" size={16} />
          <span>Reset</span>
        </button>
      </div>

      <div className="property_filters_body">
        {/* Search Box on Top */}
        <div className="property_filters_location_field">
          <div className="property_filters_location_row">
            <div className="property_filters_input_wrapper">
              <span className="input_icon">
                <Icon name="location" size={17} />
              </span>
              <input
                type="text"
                className="property_filters_input with_icon"
                placeholder="Search city, locality..."
                value={city}
                onChange={(e) => set_city(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    emit_filter_change({ city });
                  }
                }}
              />
              {city && (
                <button
                  type="button"
                  className="property_filters_input_clear"
                  onClick={() => {
                    set_city('');
                    emit_filter_change({ city: '' });
                  }}
                  aria-label="Clear location search"
                >
                  ✕
                </button>
              )}
            </div>
            <NearMeModal on_select={handle_near_me_select} trigger_button_text="Near Me" />
          </div>
        </div>

        {/* Row-wise scrollable strip of filters on mobile / vertical stack on desktop */}
        <div className="property_filters_row_scroll">
          {/* Purpose pills: All | Rent | Sale */}
          <div className="property_filters_group property_filters_purpose_group">
            <div className="property_filters_pills">
              <button
                type="button"
                className={`property_filter_pill ${
                  purpose === '' && filter_group !== 'pg' ? 'active' : ''
                }`}
                onClick={() => filter_group !== 'pg' && handle_purpose_select('')}
                disabled={filter_group === 'pg'}
              >
                All
              </button>

              <button
                type="button"
                className={`property_filter_pill ${
                  purpose === 'rent' || filter_group === 'pg' ? 'active' : ''
                }`}
                onClick={() => handle_purpose_select('rent')}
              >
                Rent
              </button>

              {filter_group !== 'pg' && (
                <button
                  type="button"
                  className={`property_filter_pill ${
                    purpose === 'sale' ? 'active' : ''
                  }`}
                  onClick={() => handle_purpose_select('sale')}
                >
                  Sale
                </button>
              )}
            </div>
          </div>

          {/* Property Type Dropdown */}
          <div className="property_filters_group">
            <SelectField
              value={category_id}
              onChange={handle_category_select}
              placeholder="Property Type"
            >
              {SEEKER_FILTER_GROUPS.map((group) => (
                <option key={group.key} value={group.key}>
                  {group.label}
                </option>
              ))}
            </SelectField>
          </div>

          {/* Budget Dropdown */}
          <div className="property_filters_group">
            <SelectField
              value={max_price}
              onChange={handle_budget_select}
              placeholder={is_rent ? 'Monthly Rent' : 'Budget (Up to)'}
            >
              {max_price && !budget_options.some((opt) => opt.value === max_price) && (
                <option value={max_price}>
                  Up to ₹{Number(max_price).toLocaleString('en-IN')}
                </option>
              )}
              {budget_options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </SelectField>
          </div>

          {/* Sort By Dropdown */}
          <div className="property_filters_group">
            <SelectField value={sort_by} onChange={handle_sort_select} placeholder="Sort By">
              <option value="newest">Sort: Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </SelectField>
          </div>

          {/* Residential Fields */}
          {is_residential && (
            <>
              <div className="property_filters_group">
                <SelectField
                  value={bedrooms}
                  onChange={handle_bedrooms_select}
                  placeholder="BHK"
                >
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK</option>
                  <option value="5">5+ BHK</option>
                </SelectField>
              </div>

              <div className="property_filters_group">
                <SelectField
                  value={furnishing}
                  onChange={handle_furnishing_select}
                  placeholder="Furnishing"
                >
                  <option value="unfurnished">Unfurnished</option>
                  <option value="semi-furnished">Semi-Furnished</option>
                  <option value="fully-furnished">Fully Furnished</option>
                </SelectField>
              </div>

              <div className="property_filters_group">
                <SelectField
                  value={parking}
                  onChange={handle_parking_select}
                  placeholder="Parking"
                >
                  <option value="true">Available</option>
                  <option value="false">Not Available</option>
                </SelectField>
              </div>

              <div className="property_filters_group">
                <SelectField
                  value={bathrooms}
                  onChange={handle_bathrooms_select}
                  placeholder="Bathrooms"
                >
                  <option value="1">1 Bathroom</option>
                  <option value="2">2 Bathrooms</option>
                  <option value="3">3 Bathrooms</option>
                  <option value="4">4+ Bathrooms</option>
                </SelectField>
              </div>

              <div className="property_filters_group">
                <SelectField
                  value={floor}
                  onChange={handle_floor_select}
                  placeholder="Floor"
                >
                  <option value="0">Ground Floor</option>
                  <option value="1">1st Floor</option>
                  <option value="2">2nd Floor</option>
                  <option value="3">3rd Floor</option>
                  <option value="4">4th Floor &amp; Above</option>
                </SelectField>
              </div>
            </>
          )}

          {/* PG / Hostel Fields */}
          {is_pg_or_hostel && (
            <>
              <div className="property_filters_group">
                <SelectField
                  value={pg_type}
                  onChange={(val) => { set_pg_type(val); emit_filter_change({ pg_type: val }); }}
                  placeholder={filter_group === 'pg' ? 'PG Type' : 'Hostel Type'}
                >
                  <option value="boys">Boys</option>
                  <option value="girls">Girls</option>
                  <option value="co-living">Co-Living</option>
                </SelectField>
              </div>

              <div className="property_filters_group">
                <SelectField
                  value={sharing_type}
                  onChange={(val) => { set_sharing_type(val); emit_filter_change({ sharing_type: val }); }}
                  placeholder="Room Sharing"
                >
                  <option value="single">Single Room</option>
                  <option value="double">Double Sharing</option>
                  <option value="triple">Triple Sharing</option>
                  <option value="four_plus">4+ Sharing</option>
                </SelectField>
              </div>

              <div className="property_filters_group">
                <SelectField
                  value={food_included}
                  onChange={(val) => { set_food_included(val); emit_filter_change({ food_included: val }); }}
                  placeholder="Food Facility"
                >
                  <option value="true">Food Included</option>
                  <option value="false">Food Not Included</option>
                </SelectField>
              </div>
            </>
          )}

          {/* Land Fields */}
          {is_land && (
            <>
              <div className="property_filters_group">
                <SelectField
                  value={land_type}
                  onChange={(val) => { set_land_type(val); emit_filter_change({ land_type: val }); }}
                  placeholder="Land Type"
                >
                  <option value="residential_plot">Residential Plot</option>
                  <option value="commercial_plot">Commercial Plot</option>
                  <option value="agricultural_land">Agricultural Land</option>
                </SelectField>
              </div>

              <div className="property_filters_group">
                <SelectField
                  value={facing}
                  onChange={(val) => { set_facing(val); emit_filter_change({ facing: val }); }}
                  placeholder="Facing"
                >
                  <option value="north">North</option>
                  <option value="south">South</option>
                  <option value="east">East</option>
                  <option value="west">West</option>
                  <option value="north_east">North-East</option>
                  <option value="north_west">North-West</option>
                  <option value="south_east">South-East</option>
                  <option value="south_west">South-West</option>
                </SelectField>
              </div>
            </>
          )}

          {/* Commercial Fields */}
          {is_commercial && (
            <>
              <div className="property_filters_group">
                <SelectField
                  value={furnishing}
                  onChange={handle_furnishing_select}
                  placeholder="Furnishing"
                >
                  <option value="unfurnished">Unfurnished</option>
                  <option value="semi-furnished">Semi-Furnished</option>
                  <option value="fully-furnished">Fully Furnished</option>
                </SelectField>
              </div>

              <div className="property_filters_group">
                <SelectField
                  value={parking}
                  onChange={handle_parking_select}
                  placeholder="Parking"
                >
                  <option value="true">Available</option>
                  <option value="false">Not Available</option>
                </SelectField>
              </div>
            </>
          )}

          {/* Mobile Reset Pill */}
          {active_count > 0 && (
            <button
              type="button"
              className="property_filter_mobile_reset_pill"
              onClick={handle_reset}
              title="Reset all filters"
            >
              <Icon name="reset" size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      <div className="property_filters_actions">
        <Button variant="primary" onClick={handle_apply} full_width={true}>
          <span className="apply_button_content">
            <Icon name="filter" size={18} />
            <span>Apply Filters</span>
          </span>
        </Button>
      </div>
    </div>
  );
}
