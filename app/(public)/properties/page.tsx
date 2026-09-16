'use client';

import React, { useEffect, useState } from 'react';
import PropertyCard from '@/components/property/property_card';
import PropertyFilters from '@/components/property/property_filters';
import { get_properties, get_categories } from '@/lib/properties/property_service';
import { PropertyItem, PropertyCategory, PropertyFilterParams } from '@/types/property';
import './properties.css';

export default function PropertiesPage() {
  const [properties, set_properties] = useState<PropertyItem[]>([]);
  const [categories, set_categories] = useState<PropertyCategory[]>([]);
  const [loading, set_loading] = useState(true);
  const [filters, set_filters] = useState<PropertyFilterParams>({});

  useEffect(() => {
    async function load_data() {
      set_loading(true);
      const [props_res, cats_res] = await Promise.all([
        get_properties(filters),
        get_categories(),
      ]);
      set_properties(props_res.properties);
      set_categories(cats_res.categories);
      set_loading(false);
    }
    load_data();
  }, [filters]);

  return (
    <div className="properties_page_container">
      <h1 className="properties_page_title">Browse All Properties</h1>

      <PropertyFilters
        categories={categories}
        initial_filters={filters}
        on_filter_change={(new_f) => set_filters(new_f)}
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
    </div>
  );
}
