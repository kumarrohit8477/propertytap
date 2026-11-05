import React from 'react';
import type { Metadata, Viewport } from 'next';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import SafetyBanner from '@/components/layout/safety_banner';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1a56db',
};

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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-48x48.png', type: 'image/png', sizes: '48x48' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
      { url: '/assets/logo.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    siteName: 'PropertyTap',
    type: 'website',
    locale: 'en_IN',
    images: [
      {
        url: 'https://propertytap.in/assets/logo.png',
        width: 675,
        height: 588,
        alt: 'PropertyTap — Find Properties Near You | 0% Brokerage',
      },
    ],
  },
};

// Organization schema — tells Google about the PropertyTap brand
const organization_schema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'PropertyTap',
  url: 'https://propertytap.in',
  logo: 'https://propertytap.in/assets/logo.png',
  description:
    'India\'s 0% brokerage property platform. Buy, sell or rent verified houses, flats, plots and commercial spaces — connect directly with owners.',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    url: 'https://propertytap.in/contact',
    availableLanguage: ['English', 'Hindi'],
  },
};

// WebSite schema with SearchAction — enables Google Sitelinks Search Box
const website_schema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'PropertyTap',
  url: 'https://propertytap.in',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://propertytap.in/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
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
        {/* Global structured data — rendered once on every page */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization_schema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(website_schema) }}
        />
        <Navbar />
        <SafetyBanner />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
