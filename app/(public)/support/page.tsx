import React from 'react';
import Link from 'next/link';

export default function SupportPage() {
  const faqs = [
    {
      q: 'Is Property Tap completely free for owners?',
      a: 'Yes, property owners can list their residential or commercial properties completely free of cost.',
    },
    {
      q: 'How do I contact a property owner?',
      a: 'Simply browse the property listing and click on "Show Contact" or express interest to connect directly.',
    },
    {
      q: 'How are listings verified on Property Tap?',
      a: 'We perform automated checks and manual verification of listing details to ensure authentic properties and listers.',
    },
    {
      q: 'How can I get support if I face any issue?',
      a: 'You can reach out to our customer support team directly at info@propertytap.in or call us at +91 9258073878.',
    },
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 1.5rem', fontFamily: 'inherit' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0d1b34', marginBottom: '12px' }}>Support & Help Center</h1>
      <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '40px', lineHeight: 1.6 }}>
        Need help or have questions? We are here to assist you 24/7.
      </p>

      <div style={{ padding: '24px', borderRadius: '12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#15803d', marginBottom: '8px' }}>Direct Support Contact</h2>
        <p style={{ color: '#166534', margin: '4px 0' }}>📧 Email: <strong>info@propertytap.in</strong></p>
        <p style={{ color: '#166534', margin: '4px 0' }}>📞 Phone: <strong>+91 9258073878</strong></p>
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0d1b34', marginBottom: '20px' }}>Frequently Asked Questions</h2>
      <div style={{ display: 'grid', gap: '16px', marginBottom: '40px' }}>
        {faqs.map((item, index) => (
          <div key={index} style={{ padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0d1b34', marginBottom: '8px' }}>{item.q}</h3>
            <p style={{ color: '#475569', lineHeight: 1.5, margin: 0 }}>{item.a}</p>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#64748b' }}>Still have questions?</p>
        <Link href="/contact" style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>
          Go to Contact Page &rarr;
        </Link>
      </div>
    </div>
  );
}
