'use client';

import React, { useEffect, useState } from 'react';
import { use_auth } from '@/hooks/use_auth';
import { update_user_profile } from '@/lib/users/user_service';
import { update_user_password } from '@/lib/auth/auth_service';
import { ProfileType } from '@/types/user';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { format_date } from '@/lib/utils/utils';
import { Lock, User, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import './profile.css';

export default function ProfilePage() {
  const { profile } = use_auth();

  // Profile Form State
  const [full_name, set_full_name] = useState('');
  const [display_name, set_display_name] = useState('');
  const [profile_type, set_profile_type] = useState<ProfileType>('individual');
  const [phone, set_phone] = useState('');
  const [saving_profile, set_saving_profile] = useState(false);
  const [profile_success, set_profile_success] = useState(false);

  // Password Form State
  const [new_password, set_new_password] = useState('');
  const [confirm_password, set_confirm_password] = useState('');
  const [saving_password, set_saving_password] = useState(false);
  const [password_msg, set_password_msg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (profile) {
      set_full_name(profile.full_name || '');
      set_display_name(profile.display_name || profile.full_name || '');
      set_profile_type(profile.profile_type || 'individual');
      set_phone(profile.phone || '');
    }
  }, [profile]);

  // Handle Profile Update
  const handle_save_profile = async (e: React.FormEvent) => {
    e.preventDefault();
    set_saving_profile(true);
    set_profile_success(false);

    await update_user_profile({
      full_name,
      display_name: display_name.trim() || full_name,
      profile_type,
      phone,
    });

    set_saving_profile(false);
    set_profile_success(true);
  };

  // Handle Password Update
  const handle_update_password = async (e: React.FormEvent) => {
    e.preventDefault();
    set_password_msg(null);

    if (new_password.length < 6) {
      set_password_msg({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    if (new_password !== confirm_password) {
      set_password_msg({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }

    set_saving_password(true);
    const { error } = await update_user_password(new_password);

    if (error) {
      set_password_msg({ type: 'error', text: error.message || 'Failed to update password.' });
    } else {
      set_password_msg({ type: 'success', text: 'Password updated successfully!' });
      set_new_password('');
      set_confirm_password('');
    }
    set_saving_password(false);
  };

  return (
    <div className="dashboard_layout_container">
      <main className="dashboard_main_content">
        <div className="profile_page_header">
          <h1 className="profile_page_title">User Profile &amp; Security</h1>
         
        </div>

        <div className="profile_sections_container">
          {/* ── Profile Information Card ── */}
          <form className="profile_card" onSubmit={handle_save_profile}>
            <div className="profile_header">
              <div className="profile_avatar_circle">
                {display_name ? display_name.charAt(0).toUpperCase() : full_name ? full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="profile_info_group">
                <h2 className="profile_user_name">{display_name || full_name || 'User'}</h2>
                <span className="profile_user_email">{profile?.email}</span>
                <div className="profile_tags_row">
                  <span className="profile_tag profile_tag_role">
                    Role: {profile?.role || 'user'}
                  </span>
                  <span className="profile_tag profile_tag_date">
                    Joined: {profile?.created_at ? format_date(profile.created_at) : 'Recently'}
                  </span>
                </div>
              </div>
            </div>

            {profile_success && (
              <div className="profile_alert profile_alert_success">
                <CheckCircle2 size={16} />
                <span>Profile details updated successfully!</span>
              </div>
            )}

            <div className="profile_field_group">
              <label className="profile_label">
                Listing Provider Type
              </label>
              <select
                className="profile_select"
                value={profile_type}
                onChange={(e) => set_profile_type(e.target.value as ProfileType)}
              >
                <option value="individual">Individual</option>
                <option value="pg">PG</option>
                <option value="hostel">Hostel</option>
                <option value="company">Company</option>
              </select>
            </div>

            <Input
              label="Listing / Display Name (Shown as 'Listed by: [Name]' on property cards)"
              value={display_name}
              onChange={(e) => set_display_name(e.target.value)}
              placeholder="e.g. Rahul Sharma, XYZ PG, XYZ Hostel, or XYZ Pvt. Ltd."
              required
            />

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
              label="Email Address (Account ID)"
              value={profile?.email || ''}
              disabled
            />

            <div className="profile_actions_row">
              <Button variant="primary" disabled={saving_profile} type="submit">
                {saving_profile ? 'Saving...' : 'Save Profile Details'}
              </Button>
            </div>
          </form>

          {/* ── Change Security Password Card ── */}
          <form className="profile_card" onSubmit={handle_update_password}>
            <div className="security_card_header">
              <div className="security_icon_wrap">
                <KeyRound size={20} />
              </div>
              <div>
                <h2 className="security_title">Change Security Password</h2>
                <p className="security_subtitle">
                  Update your account password. Must be at least 6 characters long.
                </p>
              </div>
            </div>

            {password_msg && (
              <div
                className={`profile_alert ${
                  password_msg.type === 'success' ? 'profile_alert_success' : 'profile_alert_error'
                }`}
              >
                {password_msg.type === 'success' ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                <span>{password_msg.text}</span>
              </div>
            )}

            <div className="security_inputs_grid">
              <Input
                label="New Password"
                type="password"
                placeholder="At least 6 characters"
                value={new_password}
                onChange={(e) => set_new_password(e.target.value)}
                required
                minLength={6}
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Re-type new password"
                value={confirm_password}
                onChange={(e) => set_confirm_password(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="profile_actions_row">
              <Button variant="primary" disabled={saving_password} type="submit">
                {saving_password ? 'Updating Password...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
