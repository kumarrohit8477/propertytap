'use client';

import React, { useEffect, useState } from 'react';
import { use_auth } from '@/hooks/use_auth';
import { update_user_profile } from '@/lib/users/user_service';
import DashboardSidebar from '@/components/layout/dashboard_sidebar';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { format_date } from '@/lib/utils/utils';
import './profile.css';

export default function ProfilePage() {
  const { profile } = use_auth();
  const [full_name, set_full_name] = useState('');
  const [phone, set_phone] = useState('');
  const [saving, set_saving] = useState(false);
  const [success_msg, set_success_msg] = useState(false);

  useEffect(() => {
    if (profile) {
      set_full_name(profile.full_name || '');
      set_phone(profile.phone || '');
    }
  }, [profile]);

  const handle_save = async (e: React.FormEvent) => {
    e.preventDefault();
    set_saving(true);
    set_success_msg(false);

    await update_user_profile({
      full_name,
      phone,
    });

    set_saving(false);
    set_success_msg(true);
  };

  return (
    <div className="dashboard_layout_container">
      <DashboardSidebar />

      <main className="dashboard_main_content">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: 0 }}>
          User Profile
        </h1>

        <form className="profile_card" onSubmit={handle_save}>
          <div className="profile_header">
            <div className="profile_avatar_circle">
              {full_name ? full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="profile_info_group">
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{full_name || 'User'}</h2>
              <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{profile?.email}</span>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                <span className="profile_verified_tag">
                  Role: {profile?.role || 'user'}
                </span>
                <span className="profile_verified_tag">
                  Joined: {profile?.created_at ? format_date(profile.created_at) : 'Recently'}
                </span>
              </div>
            </div>
          </div>

          {success_msg && (
            <div style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem' }}>
              ✅ Profile updated successfully!
            </div>
          )}

          <Input
            label="Full Name"
            value={full_name}
            onChange={(e) => set_full_name(e.target.value)}
            required
          />

          <Input
            label="Phone Number"
            value={phone}
            onChange={(e) => set_phone(e.target.value)}
            placeholder="e.g. +91 9876543210"
          />

          <Input
            label="Email Address"
            value={profile?.email || ''}
            disabled
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" disabled={saving} type="submit">
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
