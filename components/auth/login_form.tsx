'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { sign_in_user } from '@/lib/auth/auth_service';
import { show_interest } from '@/lib/properties/property_service';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import './login_form.css';

export default function LoginForm() {
  const router = useRouter();
  const [email, set_email] = useState('');
  const [password, set_password] = useState('');
  const [loading, set_loading] = useState(false);
  const [error_msg, set_error_msg] = useState<string | null>(null);

  const handle_back = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handle_submit = async (e: React.FormEvent) => {
    e.preventDefault();
    set_loading(true);
    set_error_msg(null);

    const { error } = await sign_in_user({ email, password });

    if (error) {
      set_error_msg(error.message || 'Invalid email or password.');
      set_loading(false);
    } else {
      let target_url = '/';
      if (typeof window !== 'undefined') {
        const url_params = new URLSearchParams(window.location.search);
        const query_redirect = url_params.get('redirect');
        const query_interest = url_params.get('interest_prop');
        const query_owner = url_params.get('owner_id');

        let pending_data: { property_id: string; owner_id: string; return_url?: string } | null = null;
        try {
          const raw = sessionStorage.getItem('pending_interest');
          if (raw) pending_data = JSON.parse(raw);
        } catch {}

        const prop_id = pending_data?.property_id || query_interest;
        const o_id = pending_data?.owner_id || query_owner;

        // Auto express interest if user clicked "Show Interest" before login
        if (prop_id && o_id) {
          try {
            await show_interest(prop_id, o_id);
            sessionStorage.setItem('just_expressed_' + prop_id, 'true');
          } catch (err) {
            console.error('Error auto-expressing interest:', err);
          }
          sessionStorage.removeItem('pending_interest');
          target_url = pending_data?.return_url || query_redirect || '/properties';
        } else if (query_redirect) {
          target_url = query_redirect;
        } else {
          target_url = '/';
        }
      }

      router.push(target_url);
      router.refresh();
    }
  };

  return (
    <form className="login_form_card" onSubmit={handle_submit}>
      <button
        type="button"
        onClick={handle_back}
        className="auth_form_close_btn"
        aria-label="Back"
        title="Go back"
      >
        <X size={18} strokeWidth={2.5} />
      </button>

      <h2 className="login_form_title">Welcome Back</h2>
      <p className="login_form_subtitle">Log in to Property Tap to manage listings and interests</p>

      {error_msg && <div className="login_form_error">{error_msg}</div>}

      <div className="login_form_fields">
        <Input
          label="Email Address"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => set_email(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => set_password(e.target.value)}
          required
        />
        <div style={{ textAlign: 'right', marginTop: '-0.25rem' }}>
          <Link href="/forgot_password" className="login_form_link" style={{ fontSize: '0.8rem' }}>
            Forgot password?
          </Link>
        </div>
      </div>

      <Button variant="primary" full_width={true} disabled={loading} type="submit">
        {loading ? 'Logging in...' : 'Log In'}
      </Button>

      <div className="login_form_footer">
        Don&apos;t have an account?{' '}
        <Link
          href={typeof window !== 'undefined' && window.location.search ? `/signup${window.location.search}` : '/signup'}
          className="login_form_link"
        >
          Sign up
        </Link>
      </div>
    </form>
  );
}
