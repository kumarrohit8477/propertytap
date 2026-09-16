'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { update_user_password } from '@/lib/auth/auth_service';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import './reset_password.css';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, set_password] = useState('');
  const [loading, set_loading] = useState(false);
  const [error_msg, set_error_msg] = useState<string | null>(null);

  const handle_submit = async (e: React.FormEvent) => {
    e.preventDefault();
    set_loading(true);
    set_error_msg(null);

    const { error } = await update_user_password(password);

    if (error) {
      set_error_msg(error.message || 'Failed to update password.');
      set_loading(false);
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="reset_password_container">
      <form className="reset_password_card" onSubmit={handle_submit}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', margin: 0 }}>Set New Password</h2>

        {error_msg && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem' }}>
            {error_msg}
          </div>
        )}

        <Input
          label="New Password"
          type="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => set_password(e.target.value)}
          required
          minLength={6}
        />

        <Button variant="primary" full_width={true} disabled={loading} type="submit">
          {loading ? 'Updating Password...' : 'Update Password'}
        </Button>
      </form>
    </div>
  );
}
