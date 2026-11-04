'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyCard from '@/components/property/property_card';
import PropertyFilters from '@/components/property/property_filters';
import { get_properties } from '@/lib/properties/property_service';
import { PropertyItem, PropertyCategory, PropertyFilterParams } from '@/types/property';

interface PropertiesFeedClientProps {
  initial_properties: PropertyItem[];
  initial_categories: PropertyCategory[];
  initial_filters?: PropertyFilterParams;
}

export default function PropertiesFeedClient({
  initial_properties,
  initial_categories,
  initial_filters,
}: PropertiesFeedClientProps) {
  const searchParams = useSearchParams();

  const [properties, set_properties] = useState<PropertyItem[]>(initial_properties);
  const [categories] = useState<PropertyCategory[]>(initial_categories);
  const [loading, set_loading] = useState(false);
  const [filters, set_filters] = useState<PropertyFilterParams>(() => {
    return (
      initial_filters || {
        city: searchParams.get('q') || searchParams.get('city') || undefined,
        purpose: (searchParams.get('purpose') as PropertyFilterParams['purpose']) || undefined,
        category_id: searchParams.get('category_id') || undefined,
        min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
        max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
        sort_by: (searchParams.get('sort_by') as PropertyFilterParams['sort_by']) || 'newest',
      }
    );
  });

  const perform_search = async (active_filters: PropertyFilterParams) => {
    set_loading(true);
    const { properties: fetched } = await get_properties(active_filters);
    set_properties(fetched);
    set_loading(false);
  };

  // Sync with URL params if user navigates back/forward or opens from another link
  const prevParamsRef = useRef(searchParams.toString());
  useEffect(() => {
    const currentParams = searchParams.toString();
    if (currentParams !== prevParamsRef.current) {
      prevParamsRef.current = currentParams;
      const updated: PropertyFilterParams = {
        city: searchParams.get('q') || searchParams.get('city') || undefined,
        purpose: (searchParams.get('purpose') as PropertyFilterParams['purpose']) || undefined,
        category_id: searchParams.get('category_id') || undefined,
        min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
        max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
        sort_by: (searchParams.get('sort_by') as PropertyFilterParams['sort_by']) || 'newest',
      };
      set_filters(updated);
      perform_search(updated);
    }
  }, [searchParams]);

  const handle_filter_change = (new_filters: PropertyFilterParams) => {
    set_filters(new_filters);
    perform_search(new_filters);

    // Sync with browser URL without reloading
    const params = new URLSearchParams();
    if (new_filters.city) params.set('q', new_filters.city);
    if (new_filters.purpose) params.set('purpose', new_filters.purpose);
    if (new_filters.category_id) params.set('category_id', new_filters.category_id);
    if (new_filters.min_price !== undefined) params.set('min_price', String(new_filters.min_price));
    if (new_filters.max_price !== undefined) params.set('max_price', String(new_filters.max_price));
    if (new_filters.sort_by && new_filters.sort_by !== 'newest') params.set('sort_by', new_filters.sort_by);

    const qs = params.toString();
    const new_url = `/properties${qs ? `?${qs}` : ''}`;
    prevParamsRef.current = qs;
    window.history.replaceState(null, '', new_url);
  };

  return (
    <div className="properties_layout_wrapper">
      {/* Sidebar with Searchbox and Filters */}
      <aside className="properties_sidebar_container">
        <PropertyFilters
          categories={categories}
          initial_filters={filters}
          on_filter_change={handle_filter_change}
        />
      </aside>

      {/* Main Content Area */}
      <main className="properties_main_container">
        <div className="properties_results_header">
          <h1 className="properties_page_title">Browse All Properties</h1>
          {!loading && properties.length > 0 && (
            <span className="properties_results_count">
              Showing <strong>{properties.length}</strong> {properties.length === 1 ? 'property' : 'properties'}
            </span>
          )}
        </div>

        {loading ? (
          <div className="properties_page_empty">
            <h3>Searching properties...</h3>
          </div>
        ) : properties.length === 0 ? (
          <div className="properties_page_empty">
            <h3>No matching properties found</h3>
            <p>Try searching for a different city or clearing some filters.</p>
          </div>
        ) : (
          <div className="properties_page_grid">
            {properties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
