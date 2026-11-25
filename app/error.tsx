'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/button';
import './not_found.css';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="not_found_container">
      <h1 className="not_found_title">500</h1>
      <p className="not_found_subtitle">Something went wrong. Please try again.</p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        <Button variant="primary" onClick={() => reset()}>Try Again</Button>
        <Link href="/">
          <Button variant="outline">Return Home</Button>
        </Link>
      </div>
    </div>
  );
}
