import React from 'react';
import Link from 'next/link';

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: 'Top Tips for Buying Your First Home in India',
      date: 'September 20, 2026',
      excerpt: 'Navigating home purchases can be overwhelming. Learn how to verify legal documentation, calculate budget, and select the right location.',
    },
    {
      id: 2,
      title: 'Why Zero Brokerage is the Future of Real Estate',
      date: 'September 15, 2026',
      excerpt: 'Direct owner-to-buyer platforms are transforming property discovery by saving buyers and tenants lakhs in commissions.',
    },
    {
      id: 3,
      title: 'How to Prepare Your Property for Renting',
      date: 'September 10, 2026',
      excerpt: 'Attract quality tenants quickly with high-quality photos, transparent pricing, and simple property maintenance steps.',
    },
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 1.5rem', fontFamily: 'inherit' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0d1b34', marginBottom: '12px' }}>PropertyTap Blog</h1>
      <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '40px', lineHeight: 1.6 }}>
        Insights, real-estate guides, and market trends to help you make smarter property decisions.
      </p>

      <div style={{ display: 'grid', gap: '24px' }}>
        {posts.map((post) => (
          <article key={post.id} style={{ padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
            <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: 600 }}>{post.date}</span>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0d1b34', marginTop: '6px', marginBottom: '8px' }}>{post.title}</h2>
            <p style={{ color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>{post.excerpt}</p>
            <Link href={`/blog/${post.id}`} style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>
              Read More &rarr;
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
