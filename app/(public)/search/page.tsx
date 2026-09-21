'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyCard from '@/components/property/property_card';
import PropertyFilters from '@/components/property/property_filters';
import { get_properties, get_categories } from '@/lib/properties/property_service';
import { PropertyItem, PropertyCategory, PropertyFilterParams } from '@/types/property';
import './search.css';

function SearchPageInner() {
  const search_params = useSearchParams();

  const [properties, set_properties] = useState<PropertyItem[]>([]);
  const [categories, set_categories] = useState<PropertyCategory[]>([]);
  const [loading, set_loading] = useState(true);
  const [filters, set_filters] = useState<PropertyFilterParams>(() => ({
    city:        search_params.get('q')           || undefined,
    purpose:     (search_params.get('purpose') as PropertyFilterParams['purpose']) || undefined,
    category_id: search_params.get('category_id') || undefined,
    min_price:   search_params.get('min_price')   ? Number(search_params.get('min_price'))  : undefined,
    max_price:   search_params.get('max_price')   ? Number(search_params.get('max_price'))  : undefined,
    sort_by:     (search_params.get('sort_by') as PropertyFilterParams['sort_by'])   || 'newest',
  }));

  // Stable ref so useEffect doesn't need filters in its dependency array
  const initial_filters_ref = useRef(filters);

  const perform_search = async (active_filters: PropertyFilterParams) => {
    set_loading(true);
    const { properties: data } = await get_properties(active_filters);
    set_properties(data);
    set_loading(false);
  };

  useEffect(() => {
    async function load_cats() {
      const { categories: cats } = await get_categories();
      set_categories(cats);
    }
    load_cats();
    perform_search(initial_filters_ref.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handle_filter_change = (new_filters: PropertyFilterParams) => {
    set_filters(new_filters);
    perform_search(new_filters);
  };

  return (
    <div className="search_page_container">
      <h1 className="search_page_title">Search Properties</h1>

      <div className="search_layout_wrapper">

        {/* Sidebar */}
        <aside className="sidebar_container">
          <PropertyFilters
            categories={categories}
            initial_filters={filters}
            on_filter_change={handle_filter_change}
          />
        </aside>

        {/* Results */}
        <main className="main_content_container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <h3>Searching properties...</h3>
            </div>
          ) : properties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#ffffff', borderRadius: '12px' }}>
              <h3>No properties match your search</h3>
              <p>Try searching for a different city or clearing some filters.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {properties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '4rem' }}>Loading...</div>}>
      <SearchPageInner />
    </Suspense>
  );
}