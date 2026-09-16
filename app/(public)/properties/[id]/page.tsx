'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { get_property_by_id } from '@/lib/properties/property_service';
import { PropertyItem } from '@/types/property';
import PropertyGallery from '@/components/property/property_gallery';
import PropertyInfo from '@/components/property/property_info';
import Link from 'next/link';
import Button from '@/components/ui/button';
import './property_detail.css';

export default function PropertyDetailPage() {
  const params = useParams();
  const property_id = params?.id as string;
  const [property, set_property] = useState<PropertyItem | null>(null);
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    async function load_property() {
      if (!property_id) return;
      set_loading(true);
      const { property: data } = await get_property_by_id(property_id);
      set_property(data);
      set_loading(false);
    }
    load_property();
  }, [property_id]);

  if (loading) {
    return (
      <div className="property_detail_wrapper">
        <div className="property_detail_not_found">
          <h2>Loading property details...</h2>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="property_detail_wrapper">
        <div className="property_detail_not_found">
          <h2>Property Not Found</h2>
          <p style={{ margin: '1rem 0' }}>The property you are looking for does not exist or has been removed.</p>
          <Link href="/properties">
            <Button variant="primary">Browse Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="property_detail_wrapper">
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
