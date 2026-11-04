import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { get_properties_server, get_categories_server } from '@/lib/properties/property_service_server';
import PropertiesFeedClient from './properties_feed_client';
import { PropertyFilterParams } from '@/types/property';
import './properties.css';

export const metadata: Metadata = {
  title: 'Browse All Properties — Rent & Buy in India',
  description:
    'Search houses, flats, plots, PG & commercial spaces for rent and sale across India. Filter by city, price, bedrooms and more. Zero brokerage on PropertyTap.',
  alternates: {
    canonical: 'https://propertytap.in/properties',
  },
  openGraph: {
    title: 'Browse All Properties | PropertyTap',
    description: 'Rent or buy properties across India with 0% brokerage. Search by city, price & more.',
    url: 'https://propertytap.in/properties',
    type: 'website',
  },
};

interface PropertiesPageProps {
  searchParams?: { [key: string]: string | undefined };
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const initial_filters: PropertyFilterParams = {
    city: searchParams?.q || searchParams?.city || undefined,
    purpose: (searchParams?.purpose as PropertyFilterParams['purpose']) || undefined,
    category_id: searchParams?.category_id || undefined,
    min_price: searchParams?.min_price ? Number(searchParams?.min_price) : undefined,
    max_price: searchParams?.max_price ? Number(searchParams?.max_price) : undefined,
    sort_by: (searchParams?.sort_by as PropertyFilterParams['sort_by']) || 'newest',
  };

  const [{ properties }, { categories }] = await Promise.all([
    get_properties_server(initial_filters),
    get_categories_server(),
  ]);

  return (
    <div className="properties_page_container">
      <Suspense fallback={<div className="properties_loading">Loading properties...</div>}>
        <PropertiesFeedClient
          initial_properties={properties}
          initial_categories={categories}
          initial_filters={initial_filters}
        />
      </Suspense>
    </div>
  );
}
