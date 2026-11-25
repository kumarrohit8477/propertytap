import React, { useEffect, useState } from 'react';
import { get_categories, get_properties } from '@/lib/properties/property_service';
import HomeFeedClient from '@/app/(public)/home';
import { PropertyCategory, PropertyItem } from '@/types/property';
import '@/app/(public)/home.css';

export default function HomePage() {
  const [categories, set_categories] = useState<PropertyCategory[]>([]);
  const [properties, set_properties] = useState<PropertyItem[]>([]);

  useEffect(() => {
    document.title = 'PropertyTap | Find Properties Near You — 0% Brokerage';

    let is_mounted = true;
    async function load() {
      try {
        const [{ categories: cats }, { properties: props }] = await Promise.all([
          get_categories(),
          get_properties({ limit: 10 }),
        ]);
        if (is_mounted) {
          if (cats) set_categories(cats);
          if (props) set_properties(props);
        }
      } catch (err) {
        console.warn('Initial feed fetch skipped or offline', err);
      }
    }
    load();

    return () => {
      is_mounted = false;
    };
  }, []);

  return (
    <div>
      <HomeFeedClient
        initial_categories={categories}
        initial_properties={properties}
      />
    </div>
  );
}
