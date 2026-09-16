import React from 'react';
import SignupForm from '@/components/auth/signup_form';
import './signup.css';

export default function SignupPage() {
  return (
    <div className="signup_page_container">
      <SignupForm />
    </div>
  );
}
