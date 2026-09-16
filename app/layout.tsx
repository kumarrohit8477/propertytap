import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import SafetyBanner from '@/components/layout/safety_banner';
import './globals.css';

export const metadata: Metadata = {
  title: 'Property Tap | Real Estate Social Media & Discovery Platform',
  description: 'Connect directly with property owners and listers with 0% brokerage. Discover houses, apartments, plots, and commercial spaces.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <SafetyBanner />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
