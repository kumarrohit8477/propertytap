'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PropertyItem } from '@/types/property';
import { format_price } from '@/lib/utils/utils';
import { getGoogleMapsEmbedUrl, getGoogleMapsDirectionsUrl } from '@/lib/utils/geolocation';
import {
  MapPin,
  ExternalLink,
  Navigation,
  Home,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import './property_map_view.css';

interface PropertyMapViewProps {
  properties: PropertyItem[];
  current_city?: string;
}

export default function PropertyMapView({
  properties,
  current_city = 'India',
}: PropertyMapViewProps) {
  const [selected_property, set_selected_property] = useState<PropertyItem | null>(
    properties.length > 0 ? properties[0] : null
  );

  // Determine center query for the map embed
  const map_query = selected_property
    ? `${selected_property.locality || ''}, ${selected_property.city || ''}`
    : current_city || 'India';

  const embed_url = getGoogleMapsEmbedUrl(map_query);

  return (
    <div className="property_map_view_wrapper">
      {/* ── Left Sidebar: Interactive Property List on Map ── */}
      <div className="property_map_sidebar">
        <div className="property_map_sidebar_header">
          <div className="property_map_header_left">
            <MapPin size={18} className="map_header_icon" />
            <h3 className="property_map_heading">
              Map Search: <span>{current_city || 'Properties'}</span>
            </h3>
          </div>
          <span className="property_map_count">
            {properties.length} {properties.length === 1 ? 'place' : 'places'}
          </span>
        </div>

        <div className="property_map_list">
          {properties.length === 0 ? (
            <div className="property_map_empty">
              <p>No properties located in this area. Try clearing city filters.</p>
            </div>
          ) : (
            properties.map((prop) => {
              const is_active = selected_property?.id === prop.id;
              const primary_img =
                prop.images?.find((img) => img.is_primary)?.image_url ||
                prop.images?.[0]?.image_url ||
                'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400';

              return (
                <div
                  key={prop.id}
                  className={`property_map_item ${is_active ? 'property_map_item_active' : ''}`}
                  onClick={() => set_selected_property(prop)}
                >
                  <div className="property_map_item_thumb_wrap">
                    <img
                      src={primary_img}
                      alt={prop.title}
                      className="property_map_item_thumb"
                    />
                    <span
                      className={`property_map_badge ${
                        prop.purpose === 'rent' ? 'badge_rent' : 'badge_sale'
                      }`}
                    >
                      {prop.purpose === 'rent' ? 'Rent' : 'Sale'}
                    </span>
                  </div>

                  <div className="property_map_item_details">
                    <span className="property_map_item_price">
                      {format_price(prop.price)}
                      {prop.purpose === 'rent' && <small>/mo</small>}
                    </span>
                    <h4 className="property_map_item_title">{prop.title}</h4>
                    <span className="property_map_item_location">
                      {prop.locality}, {prop.city}
                    </span>

                    <div className="property_map_item_actions">
                      <Link
                        href={`/properties/${prop.id}`}
                        className="property_map_item_link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>View Details</span>
                        <ChevronRight size={13} />
                      </Link>
                      <a
                        href={getGoogleMapsDirectionsUrl(
                          `${prop.locality}, ${prop.city}`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="property_map_directions_btn"
                        onClick={(e) => e.stopPropagation()}
                        title="Get directions in Google Maps"
                      >
                        <Navigation size={12} />
                        <span>Directions</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Right: Embedded Interactive Google Map ── */}
      <div className="property_map_embed_container">
        <iframe
          title="Google Maps Property Search"
          src={embed_url}
          className="property_map_iframe"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Selected Property Overlay Floating Pill on Map */}
        {selected_property && (
          <div className="property_map_floating_card">
            <div className="property_map_float_left">
              <span className="property_map_float_tag">Selected Property</span>
              <strong className="property_map_float_title">
                {selected_property.title}
              </strong>
              <span className="property_map_float_loc">
                {selected_property.locality}, {selected_property.city} ·{' '}
                <strong>{format_price(selected_property.price)}</strong>
              </span>
            </div>
            <a
              href={getGoogleMapsDirectionsUrl(
                `${selected_property.locality}, ${selected_property.city}`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="property_map_float_gmaps_btn"
            >
              <span>Open in Google Maps</span>
              <ExternalLink size={13} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
