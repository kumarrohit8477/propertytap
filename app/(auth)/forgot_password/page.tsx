'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { reset_password_request } from '@/lib/auth/auth_service';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import './forgot_password.css';

export default function ForgotPasswordPage() {
  const [email, set_email] = useState('');
  const [loading, set_loading] = useState(false);
  const [submitted, set_submitted] = useState(false);
  const [error_msg, set_error_msg] = useState<string | null>(null);

  const handle_submit = async (e: React.FormEvent) => {
    e.preventDefault();
    set_loading(true);
    set_error_msg(null);

    const { error } = await reset_password_request(email);

    if (error) {
      set_error_msg(error.message || 'Failed to send reset link.');
    } else {
      set_submitted(true);
    }
    set_loading(false);
  };

  return (
    <div className="forgot_password_container">
      <form className="forgot_password_card" onSubmit={handle_submit}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', margin: 0 }}>Reset Password</h2>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center', marginTop: '-0.5rem' }}>
          Enter your registered email address to receive password reset instructions.
        </p>

        {error_msg && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem' }}>
            {error_msg}
          </div>
        )}

        {submitted ? (
          <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '1rem', borderRadius: '6px', fontSize: '0.9rem', textAlign: 'center' }}>
            ✅ Password reset link has been sent to your email address!
          </div>
        ) : (
          <>
            <Input
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => set_email(e.target.value)}
              required
            />

            <Button variant="primary" full_width={true} disabled={loading} type="submit">
              {loading ? 'Sending Link...' : 'Send Reset Link'}
            </Button>
          </>
        )}

        <div style={{ textAlign: 'center', fontSize: '0.875rem' }}>
          Remember your password?{' '}
          <Link href="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}
