'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { sign_up_user } from '@/lib/auth/auth_service';
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

  const handle_submit = async (e: React.FormEvent) => {
    e.preventDefault();
    set_loading(true);
    set_error_msg(null);

    const { error } = await sign_up_user({
      email,
      password,
      full_name,
      phone,
    });

    if (error) {
      set_error_msg(error.message || 'Failed to create account.');
      set_loading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <form className="signup_form_card" onSubmit={handle_submit}>
      <h2 className="signup_form_title">Join Property Tap</h2>
      <p className="signup_form_subtitle">Create a free account to list &amp; discover properties with 0% brokerage</p>

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
          placeholder="e.g. +91 9876543210"
          value={phone}
          onChange={(e) => set_phone(e.target.value)}
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
        {loading ? 'Creating Account...' : 'Create Free Account'}
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
