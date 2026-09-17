'use client';

import React, { useState } from 'react';
import PropertyCard from '@/components/property/property_card';
import PropertyFilters from '@/components/property/property_filters';
import { get_properties } from '@/lib/properties/property_service';
import { PropertyItem, PropertyCategory, PropertyFilterParams, PropertyPurpose } from '@/types/property';

interface CityFeedClientProps {
  initial_properties: PropertyItem[];
  initial_categories: PropertyCategory[];
  city: string;
  purpose: PropertyPurpose;
}

export default function CityFeedClient({
  initial_properties,
  initial_categories,
  city,
  purpose,
}: CityFeedClientProps) {
  const [properties, set_properties] = useState<PropertyItem[]>(initial_properties);
  const [loading, set_loading] = useState(false);

  const handle_filter_change = async (new_filters: PropertyFilterParams) => {
    set_loading(true);
    // Always keep city + purpose locked for this landing page
    const { properties: fetched } = await get_properties({
      ...new_filters,
      city,
      purpose,
    });
    set_properties(fetched);
    set_loading(false);
  };

  return (
    <>
      <PropertyFilters
        categories={initial_categories}
        initial_filters={{ city, purpose }}
        on_filter_change={handle_filter_change}
      />

      {loading ? (
        <div className="city_feed_empty">
          <h3>Loading properties...</h3>
        </div>
      ) : properties.length === 0 ? (
        <div className="city_feed_empty">
          <h3>No properties found in {city}</h3>
          <p>Be the first to list a property here — it&apos;s free!</p>
        </div>
      ) : (
        <div className="city_feed_grid">
          {properties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      )}
    </>
  );
}
