'use client';

import React, { useEffect, useState } from 'react';
import { get_listing_plans } from '@/lib/payments/payment_service';
import AdminSidebar from '@/components/layout/admin_sidebar';
import { ListingPlan } from '@/types/plan';
import { format_price } from '@/lib/utils/utils';
import './plans.css';

export default function AdminPlansPage() {
  const [plans, set_plans] = useState<ListingPlan[]>([]);
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    async function load_plans() {
      set_loading(true);
      const { plans: data } = await get_listing_plans();
      set_plans((data as ListingPlan[]) || []);
      set_loading(false);
    }
    load_plans();
  }, []);

  return (
    <div className="admin_layout_container">
      <AdminSidebar />

      <main className="admin_main_content">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: 0 }}>
          Manage Listing Plans &amp; Prices
        </h1>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <h3>Loading plans...</h3>
          </div>
        ) : (
          <div className="admin_plans_card">
            <table className="admin_table">
              <thead>
                <tr>
                  <th>Plan Name</th>
                  <th>Duration (Days)</th>
                  <th>Listing Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 700 }}>{p.name}</td>
                    <td>{p.duration_days} days</td>
                    <td style={{ fontWeight: 700, color: p.price === 0 ? '#059669' : '#111827' }}>
                      {p.price === 0 ? '₹0 (Free Launch)' : format_price(p.price)}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '4px', backgroundColor: p.is_active ? '#dcfce7' : '#f3f4f6', color: p.is_active ? '#15803d' : '#6b7280' }}>
                        {p.is_active ? 'Active' : 'Inactive'}
                      </span>
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
