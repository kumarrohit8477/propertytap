import React from 'react';
import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 1.5rem', fontFamily: 'inherit' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0d1b34', marginBottom: '12px' }}>How Property Tap Works</h1>
      <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '40px', lineHeight: 1.6 }}>
        Property Tap makes finding and listing real estate fast, direct, and completely transparent with zero brokerage.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        <div style={{ padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#16a34a', marginBottom: '12px' }}>1. Search & Discover</div>
          <p style={{ color: '#475569', lineHeight: 1.5 }}>
            Browse verified property listings across top cities with filters for purpose (buy, rent, lease), price, location, and property type.
          </p>
        </div>

        <div style={{ padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#16a34a', marginBottom: '12px' }}>2. Connect Directly</div>
          <p style={{ color: '#475569', lineHeight: 1.5 }}>
            Contact property owners and listers directly without middleman interference or hidden brokerage fees.
          </p>
        </div>

        <div style={{ padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#16a34a', marginBottom: '12px' }}>3. List for Free</div>
          <p style={{ color: '#475569', lineHeight: 1.5 }}>
            Owners can post property listings in under two minutes with photos, description, and price — 100% free.
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link href="/dashboard/properties/new" style={{ display: 'inline-block', backgroundColor: '#16a34a', color: '#fff', padding: '12px 28px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
          Post Property Now
        </Link>
      </div>
    </div>
  );
}
