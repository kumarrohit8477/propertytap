import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/button';
import './not_found.css';

export default function NotFound() {
  return (
    <div className="not_found_container">
      <h1 className="not_found_title">404</h1>
      <p className="not_found_subtitle">Oops! The property or page you are looking for could not be found.</p>
      <Link href="/">
        <Button variant="primary">Return Home</Button>
      </Link>
    </div>
  );
}
