'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { get_user_my_properties } from '@/lib/properties/property_service';
import { PropertyItem } from '@/types/property';
import { format_price } from '@/lib/utils/utils';
import Button from '@/components/ui/button';
import { Pencil, Eye, Plus, MapPin, Camera, Users, Loader2 } from 'lucide-react';
import '@/app/dashboard/dashboard.css';
import './properties.css';

export default function MyPropertiesPage() {
  const [properties, set_properties] = useState<PropertyItem[]>([]);
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    async function load_my_props() {
      set_loading(true);
      const { properties: data } = await get_user_my_properties();
      set_properties(data as any[]);
      set_loading(false);
    }
    load_my_props();
  }, []);

  return (
    <div className="dashboard_layout_container">
      <main className="dashboard_main_content">
        <div className="my_properties_header">
          <div>
            <h1 className="my_properties_heading">
              My Listed Properties
            </h1>
            <p className="my_properties_subheading">
              {loading
                ? 'Loading your listings...'
                : `${properties.length} ${properties.length === 1 ? 'property' : 'properties'} listed`}
            </p>
          </div>
          <Link href="/dashboard/properties/new" className="my_properties_post_btn_link">
            <Button variant="primary" className="my_properties_post_btn">
              <Plus size={16} />
              <span>Post Property</span>
            </Button>
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <Loader2 size={26} className="animate-spin" style={{ margin: '0 auto 0.75rem', color: '#1d4ed8' }} />
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#374151' }}>Loading your properties...</h3>
          </div>
        ) : properties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0 }}>No Properties Listed Yet</h3>
            <p style={{ color: '#6b7280', margin: '0.5rem 0 1.5rem 0', fontSize: '0.9rem' }}>
              You haven&apos;t posted any properties. Post your first listing for ₹0!
            </p>
            <Link href="/dashboard/properties/new">
              <Button variant="primary">
                <Plus size={16} />
                <span>List Property Free</span>
              </Button>
            </Link>
          </div>
        ) : (
          <div className="my_properties_list">
            {properties.map((prop: any) => {
              const primary_img =
                prop.images?.find((img: any) => img.is_primary)?.image_url ||
                prop.images?.[0]?.image_url ||
                'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400';

              const photos_count = prop.images?.length || 0;
              const interests_count = prop.interests?.[0]?.count || 0;

              return (
                <div key={prop.id} className="my_property_card">
                  <div className="my_property_card_top">
                    <div className="my_property_thumbnail_wrapper">
                      <img
                        src={primary_img}
                        alt={prop.title}
                        className="my_property_thumbnail"
                        loading="lazy"
                      />
                      <span className="my_property_status_badge my_property_status_active">
                        {prop.status || 'Active'}
                      </span>
                    </div>

                    <div className="my_property_info">
                      <h3 className="my_property_title">{prop.title}</h3>
                      <div className="my_property_price">
                        {format_price(prop.price)}
                        {prop.purpose === 'rent' && <span className="my_property_price_period">/month</span>}
                      </div>
                      <div className="my_property_location">
                        <MapPin size={13} style={{ flexShrink: 0, color: '#6b7280' }} />
                        <span>{prop.locality}, {prop.city}</span>
                      </div>
                    </div>
                  </div>

                  <div className="my_property_meta_strip">
                    <span className="my_property_meta_chip">
                      <Camera size={13} />
                      <span>{photos_count} photo{photos_count === 1 ? '' : 's'}</span>
                    </span>
                    <span className="my_property_meta_chip">
                      <Users size={13} />
                      <span>{interests_count} interest{interests_count === 1 ? '' : 's'}</span>
                    </span>
                  </div>

                  <div className="my_property_actions">
                    <Link href={`/dashboard/properties/${prop.id}`} className="my_property_action_btn_wrap">
                      <button
                        type="button"
                        className="my_property_action_btn my_property_edit_btn"
                      >
                        <Pencil size={14} />
                        <span>Edit / Photos</span>
                      </button>
                    </Link>
                    <Link href={`/properties/${prop.id}`} target="_blank" className="my_property_action_btn_wrap">
                      <button
                        type="button"
                        className="my_property_action_btn my_property_view_btn"
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
