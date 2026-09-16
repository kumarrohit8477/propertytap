'use client';

import React, { useState } from 'react';
import PropertyCard from '@/components/property/property_card';
import PropertyFilters from '@/components/property/property_filters';
import { get_properties } from '@/lib/properties/property_service';
import { PropertyItem, PropertyCategory, PropertyFilterParams } from '@/types/property';

interface PropertiesFeedClientProps {
  initial_properties: PropertyItem[];
  initial_categories: PropertyCategory[];
}

export default function PropertiesFeedClient({
  initial_properties,
  initial_categories,
}: PropertiesFeedClientProps) {
  const [properties, set_properties] = useState<PropertyItem[]>(initial_properties);
  const [loading, set_loading] = useState(false);
  const [filters, set_filters] = useState<PropertyFilterParams>({});

  const handle_filter_change = async (new_filters: PropertyFilterParams) => {
    set_filters(new_filters);
    set_loading(true);
    const { properties: fetched } = await get_properties(new_filters);
    set_properties(fetched);
    set_loading(false);
  };

  return (
    <>
      <PropertyFilters
        categories={initial_categories}
        initial_filters={filters}
        on_filter_change={handle_filter_change}
      />

      {loading ? (
        <div className="properties_page_empty">
          <h3>Loading properties...</h3>
        </div>
      ) : properties.length === 0 ? (
        <div className="properties_page_empty">
          <h3>No matching properties found</h3>
          <p>Try broadening your filters or search criteria.</p>
        </div>
      ) : (
        <div className="properties_page_grid">
          {properties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      )}
    </>
  );
}
