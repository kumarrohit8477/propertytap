'use client';

import React, { useEffect, useState } from 'react';
import { create_client } from '@/lib/supabase/client';
import AdminSidebar from '@/components/layout/admin_sidebar';
import './admin.css';

export default function AdminOverviewPage() {
  const [stats, set_stats] = useState({
    total_users: 0,
    total_properties: 0,
    active_listings: 0,
    total_interests: 0,
    total_reports: 0,
    revenue: 0,
  });
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    async function load_admin_stats() {
      set_loading(true);
      const supabase = create_client();

      const [users_res, props_res, interests_res, reports_res] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('interests').select('*', { count: 'exact', head: true }),
        supabase.from('reports').select('*', { count: 'exact', head: true }),
      ]);

      set_stats({
        total_users: users_res.count || 0,
        total_properties: props_res.count || 0,
        active_listings: props_res.count || 0,
        total_interests: interests_res.count || 0,
        total_reports: reports_res.count || 0,
        revenue: 0,
      });

      set_loading(false);
    }
    load_admin_stats();
  }, []);

  return (
    <div className="admin_layout_container">
      <AdminSidebar />

      <main className="admin_main_content">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: 0 }}>
            PropertyTap System Overview
          </h1>
          <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>
            Platform metrics, active listings, user reports, and moderation control.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <h3>Loading metrics...</h3>
          </div>
        ) : (
          <div className="admin_stats_grid">
            <div className="admin_stat_card">
              <span className="admin_stat_number">{stats.total_users}</span>
              <span className="admin_stat_label">Total Users</span>
            </div>
            <div className="admin_stat_card">
              <span className="admin_stat_number">{stats.total_properties}</span>
              <span className="admin_stat_label">Total Properties</span>
            </div>
            <div className="admin_stat_card">
              <span className="admin_stat_number">{stats.active_listings}</span>
              <span className="admin_stat_label">Active Listings</span>
            </div>
            <div className="admin_stat_card">
              <span className="admin_stat_number">{stats.total_interests}</span>
              <span className="admin_stat_label">Interests Expressed</span>
            </div>
            <div className="admin_stat_card">
              <span className="admin_stat_number">{stats.total_reports}</span>
              <span className="admin_stat_label">User Reports</span>
            </div>
            <div className="admin_stat_card">
              <span className="admin_stat_number" style={{ color: '#10b981' }}>₹{stats.revenue}</span>
              <span className="admin_stat_label">Total Revenue (₹0 Launch)</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
