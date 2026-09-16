import React from 'react';
import { PropertyItem } from '@/types/property';
import { format_price, format_date } from '@/lib/utils/utils';
import ShowInterestButton from './show_interest_button';
import './property_info.css';

interface PropertyInfoProps {
  property: PropertyItem;
}

export default function PropertyInfo({ property }: PropertyInfoProps) {
  return (
    <div className="property_info_container">
      <div className="property_info_header">
        <div className="property_info_badges">
          <span className="property_info_badge property_info_badge_purpose">
            For {property.purpose === 'rent' ? 'Rent' : 'Sale'}
          </span>
          <span className="property_info_badge property_info_badge_category">
            {property.category?.name || 'Property'}
          </span>
        </div>
        <h1 className="property_info_title">{property.title}</h1>
        <div className="property_info_location">
          📍 {property.locality}, {property.city} {property.address ? `(${property.address})` : ''}
        </div>
      </div>

      <div className="property_info_price">
        {format_price(property.price)}
        {property.purpose === 'rent' && <span style={{ fontSize: '1rem', fontWeight: 500, color: '#6b7280' }}> / month</span>}
      </div>

      <div className="property_info_specs_grid">
        {property.bedrooms !== null && property.bedrooms !== undefined && (
          <div className="property_info_spec_item">
            <span className="property_info_spec_label">Bedrooms</span>
            <span className="property_info_spec_value">{property.bedrooms} BHK</span>
          </div>
        )}
        {property.bathrooms !== null && property.bathrooms !== undefined && (
          <div className="property_info_spec_item">
            <span className="property_info_spec_label">Bathrooms</span>
            <span className="property_info_spec_value">{property.bathrooms}</span>
          </div>
        )}
        {property.area && (
          <div className="property_info_spec_item">
            <span className="property_info_spec_label">Area</span>
            <span className="property_info_spec_value">{property.area} {property.area_unit || 'sqft'}</span>
          </div>
        )}
        {property.furnishing && (
          <div className="property_info_spec_item">
            <span className="property_info_spec_label">Furnishing</span>
            <span className="property_info_spec_value" style={{ textTransform: 'capitalize' }}>{property.furnishing}</span>
          </div>
        )}
        <div className="property_info_spec_item">
          <span className="property_info_spec_label">Listed On</span>
          <span className="property_info_spec_value">{format_date(property.created_at)}</span>
        </div>
      </div>

      <div className="property_info_section">
        <h3 className="property_info_section_title">Description</h3>
        <p className="property_info_description">
          {property.description || 'No detailed description provided.'}
        </p>
      </div>

      <div className="property_info_lister_box">
        <div style={{ fontSize: '0.85rem', color: '#4b5563' }}>Property Listed By:</div>
        <div className="property_info_lister_name">
          👤 {property.owner?.full_name || 'Property Lister'}
        </div>
        <div className="property_info_privacy_note">
          🔒 Contact details (Phone & Email) are protected. Click <strong>Show Interest</strong> below to request contact info delivered to your Notifications.
        </div>
      </div>

      <ShowInterestButton
        property_id={property.id}
        owner_id={property.owner_id}
        full_width={true}
      />
    </div>
  );
}
