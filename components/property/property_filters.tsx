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
  icon,
  label,
  children,
  className = '',
}: {
  icon: IconName;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`property_filters_group ${className}`}>
      <label className="property_filters_label">
        <span className="property_filters_label_icon">
          <Icon name={icon} size={16} />
        </span>
        <span>{label}</span>
      </label>
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
    <div className="property_filters_select_wrap">
      <select
        className="property_filters_select"
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

  const [min_price, set_min_price] = useState(
    initial_filters.min_price ? String(initial_filters.min_price) : '',
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

  const active_count = useMemo(
    () =>
      [
        city,
        purpose,
        category_id,
        min_price,
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
      city, purpose, category_id, min_price, max_price, bedrooms, bathrooms,
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

  const handle_apply = () => {
    const cat_ids = get_category_ids_for_filter(category_id, categories);

    on_filter_change({
      city: city.trim() || undefined,
      purpose: (filter_group === 'pg' ? 'rent' : purpose) as PropertyFilterParams['purpose'] || undefined,
      category_id: category_id || undefined,
      category_ids: cat_ids.length > 0 ? cat_ids : undefined,
      min_price: min_price ? Number(min_price) : undefined,
      max_price: max_price ? Number(max_price) : undefined,
      bedrooms: is_residential && bedrooms ? Number(bedrooms) : undefined,
      bathrooms: filter_group === 'residential' && bathrooms ? Number(bathrooms) : undefined,
      furnishing:
        (is_residential || is_commercial) && furnishing
          ? furnishing
          : undefined,
      parking:
        (is_residential || is_commercial) && parking !== ''
          ? parking === 'true'
          : undefined,
      floor:
        filter_group === 'residential' && floor !== ''
          ? Number(floor)
          : undefined,
      pg_type: is_pg_or_hostel && pg_type ? pg_type : undefined,
      sharing_type: is_pg_or_hostel && sharing_type ? sharing_type : undefined,
      food_included:
        is_pg_or_hostel && food_included !== ''
          ? food_included === 'true'
          : undefined,
      land_type: is_land && land_type ? land_type : undefined,
      facing: is_land && facing ? facing : undefined,
      min_area:
        (is_land || is_commercial) && min_area
          ? Number(min_area)
          : undefined,
      max_area:
        (is_land || is_commercial) && max_area
          ? Number(max_area)
          : undefined,
      sort_by: sort_by as PropertyFilterParams['sort_by'],
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
        <FilterField icon="home" label="Property Type / Category">
          <div className="property_filters_select_wrap">
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
            <span className="property_filters_select_arrow">⌄</span>
          </div>
        </FilterField>

        <FilterField icon="tag" label="Purpose">
          <div className="property_filters_pills">
            <button
              type="button"
              className={`property_filter_pill ${
                purpose === '' && filter_group !== 'pg' ? 'active' : ''
              }`}
              onClick={() => filter_group !== 'pg' && set_purpose('')}
              disabled={filter_group === 'pg'}
            >
              All
            </button>

            <button
              type="button"
              className={`property_filter_pill ${
                purpose === 'rent' || filter_group === 'pg' ? 'active' : ''
              }`}
              onClick={() => set_purpose('rent')}
            >
              Rent
            </button>

            {filter_group !== 'pg' && (
              <button
                type="button"
                className={`property_filter_pill ${
                  purpose === 'sale' ? 'active' : ''
                }`}
                onClick={() => set_purpose('sale')}
              >
                Sale
              </button>
            )}
          </div>
        </FilterField>

        <FilterField icon="location" label="City / Location">
          <div className="property_filters_input_wrapper">
            <span className="input_icon">
              <Icon name="location" size={17} />
            </span>
            <input
              type="text"
              className="property_filters_input with_icon"
              placeholder="e.g. Agra, Delhi, Noida..."
              value={city}
              onChange={(e) => set_city(e.target.value)}
            />
          </div>
        </FilterField>

        <FilterField
          icon="budget"
          label={
            is_pg_or_hostel
              ? 'Monthly Rent (₹)'
              : 'Price / Budget Range (₹)'
          }
        >
          <div className="property_filters_price_row">
            <div className="price_input_wrap">
              <span className="rupee_prefix">₹</span>
              <input
                type="number"
                className="property_filters_input"
                placeholder="Min Price"
                value={min_price}
                onChange={(e) => set_min_price(e.target.value)}
              />
            </div>

            <span className="price_divider">–</span>

            <div className="price_input_wrap">
              <span className="rupee_prefix">₹</span>
              <input
                type="number"
                className="property_filters_input"
                placeholder="Max Price"
                value={max_price}
                onChange={(e) => set_max_price(e.target.value)}
              />
            </div>
          </div>
        </FilterField>

        {/* Two filters per row under price */}
        {is_residential && (
          <div className="property_filters_grid">
            <FilterField icon="bed" label="Bedrooms (BHK)">
              <SelectField
                value={bedrooms}
                onChange={set_bedrooms}
                placeholder="Any"
              >
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK</option>
                <option value="5">5+ BHK</option>
              </SelectField>
            </FilterField>

            <FilterField icon="bath" label="Bathrooms">
              <SelectField
                value={bathrooms}
                onChange={set_bathrooms}
                placeholder="Any Bathrooms"
              >
                <option value="1">1 Bathroom</option>
                <option value="2">2 Bathrooms</option>
                <option value="3">3 Bathrooms</option>
                <option value="4">4+ Bathrooms</option>
              </SelectField>
            </FilterField>

            <FilterField icon="floor" label="Floor">
              <SelectField
                value={floor}
                onChange={set_floor}
                placeholder="Any Floor"
              >
                <option value="0">Ground Floor</option>
                <option value="1">1st Floor</option>
                <option value="2">2nd Floor</option>
                <option value="3">3rd Floor</option>
                <option value="4">4th Floor &amp; Above</option>
              </SelectField>
            </FilterField>

            <FilterField icon="furnishing" label="Furnishing">
              <SelectField
                value={furnishing}
                onChange={set_furnishing}
                placeholder="Any Furnishing"
              >
                <option value="unfurnished">Unfurnished</option>
                <option value="semi-furnished">Semi-Furnished</option>
                <option value="fully-furnished">Fully Furnished</option>
              </SelectField>
            </FilterField>

            <FilterField icon="parking" label="Parking">
              <SelectField
                value={parking}
                onChange={set_parking}
                placeholder="Any Parking"
              >
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </SelectField>
            </FilterField>

            <FilterField icon="sort" label="Sort By">
              <SelectField value={sort_by} onChange={set_sort_by} placeholder="Newest First">
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </SelectField>
            </FilterField>
          </div>
        )}

        {is_pg_or_hostel && (
          <div className="property_filters_grid">
            <FilterField
              icon="home"
              label={filter_group === 'pg' ? 'PG Type' : 'Hostel Type'}
            >
              <SelectField
                value={pg_type}
                onChange={set_pg_type}
                placeholder="Any Type"
              >
                <option value="boys">Boys</option>
                <option value="girls">Girls</option>
                <option value="co-living">Co-Living</option>
              </SelectField>
            </FilterField>

            <FilterField icon="bed" label="Sharing">
              <SelectField
                value={sharing_type}
                onChange={set_sharing_type}
                placeholder="Any Sharing"
              >
                <option value="single">Single Room</option>
                <option value="double">Double Sharing</option>
                <option value="triple">Triple Sharing</option>
                <option value="four_plus">4+ Sharing</option>
              </SelectField>
            </FilterField>

            <FilterField icon="home" label="Food Facility">
              <SelectField
                value={food_included}
                onChange={set_food_included}
                placeholder="Any Option"
              >
                <option value="true">Food Included</option>
                <option value="false">Food Not Included</option>
              </SelectField>
            </FilterField>

            <FilterField icon="sort" label="Sort By">
              <SelectField value={sort_by} onChange={set_sort_by} placeholder="Newest First">
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </SelectField>
            </FilterField>
          </div>
        )}

        {is_land && (
          <div className="property_filters_grid">
            <FilterField icon="building" label="Land Type">
              <SelectField
                value={land_type}
                onChange={set_land_type}
                placeholder="Any Land Type"
              >
                <option value="residential_plot">Residential Plot</option>
                <option value="commercial_plot">Commercial Plot</option>
                <option value="agricultural_land">Agricultural Land</option>
              </SelectField>
            </FilterField>

            <FilterField icon="location" label="Facing">
              <SelectField
                value={facing}
                onChange={set_facing}
                placeholder="Any Facing"
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
            </FilterField>

            <FilterField icon="budget" label="Min Area">
              <input
                type="number"
                className="property_filters_input"
                placeholder="Min Area"
                value={min_area}
                onChange={(e) => set_min_area(e.target.value)}
              />
            </FilterField>

            <FilterField icon="budget" label="Max Area">
              <input
                type="number"
                className="property_filters_input"
                placeholder="Max Area"
                value={max_area}
                onChange={(e) => set_max_area(e.target.value)}
              />
            </FilterField>

            <FilterField icon="sort" label="Sort By">
              <SelectField value={sort_by} onChange={set_sort_by} placeholder="Newest First">
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </SelectField>
            </FilterField>
          </div>
        )}

        {is_commercial && (
          <div className="property_filters_grid">
            <FilterField icon="furnishing" label="Furnishing">
              <SelectField
                value={furnishing}
                onChange={set_furnishing}
                placeholder="Any Furnishing"
              >
                <option value="unfurnished">Unfurnished</option>
                <option value="semi-furnished">Semi-Furnished</option>
                <option value="fully-furnished">Fully Furnished</option>
              </SelectField>
            </FilterField>

            <FilterField icon="parking" label="Parking">
              <SelectField
                value={parking}
                onChange={set_parking}
                placeholder="Any Parking"
              >
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </SelectField>
            </FilterField>

            <FilterField icon="budget" label="Min Area">
              <input
                type="number"
                className="property_filters_input"
                placeholder="Min Area"
                value={min_area}
                onChange={(e) => set_min_area(e.target.value)}
              />
            </FilterField>

            <FilterField icon="budget" label="Max Area">
              <input
                type="number"
                className="property_filters_input"
                placeholder="Max Area"
                value={max_area}
                onChange={(e) => set_max_area(e.target.value)}
              />
            </FilterField>

            <FilterField icon="sort" label="Sort By">
              <SelectField value={sort_by} onChange={set_sort_by} placeholder="Newest First">
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </SelectField>
            </FilterField>
          </div>
        )}
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
