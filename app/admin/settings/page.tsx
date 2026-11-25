import React from 'react';
import AdminSidebar from '@/components/layout/admin_sidebar';
import Button from '@/components/ui/button';
import './settings.css';

export default function AdminSettingsPage() {
  return (
    <div className="admin_layout_container">
      <AdminSidebar />

      <main className="admin_main_content">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: 0 }}>
          Platform Settings
        </h1>

        <div className="admin_settings_card">
          <h3 style={{ margin: 0 }}>Global Brokerage &amp; Platform Fee Configuration</h3>
          <p style={{ color: '#4b5563', margin: 0, fontSize: '0.9rem' }}>
            PropertyTap Brokerage Charge: <strong>₹0 (0%)</strong>. PropertyTap does not charge brokerage on property transactions.
          </p>

          <div style={{ marginTop: '1rem' }}>
            <Button variant="primary" disabled>
              Save Platform Configuration
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
