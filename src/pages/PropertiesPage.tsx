import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { get_properties, get_categories } from '@/lib/properties/property_service';
import PropertiesFeedClient from '@/app/(public)/properties/properties_feed_client';
import { PropertyFilterParams, PropertyItem, PropertyCategory } from '@/types/property';
import '@/app/(public)/properties/properties.css';

export default function PropertiesPage() {
  const [searchParams] = useSearchParams();
  const [properties, set_properties] = useState<PropertyItem[]>([]);
  const [categories, set_categories] = useState<PropertyCategory[]>([]);
  const [loading, set_loading] = useState(true);

  const initial_filters: PropertyFilterParams = {
    city: searchParams.get('q') || searchParams.get('city') || undefined,
    purpose: (searchParams.get('purpose') as PropertyFilterParams['purpose']) || undefined,
    category_id: searchParams.get('category_id') || undefined,
    min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
    max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
    sort_by: (searchParams.get('sort_by') as PropertyFilterParams['sort_by']) || 'newest',
  };

  useEffect(() => {
    document.title = 'Browse All Properties | PropertyTap';

    let is_mounted = true;
    async function load() {
      set_loading(true);
      try {
        const [{ properties: props }, { categories: cats }] = await Promise.all([
          get_properties(initial_filters),
          get_categories(),
        ]);
        if (is_mounted) {
          if (props) set_properties(props);
          if (cats) set_categories(cats);
        }
      } catch (err) {
        console.warn('Properties load error', err);
      } finally {
        if (is_mounted) set_loading(false);
      }
    }
    load();

    return () => {
      is_mounted = false;
    };
  }, [searchParams.toString()]);

  return (
    <div className="properties_page_container">
      {loading && properties.length === 0 ? (
        <div className="properties_loading" style={{ textAlign: 'center', padding: '3rem 0' }}>
          Loading properties...
        </div>
      ) : (
        <PropertiesFeedClient
          initial_properties={properties}
          initial_categories={categories}
          initial_filters={initial_filters}
        />
      )}
    </div>
  );
}
