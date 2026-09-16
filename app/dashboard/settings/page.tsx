'use client';

import React, { useState } from 'react';
import { update_user_password } from '@/lib/auth/auth_service';
import DashboardSidebar from '@/components/layout/dashboard_sidebar';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import './settings.css';

export default function SettingsPage() {
  const [new_password, set_new_password] = useState('');
  const [loading, set_loading] = useState(false);
  const [status_msg, set_status_msg] = useState<string | null>(null);

  const handle_password_change = async (e: React.FormEvent) => {
    e.preventDefault();
    set_loading(true);
    set_status_msg(null);

    const { error } = await update_user_password(new_password);

    if (error) {
      set_status_msg(`Error: ${error.message}`);
    } else {
      set_status_msg('✅ Password updated successfully!');
      set_new_password('');
    }
    set_loading(false);
  };

  return (
    <div className="dashboard_layout_container">
      <DashboardSidebar />

      <main className="dashboard_main_content">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: 0 }}>
          Account Settings
        </h1>

        <form className="settings_card" onSubmit={handle_password_change}>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Change Security Password</h3>

          {status_msg && (
            <div style={{ padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem', backgroundColor: status_msg.startsWith('✅') ? '#ecfdf5' : '#fef2f2', color: status_msg.startsWith('✅') ? '#047857' : '#ef4444' }}>
              {status_msg}
            </div>
          )}

          <Input
            label="New Password"
            type="password"
            placeholder="At least 6 characters"
            value={new_password}
            onChange={(e) => set_new_password(e.target.value)}
            required
            minLength={6}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" disabled={loading} type="submit">
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
