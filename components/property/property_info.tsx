'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { use_auth } from '@/hooks/use_auth';
import { PropertyItem } from '@/types/property';
import { format_price, format_date } from '@/lib/utils/utils';
import { getGoogleMapsDirectionsUrl } from '@/lib/utils/geolocation';
import ShowInterestButton from './show_interest_button';
import CallNowButton from './call_now_button';
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Sofa,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Car,
  Compass,
  Building2,
  Utensils,
  Users,
  Share2,
  Check,
  Sparkles,
  Lock,
  Pencil,
} from 'lucide-react';
import './property_info.css';

interface PropertyInfoProps {
  property: PropertyItem;
}

export default function PropertyInfo({ property }: PropertyInfoProps) {
  const { user } = use_auth();
  const [copied, set_copied] = useState(false);

  const is_rent = property.purpose === 'rent';
  const lister_name = property.owner?.display_name || property.owner?.full_name || 'Property Owner';
  const lister_initial = lister_name.charAt(0).toUpperCase();

  const handle_share = async () => {
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        try {
          await navigator.share({
            title: property.title,
            text: `Check out this property on PropertyTap: ${property.title} in ${property.locality}, ${property.city}`,
            url: window.location.href,
          });
          return;
        } catch {
          // fallback to clipboard
        }
      }
      try {
        await navigator.clipboard.writeText(window.location.href);
        set_copied(true);
        setTimeout(() => set_copied(false), 2500);
      } catch {
        // clipboard unavailable
      }
    }
  };

  return (
    <div className="property_info_container">
      {/* ── Card Header & Badges ── */}
      <div className="property_info_header">
        <div className="property_info_top_bar">
          <div className="property_info_badges">
            <span
              className={`property_info_badge ${
                is_rent ? 'property_info_badge_rent' : 'property_info_badge_sale'
              }`}
            >
              For {is_rent ? 'Rent' : 'Sale'}
            </span>
            <span className="property_info_badge property_info_badge_category">
              {property.category?.name || 'Property'}
            </span>
            <span className="property_info_badge property_info_badge_verified">
              <CheckCircle2 size={13} />
              <span>Verified Listing</span>
            </span>
          </div>

          <button
            type="button"
            className="property_info_share_btn"
            onClick={handle_share}
            title="Share or Copy Link"
            aria-label="Share property"
          >
            {copied ? (
              <>
                <Check size={14} className="share_icon_copied" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Share2 size={14} />
                <span>Share</span>
              </>
            )}
          </button>
        </div>

        {/* Title */}
        <h1 className="property_info_title">{property.title}</h1>

        {/* Location & Google Maps */}
        <div className="property_info_location_wrapper">
          <div className="property_info_location">
            <MapPin size={16} className="property_info_location_icon" />
            <span>
              {property.locality}, {property.city}
              {property.address ? ` (${property.address})` : ''}
            </span>
          </div>
          <a
            href={getGoogleMapsDirectionsUrl(
              [property.title, property.locality, property.city, property.address].filter(Boolean).join(', ')
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="property_info_maps_link"
            title="Open in Google Maps for directions"
          >
            <Compass size={14} />
            <span>Open in Google Maps</span>
          </a>
        </div>
      </div>

      {/* ── Price Section ── */}
      <div className="property_info_price_box">
        <div className="property_info_price_row">
          <div className="property_info_price">
            {format_price(property.price)}
            {is_rent && <span className="property_info_price_period">/ month</span>}
          </div>
          <span className="property_info_brokerage_pill">0% Brokerage</span>
        </div>
        <span className="property_info_price_subtext">
          Direct owner deal · No brokerage fees or commission
        </span>
      </div>

      {/* ── Key Highlights / Specs Grid ── */}
      <div className="property_info_specs_section">
        <h3 className="property_info_specs_heading">Overview &amp; Details</h3>
        <div className="property_info_specs_grid">
          {property.bedrooms !== null && property.bedrooms !== undefined && (
            <div className="property_info_spec_item">
              <div className="property_info_spec_icon_wrap">
                <Bed size={18} />
              </div>
              <div className="property_info_spec_content">
                <span className="property_info_spec_label">Bedrooms</span>
                <span className="property_info_spec_value">{property.bedrooms} BHK</span>
              </div>
            </div>
          )}

          {property.bathrooms !== null && property.bathrooms !== undefined && (
            <div className="property_info_spec_item">
              <div className="property_info_spec_icon_wrap">
                <Bath size={18} />
              </div>
              <div className="property_info_spec_content">
                <span className="property_info_spec_label">Bathrooms</span>
                <span className="property_info_spec_value">{property.bathrooms} Baths</span>
              </div>
            </div>
          )}

          {property.area && (
            <div className="property_info_spec_item">
              <div className="property_info_spec_icon_wrap">
                <Maximize2 size={18} />
              </div>
              <div className="property_info_spec_content">
                <span className="property_info_spec_label">Super Area</span>
                <span className="property_info_spec_value">
                  {property.area.toLocaleString('en-IN')} {property.area_unit || 'sqft'}
                </span>
              </div>
            </div>
          )}

          {property.furnishing && (
            <div className="property_info_spec_item">
              <div className="property_info_spec_icon_wrap">
                <Sofa size={18} />
              </div>
              <div className="property_info_spec_content">
                <span className="property_info_spec_label">Furnishing</span>
                <span className="property_info_spec_value" style={{ textTransform: 'capitalize' }}>
                  {property.furnishing}
                </span>
              </div>
            </div>
          )}

          {property.parking !== null && property.parking !== undefined && (
            <div className="property_info_spec_item">
              <div className="property_info_spec_icon_wrap">
                <Car size={18} />
              </div>
              <div className="property_info_spec_content">
                <span className="property_info_spec_label">Parking</span>
                <span className="property_info_spec_value">
                  {property.parking ? 'Available' : 'None'}
                </span>
              </div>
            </div>
          )}

          {property.floor !== null && property.floor !== undefined && (
            <div className="property_info_spec_item">
              <div className="property_info_spec_icon_wrap">
                <Building2 size={18} />
              </div>
              <div className="property_info_spec_content">
                <span className="property_info_spec_label">Floor</span>
                <span className="property_info_spec_value">Floor {property.floor}</span>
              </div>
            </div>
          )}

          {property.facing && (
            <div className="property_info_spec_item">
              <div className="property_info_spec_icon_wrap">
                <Compass size={18} />
              </div>
              <div className="property_info_spec_content">
                <span className="property_info_spec_label">Facing</span>
                <span className="property_info_spec_value" style={{ textTransform: 'capitalize' }}>
                  {property.facing} Facing
                </span>
              </div>
            </div>
          )}

          {property.food_included !== null && property.food_included !== undefined && (
            <div className="property_info_spec_item">
              <div className="property_info_spec_icon_wrap">
                <Utensils size={18} />
              </div>
              <div className="property_info_spec_content">
                <span className="property_info_spec_label">Meals / Food</span>
                <span className="property_info_spec_value">
                  {property.food_included ? 'Included' : 'Not Included'}
                </span>
              </div>
            </div>
          )}

          {property.sharing_type && (
            <div className="property_info_spec_item">
              <div className="property_info_spec_icon_wrap">
                <Users size={18} />
              </div>
              <div className="property_info_spec_content">
                <span className="property_info_spec_label">Room Sharing</span>
                <span className="property_info_spec_value" style={{ textTransform: 'capitalize' }}>
                  {property.sharing_type}
                </span>
              </div>
            </div>
          )}

          <div className="property_info_spec_item">
            <div className="property_info_spec_icon_wrap">
              <Calendar size={18} />
            </div>
            <div className="property_info_spec_content">
              <span className="property_info_spec_label">Listed On</span>
              <span className="property_info_spec_value">{format_date(property.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Description Card ── */}
      <div className="property_info_section">
        <div className="property_info_section_header">
          <Sparkles size={16} className="property_info_section_icon" />
          <h3 className="property_info_section_title">About This Property</h3>
        </div>
        <div className="property_info_description_card">
          <p className="property_info_description">
            {property.description || 'No detailed description provided by the lister.'}
          </p>
        </div>
      </div>

      {/* ── Lister Card ── */}
      <div className="property_info_lister_box">
        <div className="property_info_lister_header">
          <div className="property_info_lister_avatar">
            {lister_initial}
          </div>
          <div className="property_info_lister_details">
            <div className="property_info_lister_name_row">
              <span className="property_info_lister_name">{lister_name}</span>
              <ShieldCheck size={16} className="property_info_shield_icon" />
            </div>
            <span className="property_info_lister_role">
              {property.owner?.profile_type
                ? `${property.owner.profile_type.toUpperCase()} Lister`
                : 'Verified Property Owner'}
            </span>
          </div>
        </div>

        <div className="property_info_privacy_note">
          <Lock size={13} className="property_info_lock_icon" />
          <span>
            Connect securely without middleman fees. Click below to express interest or call the owner directly.
          </span>
        </div>
      </div>

      {/* ── Owner Quick Actions ── */}
      {user?.id === property.owner_id && (
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '10px',
          padding: '0.85rem 1rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          flexWrap: 'wrap'
        }}>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e40af' }}>
              You own this listing
            </div>
            <div style={{ fontSize: '0.75rem', color: '#3b82f6' }}>
              Update photos (up to 10), pricing, and details
            </div>
          </div>
          <Link href={`/dashboard/properties/${property.id}`}>
            <button
              type="button"
              style={{
                backgroundColor: '#1d4ed8',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <Pencil size={13} />
              <span>Edit / Update Photos</span>
            </button>
          </Link>
        </div>
      )}

      {/* ── Primary Action Buttons ── */}
      <div className="property_info_actions">
        <ShowInterestButton
          property_id={property.id}
          owner_id={property.owner_id}
          full_width={true}
          check_on_mount={true}
        />
        <CallNowButton
          phone={property.owner?.phone}
          owner_id={property.owner_id}
          property_id={property.id}
          full_width={true}
        />
      </div>

      {/* ── Trust Indicators ── */}
      <div className="property_info_trust_row">
        <span className="property_info_trust_item">⚡ Instant Direct Contact</span>
        <span className="property_info_trust_dot">•</span>
        <span className="property_info_trust_item">🛡️ Verified Lister</span>
        <span className="property_info_trust_dot">•</span>
        <span className="property_info_trust_item">🚫 Zero Brokerage</span>
      </div>

      {/* ── Mobile Sticky Floating Bottom Bar ── */}
      <div className="property_mobile_bottom_bar">
        <div className="property_mobile_price_col">
          <span className="property_mobile_price_label">Total Price</span>
          <span className="property_mobile_price_val">
            {format_price(property.price)}
            {is_rent && <small>/mo</small>}
          </span>
        </div>
        <div className="property_mobile_actions_col">
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
