import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import SafetyBanner from '@/components/layout/safety_banner';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://propertytap.in'),
  title: {
    default: 'PropertyTap | Find Properties Near You — 0% Brokerage',
    template: '%s | PropertyTap',
  },
  description:
    'Browse verified houses, flats, plots & commercial spaces across India. Connect directly with owners — zero brokerage on PropertyTap.',
  keywords: ['properties near me', 'property for rent', 'property for sale', 'no brokerage', '0 brokerage', 'rent flat India', 'buy house India'],
  alternates: {
    canonical: 'https://propertytap.in',
  },
  openGraph: {
    siteName: 'PropertyTap',
    type: 'website',
    locale: 'en_IN',
  },
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
