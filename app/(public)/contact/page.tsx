'use client';

import React, { useState } from 'react';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import './contact.css';

export default function ContactPage() {
  const [submitted, set_submitted] = useState(false);

  const handle_submit = (e: React.FormEvent) => {
    e.preventDefault();
    set_submitted(true);
  };

  return (
    <div className="contact_page_container">
      <h1 className="contact_page_title">Contact Property Tap</h1>
      <p style={{ color: '#4b5563' }}>Have a question, inquiry, or partnership opportunity? Get in touch with us.</p>

      {submitted ? (
        <div style={{ padding: '2rem', backgroundColor: '#ecfdf5', borderRadius: '12px', color: '#047857', textAlign: 'center' }}>
          ✅ Thank you for contacting Property Tap! Our team will get back to you shortly.
        </div>
      ) : (
        <form className="contact_form_card" onSubmit={handle_submit}>
          <Input label="Your Name" placeholder="e.g. Aman Sharma" required />
          <Input label="Your Email" type="email" placeholder="your@email.com" required />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Message</label>
            <textarea
              style={{
                padding: '0.625rem 0.875rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                minHeight: '120px',
                fontFamily: 'inherit',
              }}
              placeholder="How can we help you?"
              required
            />
          </div>
          <Button variant="primary" type="submit" full_width={true}>
            Send Message
          </Button>
        </form>
      )}
    </div>
  );
}
