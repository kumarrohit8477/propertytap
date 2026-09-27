'use client';

import React, { useState, useEffect } from 'react';
import { PropertyFilterParams, PropertyCategory } from '@/types/property';
import {
  get_filter_group_for_category,
  PropertyFilterGroup,
  SEEKER_FILTER_GROUPS,
  get_category_ids_for_filter,
  get_seeker_group_key,
} from '@/lib/config/property_filters_config';
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
  const [category_id, set_category_id] = useState<string>(
    () => get_seeker_group_key(initial_filters.category_id, categories) || initial_filters.category_id || ''
  );

  // Residential filters
  const [min_price, set_min_price] = useState<string>(
    initial_filters.min_price ? String(initial_filters.min_price) : ''
  );
  const [max_price, set_max_price] = useState<string>(
    initial_filters.max_price ? String(initial_filters.max_price) : ''
  );
  const [bedrooms, set_bedrooms] = useState<string>(
    initial_filters.bedrooms ? String(initial_filters.bedrooms) : ''
  );
  const [bathrooms, set_bathrooms] = useState<string>(
    initial_filters.bathrooms ? String(initial_filters.bathrooms) : ''
  );
  const [furnishing, set_furnishing] = useState<string>(initial_filters.furnishing || '');
  const [parking, set_parking] = useState<string>(
    initial_filters.parking !== undefined ? (initial_filters.parking ? 'true' : 'false') : ''
  );
  const [floor, set_floor] = useState<string>(
    initial_filters.floor !== undefined ? String(initial_filters.floor) : ''
  );

  // PG / Hostel filters
  const [pg_type, set_pg_type] = useState<string>(initial_filters.pg_type || '');
  const [sharing_type, set_sharing_type] = useState<string>(initial_filters.sharing_type || '');
  const [food_included, set_food_included] = useState<string>(
    initial_filters.food_included !== undefined ? (initial_filters.food_included ? 'true' : 'false') : ''
  );

  // Land / Commercial filters
  const [land_type, set_land_type] = useState<string>(initial_filters.land_type || '');
  const [facing, set_facing] = useState<string>(initial_filters.facing || '');
  const [min_area, set_min_area] = useState<string>(
    initial_filters.min_area ? String(initial_filters.min_area) : ''
  );
  const [max_area, set_max_area] = useState<string>(
    initial_filters.max_area ? String(initial_filters.max_area) : ''
  );

  const [sort_by, set_sort_by] = useState<string>(initial_filters.sort_by || 'newest');

  // Compute current filter group dynamically
  const filter_group: PropertyFilterGroup = get_filter_group_for_category(category_id, categories);

  // Sync sidebar fields whenever initial_filters changes
  useEffect(() => {
    set_city(initial_filters.city || '');
    set_purpose(initial_filters.purpose || '');
    const resolved_group = get_seeker_group_key(initial_filters.category_id, categories);
    set_category_id(resolved_group || initial_filters.category_id || '');
    set_min_price(initial_filters.min_price ? String(initial_filters.min_price) : '');
    set_max_price(initial_filters.max_price ? String(initial_filters.max_price) : '');
    set_bedrooms(initial_filters.bedrooms ? String(initial_filters.bedrooms) : '');
    set_bathrooms(initial_filters.bathrooms ? String(initial_filters.bathrooms) : '');
    set_furnishing(initial_filters.furnishing || '');
    set_parking(initial_filters.parking !== undefined ? (initial_filters.parking ? 'true' : 'false') : '');
    set_floor(initial_filters.floor !== undefined ? String(initial_filters.floor) : '');
    set_pg_type(initial_filters.pg_type || '');
    set_sharing_type(initial_filters.sharing_type || '');
    set_food_included(initial_filters.food_included !== undefined ? (initial_filters.food_included ? 'true' : 'false') : '');
    set_land_type(initial_filters.land_type || '');
    set_facing(initial_filters.facing || '');
    set_min_area(initial_filters.min_area ? String(initial_filters.min_area) : '');
    set_max_area(initial_filters.max_area ? String(initial_filters.max_area) : '');
    set_sort_by(initial_filters.sort_by || 'newest');
  }, [
    initial_filters.city,
    initial_filters.purpose,
    initial_filters.category_id,
    initial_filters.min_price,
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

  // Handle category selection with context-aware cleanup
  const handle_category_change = (new_cat_id: string) => {
    set_category_id(new_cat_id);
    const new_group = get_filter_group_for_category(new_cat_id, categories);

    if (new_group === 'pg') {
      set_purpose('rent');
      set_bedrooms('');
      set_bathrooms('');
      set_floor('');
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
    } else if (new_group === 'residential') {
      set_pg_type('');
      set_sharing_type('');
      set_food_included('');
      set_land_type('');
      set_facing('');
    }
  };

  // Active count calculation
  const active_count = [
    city,
    purpose,
    category_id,
    min_price,
    max_price,
    filter_group === 'residential' || filter_group === 'all' ? bedrooms : '',
    filter_group === 'residential' ? bathrooms : '',
    filter_group === 'residential' || filter_group === 'commercial' ? furnishing : '',
    filter_group === 'residential' || filter_group === 'commercial' ? parking : '',
    filter_group === 'residential' ? floor : '',
    filter_group === 'pg' || filter_group === 'hostel' ? pg_type : '',
    filter_group === 'pg' || filter_group === 'hostel' ? sharing_type : '',
    filter_group === 'pg' || filter_group === 'hostel' ? food_included : '',
    filter_group === 'land' ? land_type : '',
    filter_group === 'land' ? facing : '',
    filter_group === 'land' || filter_group === 'commercial' ? min_area : '',
    filter_group === 'land' || filter_group === 'commercial' ? max_area : '',
    sort_by !== 'newest' ? sort_by : '',
  ].filter(Boolean).length;

  const handle_apply = () => {
    const is_residential = filter_group === 'residential' || filter_group === 'all';
    const is_pg_or_hostel = filter_group === 'pg' || filter_group === 'hostel';
    const is_land = filter_group === 'land';
    const is_commercial = filter_group === 'commercial';

    const cat_ids = get_category_ids_for_filter(category_id, categories);

    on_filter_change({
      city: city || undefined,
      purpose: (filter_group === 'pg' ? 'rent' : (purpose as any)) || undefined,
      category_id: category_id || undefined,
      category_ids: cat_ids.length > 0 ? cat_ids : undefined,
      min_price: min_price ? Number(min_price) : undefined,
      max_price: max_price ? Number(max_price) : undefined,

      // Residential specific (NO BHK for PG, Hostel, Land, Commercial)
      bedrooms: is_residential && bedrooms ? Number(bedrooms) : undefined,
      bathrooms: filter_group === 'residential' && bathrooms ? Number(bathrooms) : undefined,
      furnishing: (is_residential || is_commercial) && furnishing ? furnishing : undefined,
      parking: (is_residential || is_commercial) && parking !== '' ? parking === 'true' : undefined,
      floor: filter_group === 'residential' && floor !== '' ? Number(floor) : undefined,

      // PG / Hostel specific
      pg_type: is_pg_or_hostel && pg_type ? pg_type : undefined,
      sharing_type: is_pg_or_hostel && sharing_type ? sharing_type : undefined,
      food_included: is_pg_or_hostel && food_included !== '' ? food_included === 'true' : undefined,

      // Land specific
      land_type: is_land && land_type ? land_type : undefined,
      facing: is_land && facing ? facing : undefined,

      // Area Range for Land / Commercial
      min_area: (is_land || is_commercial) && min_area ? Number(min_area) : undefined,
      max_area: (is_land || is_commercial) && max_area ? Number(max_area) : undefined,

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
        {/* Category Dropdown (Grouped Seeker Options) */}
        <div className="property_filters_group">
          <label className="property_filters_label">Property Type / Category</label>
          <select
            className="property_filters_select"
            value={category_id}
            onChange={(e) => handle_category_change(e.target.value)}
          >
            <option value="">All Property Types</option>
            {SEEKER_FILTER_GROUPS.map((group) => (
              <option key={group.key} value={group.key}>
                {group.label}
              </option>
            ))}
          </select>
        </div>

        {/* Purpose Filter Pills */}
        <div className="property_filters_group">
          <label className="property_filters_label">Purpose</label>
          <div className="property_filters_pills">
            <button
              type="button"
              className={`property_filter_pill ${purpose === '' && filter_group !== 'pg' ? 'active' : ''}`}
              onClick={() => filter_group !== 'pg' && set_purpose('')}
              disabled={filter_group === 'pg'}
            >
              All
            </button>
            <button
              type="button"
              className={`property_filter_pill ${purpose === 'rent' || filter_group === 'pg' ? 'active' : ''}`}
              onClick={() => set_purpose('rent')}
            >
              Rent
            </button>
            {filter_group !== 'pg' && (
              <button
                type="button"
                className={`property_filter_pill ${purpose === 'sale' ? 'active' : ''}`}
                onClick={() => set_purpose('sale')}
              >
                Sale
              </button>
            )}
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

        {/* Price / Rent Range */}
        <div className="property_filters_group">
          <label className="property_filters_label">
            {filter_group === 'pg' || filter_group === 'hostel' ? 'Monthly Rent (₹)' : 'Price / Budget Range (₹)'}
          </label>
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

        {/* 1. RESIDENTIAL SPECIFIC FILTERS (BHK, Bathrooms, Floor) */}
        {(filter_group === 'residential' || filter_group === 'all') && (
          <div className="property_filters_group">
            <label className="property_filters_label">Bedrooms (BHK)</label>
            <div className="property_filters_bhk_row">
              {['', '1', '2', '3', '4', '5'].map((val) => (
                <button
                  key={val}
                  type="button"
                  className={`bhk_chip ${bedrooms === val ? 'active' : ''}`}
                  onClick={() => set_bedrooms(val)}
                >
                  {val === '' ? 'Any' : `${val}${val === '5' ? '+' : ' BHK'}`}
                </button>
              ))}
            </div>
          </div>
        )}

        {filter_group === 'residential' && (
          <div className="property_filters_group">
            <label className="property_filters_label">Bathrooms</label>
            <select
              className="property_filters_select"
              value={bathrooms}
              onChange={(e) => set_bathrooms(e.target.value)}
            >
              <option value="">Any Bathrooms</option>
              <option value="1">1 Bath</option>
              <option value="2">2 Baths</option>
              <option value="3">3 Baths</option>
              <option value="4">4+ Baths</option>
            </select>
          </div>
        )}

        {filter_group === 'residential' && (
          <div className="property_filters_group">
            <label className="property_filters_label">Floor</label>
            <select
              className="property_filters_select"
              value={floor}
              onChange={(e) => set_floor(e.target.value)}
            >
              <option value="">Any Floor</option>
              <option value="0">Ground Floor</option>
              <option value="1">1st Floor</option>
              <option value="2">2nd Floor</option>
              <option value="3">3rd Floor</option>
              <option value="4">4th Floor &amp; Above</option>
            </select>
          </div>
        )}

        {/* 2. PG / HOSTEL SPECIFIC FILTERS (Type, Room Sharing, Food) */}
        {(filter_group === 'pg' || filter_group === 'hostel') && (
          <>
            <div className="property_filters_group">
              <label className="property_filters_label">
                {filter_group === 'pg' ? 'PG Type' : 'Hostel Type'}
              </label>
              <select
                className="property_filters_select"
                value={pg_type}
                onChange={(e) => set_pg_type(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="boys">Boys</option>
                <option value="girls">Girls</option>
                <option value="co-living">Co-Living</option>
              </select>
            </div>

            <div className="property_filters_group">
              <label className="property_filters_label">Room / Sharing</label>
              <select
                className="property_filters_select"
                value={sharing_type}
                onChange={(e) => set_sharing_type(e.target.value)}
              >
                <option value="">Any Sharing</option>
                <option value="single">Single Room</option>
                <option value="double">Double Sharing</option>
                <option value="triple">Triple Sharing</option>
                <option value="four_plus">4+ Sharing</option>
              </select>
            </div>

            <div className="property_filters_group">
              <label className="property_filters_label">Food Facility</label>
              <select
                className="property_filters_select"
                value={food_included}
                onChange={(e) => set_food_included(e.target.value)}
              >
                <option value="">Any Option</option>
                <option value="true">Food Included</option>
                <option value="false">Food Not Included</option>
              </select>
            </div>
          </>
        )}

        {/* 3. LAND / PLOT SPECIFIC FILTERS (Land Type, Area, Facing) */}
        {filter_group === 'land' && (
          <>
            <div className="property_filters_group">
              <label className="property_filters_label">Land Type</label>
              <select
                className="property_filters_select"
                value={land_type}
                onChange={(e) => set_land_type(e.target.value)}
              >
                <option value="">All Land Types</option>
                <option value="residential_plot">Residential Plot</option>
                <option value="commercial_plot">Commercial Plot</option>
                <option value="agricultural_land">Agricultural Land</option>
              </select>
            </div>

            <div className="property_filters_group">
              <label className="property_filters_label">Facing Direction</label>
              <select
                className="property_filters_select"
                value={facing}
                onChange={(e) => set_facing(e.target.value)}
              >
                <option value="">Any Facing</option>
                <option value="north">North</option>
                <option value="south">South</option>
                <option value="east">East</option>
                <option value="west">West</option>
                <option value="north_east">North-East</option>
                <option value="north_west">North-West</option>
                <option value="south_east">South-East</option>
                <option value="south_west">South-West</option>
              </select>
            </div>
          </>
        )}

        {/* AREA RANGE (Land & Commercial) */}
        {(filter_group === 'land' || filter_group === 'commercial') && (
          <div className="property_filters_group">
            <label className="property_filters_label">Plot / Built-up Area</label>
            <div className="property_filters_price_row">
              <input
                type="number"
                className="property_filters_input"
                placeholder="Min Area"
                value={min_area}
                onChange={(e) => set_min_area(e.target.value)}
              />
              <span className="price_divider">-</span>
              <input
                type="number"
                className="property_filters_input"
                placeholder="Max Area"
                value={max_area}
                onChange={(e) => set_max_area(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* FURNISHING & PARKING (Residential & Commercial) */}
        {(filter_group === 'residential' || filter_group === 'commercial' || filter_group === 'all') && (
          <>
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
                <option value="fully-furnished">Fully Furnished</option>
              </select>
            </div>

            <div className="property_filters_group">
              <label className="property_filters_label">Parking</label>
              <select
                className="property_filters_select"
                value={parking}
                onChange={(e) => set_parking(e.target.value)}
              >
                <option value="">Any Parking</option>
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
            </div>
          </>
        )}

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
        <Button variant="primary" onClick={handle_apply} full_width={true}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
