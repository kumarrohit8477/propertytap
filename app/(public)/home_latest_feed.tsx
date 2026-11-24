'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PropertyItem } from '@/types/property';
import { get_properties } from '@/lib/properties/property_service';
import PropertyCard from '@/components/property/property_card';
import './home_latest_feed.css';

interface HomeLatestFeedProps {
  initial_properties?: PropertyItem[];
}

const FALLBACK_PROPERTIES: PropertyItem[] = [
  {
    id: 'sample-1',
    owner_id: 'sample-owner-1',
    category_id: 'sample-cat-1',
    title: 'SPACIOUS 3 BHK INDEPENDENT HOUSE',
    purpose: 'sale',
    price: 8500000,
    city: 'Lucknow',
    locality: 'Indira Nagar',
    bedrooms: 3,
    bathrooms: 3,
    area: 1600,
    area_unit: 'sq.ft',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: 'c1', name: 'House', slug: 'house', is_active: true },
    images: [
      {
        id: 'i1',
        property_id: 'sample-1',
        image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
        sort_order: 1,
        is_primary: true,
      },
    ],
    owner: {
      id: 'sample-owner-1',
      full_name: 'Rajesh Kumar',
      display_name: 'Rajesh Kumar',
      phone: '9876543210',
    },
  },
  {
    id: 'sample-2',
    owner_id: 'sample-owner-2',
    category_id: 'sample-cat-2',
    title: 'LUXURY 2 BHK APARTMENT',
    purpose: 'rent',
    price: 18000,
    city: 'Noida',
    locality: 'Sector 62',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    area_unit: 'sq.ft',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: 'c2', name: 'Apartment', slug: 'apartment', is_active: true },
    images: [
      {
        id: 'i2',
        property_id: 'sample-2',
        image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
        sort_order: 1,
        is_primary: true,
      },
    ],
    owner: {
      id: 'sample-owner-2',
      full_name: 'Priya Sharma',
      display_name: 'Priya Sharma',
      phone: '9812345678',
    },
  },
  {
    id: 'sample-3',
    owner_id: 'sample-owner-3',
    category_id: 'sample-cat-3',
    title: 'MODERN GIRLS PG (FULLY FURNISHED)',
    purpose: 'rent',
    price: 7500,
    city: 'Delhi',
    locality: 'Lajpat Nagar',
    bedrooms: 1,
    bathrooms: 1,
    area: 360,
    area_unit: 'sq.ft',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: 'c3', name: 'Hostel / PG', slug: 'hostel-pg', is_active: true },
    images: [
      {
        id: 'i3',
        property_id: 'sample-3',
        image_url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80',
        sort_order: 1,
        is_primary: true,
      },
    ],
    owner: {
      id: 'sample-owner-3',
      full_name: 'Sunita Mehra',
      display_name: 'Sunita PG Care',
      phone: '9988776655',
    },
  },
  {
    id: 'sample-4',
    owner_id: 'sample-owner-4',
    category_id: 'sample-cat-4',
    title: 'COMMERCIAL SHOP FOR RENT',
    purpose: 'rent',
    price: 45000,
    city: 'Gurgaon',
    locality: 'MG Road',
    bedrooms: null,
    bathrooms: null,
    area: 1000,
    area_unit: 'sq.ft',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: 'c4', name: 'Commercial', slug: 'commercial', is_active: true },
    images: [
      {
        id: 'i4',
        property_id: 'sample-4',
        image_url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80',
        sort_order: 1,
        is_primary: true,
      },
    ],
    owner: {
      id: 'sample-owner-4',
      full_name: 'Vikas Gupta',
      display_name: 'Vikas Properties',
      phone: '9871122334',
    },
  },
];

export default function HomeLatestFeed({ initial_properties = [] }: HomeLatestFeedProps) {
  const [properties, set_properties] = useState<PropertyItem[]>(initial_properties);

  useEffect(() => {
    if (initial_properties.length === 0) {
      get_properties({ limit: 4 }).then(({ properties: fetched }) => {
        if (fetched && fetched.length > 0) {
          set_properties(fetched);
        }
      });
    } else {
      set_properties(initial_properties);
    }
  }, [initial_properties]);

  const display_list = properties && properties.length > 0 ? properties : FALLBACK_PROPERTIES;

  return (
    <section className="hlf_section">
      <div className="hlf_container">
        <div className="hlf_header">
          <div>
            <h2 className="hlf_title">Latest Property Feed</h2>
            <p className="hlf_subtitle">Discover recently added properties from across cities</p>
          </div>
          <Link href="/properties" className="hlf_view_all">
            View All →
          </Link>
        </div>

        <div className="hlf_grid">
          {display_list.slice(0, 4).map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </div>
    </section>
  );
}
