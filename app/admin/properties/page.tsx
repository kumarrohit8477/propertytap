'use client';

import React, { useEffect, useState } from 'react';
import { create_client } from '@/lib/supabase/client';
import AdminSidebar from '@/components/layout/admin_sidebar';
import Button from '@/components/ui/button';
import { format_price, format_date } from '@/lib/utils/utils';
import './properties.css';

export default function AdminPropertiesPage() {
  const [properties, set_properties] = useState<any[]>([]);
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    async function load_all_props() {
      set_loading(true);
      const supabase = create_client();
      const { data } = await supabase
        .from('properties')
        .select(`
          *,
          owner:profiles(full_name, email)
        `)
        .order('created_at', { ascending: false });
      set_properties(data || []);
      set_loading(false);
    }
    load_all_props();
  }, []);

  const handle_delete_property = async (id: string) => {
    if (!confirm('Are you sure you want to remove this property listing?')) return;
    const supabase = create_client();
    await supabase.from('properties').delete().eq('id', id);
    set_properties((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="admin_layout_container">
      <AdminSidebar />

      <main className="admin_main_content">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: 0 }}>
          Property Listings Moderation
        </h1>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <h3>Loading properties...</h3>
          </div>
        ) : (
          <div className="admin_properties_card">
            <table className="admin_table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Location</th>
                  <th>Lister</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>{p.title}</td>
                    <td style={{ color: '#059669', fontWeight: 700 }}>{format_price(p.price)}</td>
                    <td>{p.locality}, {p.city}</td>
                    <td>{p.owner?.full_name}</td>
                    <td>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '4px', backgroundColor: '#dcfce7', color: '#15803d' }}>
                        {p.status}
                      </span>
                    </td>
                    <td>{format_date(p.created_at)}</td>
                    <td>
                      <Button variant="danger" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }} onClick={() => handle_delete_property(p.id)}>
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
