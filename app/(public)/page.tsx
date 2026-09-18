import React from 'react';
import type { Metadata } from 'next';
import { get_properties_server, get_categories_server } from '@/lib/properties/property_service_server';
import HomeFeedClient from './home_feed_client';
import './home.css';

export const metadata: Metadata = {
  title: 'Find Properties Near You — 0% Brokerage',
  description:
    'Browse verified houses, flats, apartments, plots & commercial spaces across India. Connect directly with owners. Zero brokerage on PropertyTap.',
  alternates: {
    canonical: 'https://propertytap.in',
  },
  openGraph: {
    title: 'PropertyTap — Find Properties Near You | 0% Brokerage',
    description:
      'Browse verified properties across India. Connect directly with owners — zero brokerage forever.',
    url: 'https://propertytap.in',
    type: 'website',
  },
};

export default async function HomePage() {
  const [{ properties }, { categories }] = await Promise.all([
    get_properties_server({ limit: 8 }),
    get_categories_server(),
  ]);

  return (
    <div>
      <HomeFeedClient
        initial_properties={properties}
        initial_categories={categories}
      />
    </div>
  );
}
