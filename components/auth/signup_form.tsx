'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { sign_up_user } from '@/lib/auth/auth_service';
import { show_interest } from '@/lib/properties/property_service';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import './signup_form.css';

export default function SignupForm() {
  const router = useRouter();
  const [full_name, set_full_name] = useState('');
  const [email, set_email] = useState('');
  const [phone, set_phone] = useState('');
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

    const clean_phone = phone.replace(/\D/g, '');
    if (clean_phone.length !== 10) {
      set_error_msg('Please enter a valid 10-digit mobile number.');
      set_loading(false);
      return;
    }

    const { error } = await sign_up_user({
      email,
      password,
      full_name,
      phone: clean_phone,
    });

    if (error) {
      set_error_msg(error.message || 'Failed to create account.');
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
    <form className="signup_form_card" onSubmit={handle_submit}>
      <button
        type="button"
        onClick={handle_back}
        className="auth_form_close_btn"
        aria-label="Back"
        title="Go back"
      >
        <X size={18} strokeWidth={2.5} />
      </button>

      <h2 className="signup_form_title">Join PropertyTap</h2>
      <p className="signup_form_subtitle">Create account &amp; discover properties with 0% brokerage</p>

      {error_msg && <div className="signup_form_error">{error_msg}</div>}

      <div className="signup_form_fields">
        <Input
          label="Full Name"
          type="text"
          placeholder="e.g. Rahul Sharma"
          value={full_name}
          onChange={(e) => set_full_name(e.target.value)}
          required
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => set_email(e.target.value)}
          required
        />
        <Input
          label="Phone Number"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          pattern="[0-9]{10}"
          placeholder="10-digit mobile number"
          value={phone}
          onChange={(e) => set_phone(e.target.value.replace(/\D/g, '').slice(0, 10))}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => set_password(e.target.value)}
          required
          minLength={6}
        />
      </div>

      <Button variant="primary" full_width={true} disabled={loading} type="submit">
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>

      <div className="signup_form_footer">
        Already have an account?{' '}
        <Link href="/login" className="signup_form_link">
          Log in
        </Link>
      </div>
    </form>
  );
}
