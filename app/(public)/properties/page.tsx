import React from 'react';
import type { Metadata } from 'next';
import { get_properties_server, get_categories_server } from '@/lib/properties/property_service_server';
import PropertiesFeedClient from './properties_feed_client';
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

export default async function PropertiesPage() {
  const [{ properties }, { categories }] = await Promise.all([
    get_properties_server({}),
    get_categories_server(),
  ]);

  return (
    <div className="properties_page_container">
      <h1 className="properties_page_title">Browse All Properties</h1>
      <PropertiesFeedClient
        initial_properties={properties}
        initial_categories={categories}
      />
    </div>
  );
}
