'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { sign_in_user } from '@/lib/auth/auth_service';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import './login_form.css';

export default function LoginForm() {
  const router = useRouter();
  const [email, set_email] = useState('');
  const [password, set_password] = useState('');
  const [loading, set_loading] = useState(false);
  const [error_msg, set_error_msg] = useState<string | null>(null);

  const handle_submit = async (e: React.FormEvent) => {
    e.preventDefault();
    set_loading(true);
    set_error_msg(null);

    const { error } = await sign_in_user({ email, password });

    if (error) {
      set_error_msg(error.message || 'Invalid email or password.');
      set_loading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <form className="login_form_card" onSubmit={handle_submit}>
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
        <Link href="/signup" className="login_form_link">
          Sign up free
        </Link>
      </div>
    </form>
  );
}
