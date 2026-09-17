import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { get_properties_server, get_categories_server } from '@/lib/properties/property_service_server';
import { PropertyPurpose } from '@/types/property';
import CityFeedClient from './city_feed_client';
import './city_landing.css';

interface Props {
  params: { purpose: string; city: string };
}

// Decode URL slug → display name e.g. "new-delhi" → "New Delhi"
function decode_city(slug: string): string {
  return decodeURIComponent(slug)
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function is_valid_purpose(purpose: string): purpose is PropertyPurpose {
  return purpose === 'rent' || purpose === 'sale';
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!is_valid_purpose(params.purpose)) return { title: 'Properties | PropertyTap' };

  const city = decode_city(params.city);
  const purpose_label = params.purpose === 'rent' ? 'Rent' : 'Sale';
  const purpose_label_lower = params.purpose === 'rent' ? 'rent' : 'sale';
  const canonical = `https://propertytap.in/properties/city/${params.purpose}/${params.city}`;

  return {
    title: `Properties for ${purpose_label} in ${city} — 0% Brokerage`,
    description: `Browse verified flats, houses, plots & commercial spaces for ${purpose_label_lower} in ${city}. Connect directly with owners — zero brokerage on PropertyTap.`,
    alternates: { canonical },
    openGraph: {
      title: `Properties for ${purpose_label} in ${city} | PropertyTap`,
      description: `Find verified properties for ${purpose_label_lower} in ${city}. No middleman, no brokerage.`,
      url: canonical,
      type: 'website',
      images: [
        {
          url: 'https://propertytap.in/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `Properties for ${purpose_label} in ${city} — PropertyTap`,
        },
      ],
    },
  };
}

export default async function CityLandingPage({ params }: Props) {
  if (!is_valid_purpose(params.purpose)) notFound();

  const city = decode_city(params.city);
  const purpose = params.purpose as PropertyPurpose;
  const purpose_label = purpose === 'rent' ? 'Rent' : 'Sale';

  const [{ properties, count }, { categories }] = await Promise.all([
    get_properties_server({ city, purpose }),
    get_categories_server(),
  ]);

  // JSON-LD ItemList schema — helps Google show individual listings in rich results
  const item_list_schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Properties for ${purpose_label} in ${city}`,
    description: `Verified properties for ${purpose_label.toLowerCase()} in ${city} with zero brokerage on PropertyTap`,
    url: `https://propertytap.in/properties/city/${params.purpose}/${params.city}`,
    numberOfItems: count ?? properties.length,
    itemListElement: properties.slice(0, 10).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://propertytap.in/properties/${p.id}`,
      name: p.title,
    })),
  };

  return (
    <div className="city_landing_wrapper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(item_list_schema) }}
      />

      {/* Breadcrumb */}
      <nav className="city_landing_breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span> / </span>
        <Link href="/properties">Properties</Link>
        <span> / </span>
        <span aria-current="page">
          {purpose_label} in {city}
        </span>
      </nav>

      {/* Hero heading — keyword-rich H1 that Google indexes for this page */}
      <div className="city_landing_hero">
        <h1 className="city_landing_title">
          Properties for {purpose_label} in {city}
        </h1>
        <p className="city_landing_subtitle">
          {count ?? properties.length} verified listing{(count ?? properties.length) !== 1 ? 's' : ''} · Zero brokerage · Connect directly with owners
        </p>

        {/* Cross-link to the opposite purpose — good for internal linking */}
        <div className="city_landing_toggle">
          {purpose === 'rent' ? (
            <Link href={`/properties/city/sale/${params.city}`} className="city_landing_toggle_link">
              Looking to buy instead? Browse properties for Sale in {city} →
            </Link>
          ) : (
            <Link href={`/properties/city/rent/${params.city}`} className="city_landing_toggle_link">
              Looking to rent instead? Browse properties for Rent in {city} →
            </Link>
          )}
        </div>
      </div>

      <CityFeedClient
        initial_properties={properties}
        initial_categories={categories}
        city={city}
        purpose={purpose}
      />
    </div>
  );
}
