'use client';

import React, { useEffect, useState } from 'react';
import { create_client } from '@/lib/supabase/client';
import AdminSidebar from '@/components/layout/admin_sidebar';
import './reports.css';

export default function AdminReportsPage() {
  const [reports, set_reports] = useState<any[]>([]);
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    async function load_reports() {
      set_loading(true);
      const supabase = create_client();
      const { data } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
      set_reports(data || []);
      set_loading(false);
    }
    load_reports();
  }, []);

  return (
    <div className="admin_layout_container">
      <AdminSidebar />

      <main className="admin_main_content">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: 0 }}>
          User Flagged Reports
        </h1>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <h3>Loading reports...</h3>
          </div>
        ) : reports.length === 0 ? (
          <div className="admin_reports_card" style={{ textAlign: 'center', color: '#6b7280' }}>
            <h3>No Active User Reports</h3>
            <p>No inappropriate listings or users have been flagged.</p>
          </div>
        ) : (
          <div className="admin_reports_card">
            {reports.map((r) => (
              <div key={r.id} style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                <strong>Reason: {r.reason}</strong>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#4b5563' }}>{r.description}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
