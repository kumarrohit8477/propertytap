'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import {
  getCurrentCoordinates,
  reverseGeocode,
  GeoLocationResult,
  getGoogleMapsDirectionsUrl,
} from '@/lib/utils/geolocation';
import './near_me_modal.css';

export interface NearMeSelection {
  city: string;
  locality?: string;
  category_id?: string;
  category_label?: string;
  latitude?: number;
  longitude?: number;
  displayName: string;
}

interface NearMeModalProps {
  on_select: (selection: NearMeSelection) => void;
  trigger_button_text?: string;
  className?: string;
  show_icon?: boolean;
}

const PROPERTY_TYPES_OPTIONS = [
  { key: 'hostel-pg', label: 'Hostel / PG' },
  { key: 'apartment-flat-house', label: 'Flat / Apartment / House' },
  { key: 'office-workspace', label: 'Office & Workspace' },
  { key: 'shops-showrooms', label: 'Shops & Showrooms' },
  { key: 'land', label: 'Land / Plot' },
  { key: 'all', label: 'All Properties' },
];

export default function NearMeModal({
  on_select,
  trigger_button_text = 'Near Me',
  className = '',
  show_icon = false,
}: NearMeModalProps) {
  const [modal_open, set_modal_open] = useState(false);
  const [detecting, set_detecting] = useState(false);
  const [location_info, set_location_info] = useState<GeoLocationResult | null>(null);
  const [error_msg, set_error_msg] = useState<string | null>(null);

  const start_location_detection = async () => {
    set_error_msg(null);
    set_detecting(true);
    set_modal_open(true);

    try {
      const coords = await getCurrentCoordinates();
      const geo = await reverseGeocode(coords.latitude, coords.longitude);
      set_location_info(geo);
    } catch (err: any) {
      console.error('Location detection error:', err);
      let msg = 'Could not detect your exact location. Please enable location permissions in your browser.';
      if (err?.code === 1) {
        msg = 'Location permission was denied. Please allow location access in your browser settings to find properties near you.';
      } else if (err?.code === 2) {
        msg = 'Location position is currently unavailable. Please try again or type your city.';
      } else if (err?.code === 3) {
        msg = 'Location request timed out. Please try again.';
      }
      set_error_msg(msg);
    } finally {
      set_detecting(false);
    }
  };

  const handle_choose_category = (cat_key: string, cat_label: string) => {
    if (!location_info) return;

    on_select({
      city: location_info.city,
      locality: location_info.locality,
      category_id: cat_key === 'all' ? undefined : cat_key,
      category_label: cat_label,
      latitude: location_info.latitude,
      longitude: location_info.longitude,
      displayName: location_info.displayName,
    });

    set_modal_open(false);
  };

  const close_modal = () => {
    set_modal_open(false);
  };

  return (
    <>
      {/* ── Trigger Button ── */}
      <button
        type="button"
        className={`near_me_trigger_btn ${className}`}
        onClick={start_location_detection}
        title="Find properties near your current location"
      >
        {show_icon ? (
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="near_me_trigger_svg_icon"
          >
            <circle cx="12" cy="12" r="8" />
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
          </svg>
        ) : (
          <span className="near_me_trigger_dot" />
        )}
        <span className="near_me_trigger_text">{trigger_button_text}</span>
      </button>

      {/* ── Modal Dialog ── */}
      {modal_open && (
        <div className="near_me_modal_backdrop" onClick={close_modal}>
          <div
            className="near_me_modal_card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="near_me_modal_header">
              <h2 className="near_me_modal_title">Find Properties Near You</h2>
              <button
                type="button"
                className="near_me_modal_close_btn"
                onClick={close_modal}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content States */}
            {detecting ? (
              <div className="near_me_detecting_state">
                <div className="near_me_spinner" />
                <h3 className="near_me_state_title">Detecting your location...</h3>
                <p className="near_me_state_desc">
                  Please click &quot;Allow&quot; if prompted by your browser.
                </p>
              </div>
            ) : error_msg ? (
              <div className="near_me_error_state">
                <h3 className="near_me_error_title">Location Permission Required</h3>
                <p className="near_me_error_desc">{error_msg}</p>
                <div className="near_me_error_actions">
                  <button
                    type="button"
                    className="near_me_retry_btn"
                    onClick={start_location_detection}
                  >
                    Try Again
                  </button>
                  <button
                    type="button"
                    className="near_me_cancel_btn"
                    onClick={close_modal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : location_info ? (
              <div className="near_me_selection_body">
                {/* Clean Detected Location Banner */}
                <div className="near_me_detected_banner">
                  <div className="near_me_detected_info">
                    <span className="near_me_detected_label">Detected Location</span>
                    <strong className="near_me_detected_name">
                      {location_info.displayName}
                    </strong>
                  </div>
                  <a
                    href={getGoogleMapsDirectionsUrl(
                      `${location_info.latitude},${location_info.longitude}`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="near_me_gmaps_link"
                    title="View on Google Maps"
                  >
                    Google Maps ↗
                  </a>
                </div>

                <div className="near_me_prompt_text">
                  Select what you are looking for:
                </div>

                {/* Clean Category Options Grid (No icons, no descriptions, no badges) */}
                <div className="near_me_categories_grid">
                  {PROPERTY_TYPES_OPTIONS.map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      className="near_me_category_option"
                      onClick={() => handle_choose_category(cat.key, cat.label)}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
