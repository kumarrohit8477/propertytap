'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { get_property_by_id } from '@/lib/properties/property_service';
import { create_client } from '@/lib/supabase/client';
import DashboardSidebar from '@/components/layout/dashboard_sidebar';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import './property_edit.css';

export default function PropertyEditPage() {
  const params = useParams();
  const router = useRouter();
  const property_id = params?.id as string;

  const [loading, set_loading] = useState(true);
  const [saving, set_saving] = useState(false);
  const [title, set_title] = useState('');
  const [price, set_price] = useState('');
  const [description, set_description] = useState('');

  useEffect(() => {
    async function load() {
      if (!property_id) return;
      const { property } = await get_property_by_id(property_id);
      if (property) {
        set_title(property.title);
        set_price(String(property.price));
        set_description(property.description || '');
      }
      set_loading(false);
    }
    load();
  }, [property_id]);

  const handle_save = async (e: React.FormEvent) => {
    e.preventDefault();
    set_saving(true);
    const supabase = create_client();
    await supabase
      .from('properties')
      .update({
        title,
        price: Number(price),
        description,
        updated_at: new Date().toISOString(),
      })
      .eq('id', property_id);

    set_saving(false);
    router.push('/dashboard/properties');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="dashboard_layout_container">
        <DashboardSidebar />
        <main className="dashboard_main_content">
          <h3>Loading property...</h3>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard_layout_container">
      <DashboardSidebar />

      <main className="dashboard_main_content">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: 0 }}>
          Edit Property Listing
        </h1>

        <form className="property_edit_card" onSubmit={handle_save}>
          <Input label="Property Title" value={title} onChange={(e) => set_title(e.target.value)} required />
          <Input label="Price (₹)" type="number" value={price} onChange={(e) => set_price(e.target.value)} required />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Description</label>
            <textarea
              style={{ padding: '0.625rem', borderRadius: '8px', border: '1px solid #d1d5db', minHeight: '120px', fontFamily: 'inherit' }}
              value={description}
              onChange={(e) => set_description(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => router.push('/dashboard/properties')}>
              Cancel
            </Button>
            <Button variant="primary" disabled={saving} type="submit">
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
