'use client';

import React, { useState, useEffect } from 'react';
import PropertyCard from '@/components/property/property_card';
import PropertyFilters from '@/components/property/property_filters';
import { get_properties, get_categories } from '@/lib/properties/property_service';
import { PropertyItem, PropertyCategory, PropertyFilterParams } from '@/types/property';
import Button from '@/components/ui/button';
import './search.css';

export default function SearchPage() {
  const [search_query, set_search_query] = useState('');
  const [properties, set_properties] = useState<PropertyItem[]>([]);
  const [categories, set_categories] = useState<PropertyCategory[]>([]);
  const [loading, set_loading] = useState(false);
  const [filters, set_filters] = useState<PropertyFilterParams>({});

  const perform_search = async () => {
    set_loading(true);
    const { properties: data } = await get_properties({
      ...filters,
      query: search_query || undefined,
    });
    set_properties(data);
    set_loading(false);
  };

  useEffect(() => {
    async function load_cats() {
      const { categories: cats } = await get_categories();
      set_categories(cats);
    }
    load_cats();
    perform_search();
  }, [filters]);

  const handle_search_submit = (e: React.FormEvent) => {
    e.preventDefault();
    perform_search();
  };

  return (
    <div className="search_page_container">
      <h1 className="search_page_title">Search Properties</h1>

      <form className="search_bar_wrapper" onSubmit={handle_search_submit}>
        <input
          type="text"
          className="search_input"
          placeholder="Search by city, locality, title or keyword..."
          value={search_query}
          onChange={(e) => set_search_query(e.target.value)}
        />
        <Button variant="primary" type="submit">
          Search
        </Button>
      </form>

      <PropertyFilters
        categories={categories}
        initial_filters={filters}
        on_filter_change={(new_f) => set_filters(new_f)}
      />

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
    </div>
  );
}
