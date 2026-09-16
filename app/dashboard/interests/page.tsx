'use client';

import React, { useEffect, useState } from 'react';
import { create_client } from '@/lib/supabase/client';
import DashboardSidebar from '@/components/layout/dashboard_sidebar';
import { format_date } from '@/lib/utils/utils';
import './interests.css';

export default function InterestsPage() {
  const [interests, set_interests] = useState<any[]>([]);
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    async function load_interests() {
      set_loading(true);
      const supabase = create_client();
      const { data: user_data } = await supabase.auth.getUser();

      if (user_data.user) {
        const { data } = await supabase
          .from('interests')
          .select(`
            *,
            property:properties(id, title, city, locality, price),
            interested_user:profiles!interests_interested_user_id_fkey(full_name, email, phone)
          `)
          .or(`interested_user_id.eq.${user_data.user.id},owner_id.eq.${user_data.user.id}`)
          .order('created_at', { ascending: false });

        set_interests(data || []);
      }
      set_loading(false);
    }
    load_interests();
  }, []);

  return (
    <div className="dashboard_layout_container">
      <DashboardSidebar />

      <main className="dashboard_main_content">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: 0 }}>
          Property Interests Log
        </h1>
        <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>
          Tracks properties you expressed interest in and seekers interested in your listings.
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <h3>Loading interests...</h3>
          </div>
        ) : interests.length === 0 ? (
          <div className="interests_page_card" style={{ textAlign: 'center', color: '#6b7280' }}>
            <h3>No Active Property Interests</h3>
            <p>Express interest on property detail pages to initiate direct lister connections.</p>
          </div>
        ) : (
          <div className="interests_page_card">
            {interests.map((item) => (
              <div key={item.id} className="interests_item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '1.05rem', color: '#111827' }}>
                    {item.property?.title || 'Property'}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {format_date(item.created_at)}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#4b5563' }}>
                  📍 {item.property?.locality}, {item.property?.city}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 600, marginTop: '0.25rem' }}>
                  ℹ️ Details delivered safely to your notifications inbox.
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
