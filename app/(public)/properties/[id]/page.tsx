import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { get_property_by_id_server } from '@/lib/properties/property_service_server';
import { PropertyItem } from '@/types/property';
import PropertyGallery from '@/components/property/property_gallery';
import PropertyInfo from '@/components/property/property_info';
import Button from '@/components/ui/button';
import './property_detail.css';

interface Props {
  params: { id: string };
}

// Dynamic metadata per property — Google shows this as the page title & description
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { property } = await get_property_by_id_server(params.id);
  if (!property) return { title: 'Property Not Found' };

  const price_label = property.price.toLocaleString('en-IN');
  const purpose_label = property.purpose === 'rent' ? 'for Rent' : 'for Sale';
  const primary_image =
    property.images?.find((img) => img.is_primary)?.image_url ||
    property.images?.[0]?.image_url;

  return {
    title: `${property.title} — ${property.category?.name || 'Property'} ${purpose_label} in ${property.city}`,
    description: `${property.category?.name || 'Property'} ${purpose_label} in ${property.locality}, ${property.city} at ₹${price_label}${property.purpose === 'rent' ? '/month' : ''}. ${property.bedrooms ? `${property.bedrooms} BHK. ` : ''}${property.area ? `${property.area} ${property.area_unit || 'sqft'}. ` : ''}Zero brokerage on PropertyTap.`,
    alternates: {
      canonical: `https://propertytap.in/properties/${property.id}`,
    },
    openGraph: {
      title: property.title,
      description: `${property.category?.name || 'Property'} ${purpose_label} in ${property.city} — ₹${price_label}`,
      url: `https://propertytap.in/properties/${property.id}`,
      type: 'website',
      images: primary_image ? [{ url: primary_image, alt: property.title }] : [],
    },
  };
}

// JSON-LD structured data for Google Rich Results
function PropertySchema({ property }: { property: PropertyItem }) {
  const primary_image =
    property.images?.find((img) => img.is_primary)?.image_url ||
    property.images?.[0]?.image_url;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description || `${property.category?.name} ${property.purpose === 'rent' ? 'for rent' : 'for sale'} in ${property.city}`,
    url: `https://propertytap.in/properties/${property.id}`,
    datePosted: property.created_at,
    image: primary_image ? [primary_image] : [],
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'INR',
      priceSpecification: property.purpose === 'rent'
        ? { '@type': 'UnitPriceSpecification', price: property.price, priceCurrency: 'INR', unitText: 'MONTH' }
        : undefined,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.locality,
      addressLocality: property.city,
      addressCountry: 'IN',
    },
    floorSize: property.area
      ? { '@type': 'QuantitativeValue', value: property.area, unitCode: 'FTK' }
      : undefined,
    numberOfRooms: property.bedrooms ?? undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function PropertyDetailPage({ params }: Props) {
  const { property } = await get_property_by_id_server(params.id);

  if (!property) {
    notFound();
  }

  return (
    <div className="property_detail_wrapper">
      <PropertySchema property={property} />

      <div style={{ marginBottom: '1rem' }}>
        <Link href="/properties" style={{ textDecoration: 'none', color: '#2563eb', fontWeight: 600 }}>
          &larr; Back to Properties Feed
        </Link>
      </div>

      <div className="property_detail_container">
        <PropertyGallery images={property.images} title={property.title} />
        <PropertyInfo property={property} />
      </div>
    </div>
  );
}
