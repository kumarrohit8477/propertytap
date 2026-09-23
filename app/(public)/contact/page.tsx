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
      <p style={{ color: '#4b5563', marginBottom: '20px' }}>
        Have a question, inquiry, or partnership opportunity? Get in touch with us directly.
      </p>

      {/* Direct Contact Cards */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <div style={{ padding: '16px 20px', borderRadius: '10px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', flex: '1', minWidth: '240px' }}>
          <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Support</div>
          <a href="mailto:info@propertytap.in" style={{ fontSize: '16px', fontWeight: 700, color: '#16a34a', textDecoration: 'none', display: 'inline-block', marginTop: '4px' }}>
            info@propertytap.in
          </a>
        </div>
        <div style={{ padding: '16px 20px', borderRadius: '10px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', flex: '1', minWidth: '240px' }}>
          <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone / WhatsApp</div>
          <a href="tel:+919258073878" style={{ fontSize: '16px', fontWeight: 700, color: '#16a34a', textDecoration: 'none', display: 'inline-block', marginTop: '4px' }}>
            +91 9258073878
          </a>
        </div>
      </div>

      {submitted ? (
        <div style={{ padding: '2rem', backgroundColor: '#ecfdf5', borderRadius: '12px', color: '#047857', textAlign: 'center' }}>
          ✅ Thank you for contacting Property Tap! Our team will get back to you shortly.
        </div>
      ) : (
        <form className="contact_form_card" onSubmit={handle_submit}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#111827' }}>Send Us a Message</h2>
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
