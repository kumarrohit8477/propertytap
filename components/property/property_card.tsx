import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PropertyItem } from '@/types/property';
import { format_price } from '@/lib/utils/utils';
import ShowInterestButton from './show_interest_button';
import CallNowButton from './call_now_button';
import './property_card.css';

interface PropertyCardProps {
  property: PropertyItem;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const primary_image =
    property.images?.find((img) => img.is_primary)?.image_url ||
    property.images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800';

  const category_name = property.category?.name || 'Property';
  const lister_name = property.owner?.display_name || property.owner?.full_name || 'Property Lister';

  return (
    <div className="property_card">
      <div className="property_card_image_wrapper">
        <Link href={`/properties/${property.id}`}>
          <img
            src={primary_image}
            alt={property.title}
            className="property_card_image"
          />
        </Link>
        <span className={`property_card_badge_purpose ${property.purpose === 'rent' ? 'property_card_badge_rent' : 'property_card_badge_sale'}`}>
          For {property.purpose === 'rent' ? 'Rent' : 'Sale'}
        </span>
      </div>

      <div className="property_card_content">
        <div className="property_card_header">
          <h3 className="property_card_title" style={{ textTransform: 'uppercase' }}>
            <Link href={`/properties/${property.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
              {property.title}
            </Link>
          </h3>
        </div>

        <div className="property_card_price">
          {format_price(property.price)}
          {property.purpose === 'rent' && <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#6b7280' }}> / month</span>}
        </div>

        <div className="property_card_location">
          {property.locality}, {property.city}
        </div>

        <div className="property_card_meta">
          <span>{category_name}</span>
          {property.bedrooms !== null && property.bedrooms !== undefined && <span> {property.bedrooms} BHK</span>}
          {property.area && <span> {property.area} {property.area_unit || 'sqft'}</span>}
        </div>

        <div className="property_card_lister">
          Listed by: {lister_name}
        </div>

        <div className="property_card_actions">
          <ShowInterestButton
            property_id={property.id}
            owner_id={property.owner_id}
            full_width={true}
          />
          <CallNowButton
            phone={property.owner?.phone}
            owner_id={property.owner_id}
            property_id={property.id}
            full_width={true}
          />
        </div>
      </div>
    </div>
  );
}
