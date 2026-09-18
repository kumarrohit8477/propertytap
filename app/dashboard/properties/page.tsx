'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { get_user_my_properties } from '@/lib/properties/property_service';
import { PropertyItem } from '@/types/property';
import { format_price } from '@/lib/utils/utils';
import DashboardSidebar from '@/components/layout/dashboard_sidebar';
import Button from '@/components/ui/button';
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
      <DashboardSidebar />

      <main className="dashboard_main_content">
        <div className="my_properties_header">
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: 0 }}>
              My Listed Properties
            </h1>
            <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>
              Manage, edit, or track interest on your active property listings.
            </p>
          </div>
          <Link href="/dashboard/properties/new">
            <Button variant="primary">+ Post Property</Button>
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <h3>Loading properties...</h3>
          </div>
        ) : properties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3>No Properties Listed Yet</h3>
            <p style={{ color: '#6b7280', margin: '0.5rem 0 1.25rem 0' }}>You haven&apos;t posted any properties. Post your first listing for ₹0!</p>
            <Link href="/dashboard/properties/new">
              <Button variant="primary">+ List Property Free</Button>
            </Link>
          </div>
        ) : (
          <div className="my_properties_list">
            {properties.map((prop: any) => {
              const primary_img =
                prop.images?.find((img: any) => img.is_primary)?.image_url ||
                prop.images?.[0]?.image_url ||
                'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400';

              return (
                <div key={prop.id} className="my_property_card">
                  <div className="my_property_left">
                    <img
                      src={primary_img}
                      alt={prop.title}
                      className="my_property_thumbnail"
                    />
                    <div className="my_property_info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span className="my_property_status_badge my_property_status_active">
                          {prop.status}
                        </span>
                        <h3 className="my_property_title">{prop.title}</h3>
                      </div>
                      <div className="my_property_meta">
                        <span>💰 {format_price(prop.price)}</span>
                        <span>📍 {prop.locality}, {prop.city}</span>
                        <span>📸 {prop.images?.length || 0} photo{prop.images?.length === 1 ? '' : 's'}</span>
                        <span>🤝 {prop.interests?.[0]?.count || 0} Interests</span>
                      </div>
                    </div>
                  </div>

                  <div className="my_property_actions">
                    <Link href={`/properties/${prop.id}`}>
                      <Button variant="outline" style={{ fontSize: '0.85rem' }}>View</Button>
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
