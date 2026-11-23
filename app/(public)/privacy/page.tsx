'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Clock,
  Sparkles,
  CheckCircle2,
  Mail,
  Phone,
  Server,
  UserCheck,
  FileText,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import './privacy.css';

const SECTIONS = [
  { id: 'collection', label: '1. Information We Collect' },
  { id: 'usage', label: '2. How We Use Information' },
  { id: 'interest_model', label: '3. Show Interest & Contact Visibility' },
  { id: 'security', label: '4. Data Protection & Security' },
  { id: 'third_parties', label: '5. Third-Party Integrations' },
  { id: 'rights', label: '6. Your Privacy Rights & Deletion' },
  { id: 'officer', label: '7. Grievance Redressal Officer' },
];

export default function PrivacyPage() {
  return (
    <div className="privacy_page_wrapper">
      {/* ── Top Hero Section ── */}
      <section className="privacy_hero_section">
               <h1 className="privacy_hero_title">
          PropertyTap <span className="privacy_hero_gradient">Privacy Policy</span>
        </h1>
        <p className="privacy_hero_subtitle">
          Your privacy is at the heart of our platform. We protect your personal data, prevent spam,
          and ensure you control how and when your contact details are shared.
        </p>

        <div className="privacy_date_badge">
          <Clock size={13} />
          <span>Last Updated: November 2026 • Version 1.2</span>
        </div>

        {/* Quick Highlights Row */}
        <div className="privacy_highlights_row">
          <div className="privacy_highlight_card">
            <div className="privacy_hl_icon hl_blue">
              <EyeOff size={20} />
            </div>
            <div>
              <h3 className="privacy_hl_title">Hidden Public Contact</h3>
              <p className="privacy_hl_desc">Your phone &amp; email are never scraped by web bots.</p>
            </div>
          </div>

          <div className="privacy_highlight_card">
            <div className="privacy_hl_icon hl_green">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="privacy_hl_title">Zero Data Selling</h3>
              <p className="privacy_hl_desc">We never sell your phone number to third-party brokers.</p>
            </div>
          </div>

          <div className="privacy_highlight_card">
            <div className="privacy_hl_icon hl_amber">
              <Lock size={20} />
            </div>
            <div>
              <h3 className="privacy_hl_title">Enterprise Encryption</h3>
              <p className="privacy_hl_desc">Secured via Supabase with Row Level Security (RLS).</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Policy Content & Table of Contents ── */}
      <section className="privacy_main_section">
        {/* Sticky Sidebar */}
        <aside className="privacy_nav_sidebar">
          <span className="privacy_nav_heading">Table of Contents</span>
          {SECTIONS.map((sec) => (
            <a key={sec.id} href={`#${sec.id}`} className="privacy_nav_link">
              {sec.label}
            </a>
          ))}
        </aside>

        {/* Policy Body */}
        <div className="privacy_content_column">
          {/* Section 1 */}
          <article id="collection" className="privacy_section_card">
            <div className="privacy_sec_header">
              <span className="privacy_sec_number">01</span>
              <h2 className="privacy_sec_title">Information We Collect</h2>
            </div>
            <p className="privacy_paragraph">
              PropertyTap collects information to deliver a seamless zero-brokerage real estate discovery
              experience. We collect the following categories of data:
            </p>
            <ul className="privacy_list">
              <li>
                <strong>Account Information:</strong> When you register on PropertyTap, we collect your full
                name, verified email address, mobile number, and encrypted password authentication tokens.
              </li>
              <li>
                <strong>Property Listing Data:</strong> When posting a property, we collect listing details
                including category, purpose (rent/sale), monthly rent or asking price, city, locality,
                address, property specifications (bedrooms, bathrooms, furnishing), and uploaded photos.
              </li>
              <li>
                <strong>Interaction &amp; Connection Data:</strong> When you click &ldquo;Show Interest&rdquo; or
                message a lister, we record the interest timestamp, property ID, and involved account IDs to
                facilitate the direct contact exchange.
              </li>
              <li>
                <strong>Technical &amp; Log Data:</strong> Standard IP address, browser type, device information,
                and session telemetry to detect fraud and ensure platform uptime.
              </li>
            </ul>
          </article>

          {/* Section 2 */}
          <article id="usage" className="privacy_section_card">
            <div className="privacy_sec_header">
              <span className="privacy_sec_number">02</span>
              <h2 className="privacy_sec_title">How We Use Your Information</h2>
            </div>
            <p className="privacy_paragraph">
              We process your personal information strictly for legitimate platform purposes:
            </p>
            <ul className="privacy_list">
              <li>To connect genuine property seekers directly with verified owners and landlords.</li>
              <li>To notify owners when a seeker expresses active interest in their property.</li>
              <li>To enforce our Zero Brokerage policy and prevent illegal broker fee scams.</li>
              <li>To detect, moderate, and remove duplicate, spam, or fraudulent listings.</li>
              <li>To provide customer support via live WhatsApp, phone helpline, and email.</li>
            </ul>
          </article>

          {/* Section 3 (Core differentiator) */}
          <article id="interest_model" className="privacy_section_card">
            <div className="privacy_sec_header">
              <span className="privacy_sec_number">03</span>
              <h2 className="privacy_sec_title">Show Interest &amp; Contact Visibility Model</h2>
            </div>
            <p className="privacy_paragraph">
              Traditional real estate classified sites publish your personal phone number on open web pages,
              leading to endless spam calls from pushy agents, telemarketers, and brokers.
            </p>

            <div className="privacy_alert_box">
              <CheckCircle2 size={20} className="privacy_alert_icon" />
              <p className="privacy_alert_text">
                <strong>The PropertyTap Anti-Spam Guarantee:</strong> Your contact details (phone number &amp;
                email) remain strictly shielded from public crawlers. Contact info is shared{' '}
                <em>only</em> when a registered user explicitly clicks &ldquo;Show Interest&rdquo; or requests
                direct contact on a verified listing.
              </p>
            </div>

            <p className="privacy_paragraph">
              Both parties receive direct in-app notifications and connection updates, giving both listers and
              seekers full visibility over who has accessed their contact information.
            </p>
          </article>

          {/* Section 4 */}
          <article id="security" className="privacy_section_card">
            <div className="privacy_sec_header">
              <span className="privacy_sec_number">04</span>
              <h2 className="privacy_sec_title">Data Protection &amp; Row Level Security</h2>
            </div>
            <p className="privacy_paragraph">
              We implement industry-standard technical and organizational security measures to protect your
              information:
            </p>
            <ul className="privacy_list">
              <li>
                <strong>Row Level Security (RLS):</strong> Our database is governed by strict PostgreSQL Row Level
                Security policies. Users can only access and update listings, profile data, and notifications
                that they own or are authorized to view.
              </li>
              <li>
                <strong>End-to-End Encryption in Transit:</strong> All data transmitted between your browser and
                PropertyTap is secured using modern TLS 1.3 cryptographic protocols.
              </li>
              <li>
                <strong>Password Protection:</strong> Passwords are never stored in plain text and are
                cryptographically salted and hashed.
              </li>
            </ul>
          </article>

          {/* Section 5 */}
          <article id="third_parties" className="privacy_section_card">
            <div className="privacy_sec_header">
              <span className="privacy_sec_number">05</span>
              <h2 className="privacy_sec_title">Third-Party Services</h2>
            </div>
            <p className="privacy_paragraph">
              PropertyTap relies on trusted infrastructure partners to deliver platform functionality:
            </p>
            <ul className="privacy_list">
              <li>
                <strong>Supabase:</strong> For cloud database hosting, user authentication, and secure image storage.
              </li>
              <li>
                <strong>Razorpay:</strong> For secure, PCI-DSS compliant processing of optional featured listing
                plans. We never store credit/debit card numbers or net-banking credentials on our servers.
              </li>
            </ul>
            <p className="privacy_paragraph">
              We do <strong>not</strong> partner with advertising networks or third-party data brokers to track
              you across other websites.
            </p>
          </article>

          {/* Section 6 */}
          <article id="rights" className="privacy_section_card">
            <div className="privacy_sec_header">
              <span className="privacy_sec_number">06</span>
              <h2 className="privacy_sec_title">Your Privacy Rights &amp; Data Deletion</h2>
            </div>
            <p className="privacy_paragraph">
              You maintain complete ownership of your personal data on PropertyTap:
            </p>
            <ul className="privacy_list">
              <li>
                <strong>Right to Access &amp; Edit:</strong> You can review and update your profile information,
                phone number, and listing details at any time through your dashboard.
              </li>
              <li>
                <strong>Right to Deactivate Listings:</strong> If your property is rented or sold, you can mark it as
                inactive or delete it with a single click.
              </li>
              <li>
                <strong>Right to Account Deletion:</strong> You can request full erasure of your account, listings,
                and associated records by writing to our privacy desk.
              </li>
            </ul>
          </article>

          {/* Section 7 */}
          <article id="officer" className="privacy_section_card">
            <div className="privacy_sec_header">
              <span className="privacy_sec_number">07</span>
              <h2 className="privacy_sec_title">Grievance Redressal &amp; Contact Officer</h2>
            </div>
            <p className="privacy_paragraph">
              In accordance with the Information Technology Act, 2000 and the Digital Personal Data Protection
              Act (DPDP), if you have any questions, concerns, or grievances regarding our privacy practices,
              please reach out to our Grievance Officer:
            </p>

            <div className="privacy_officer_card">
              <div className="privacy_officer_row">
                <strong>Platform:</strong> PropertyTap Real Estate Platform
              </div>
              <div className="privacy_officer_row">
                <Mail size={15} />
                <span>Email:</span>
                <a href="mailto:info@propertytap.in">info@propertytap.in</a>
              </div>
              <div className="privacy_officer_row">
                <Phone size={15} />
                <span>Helpline / WhatsApp:</span>
                <a href="tel:+919258073878">+91 9258073878</a>
              </div>
              <div className="privacy_officer_row">
                <Clock size={15} />
                <span>Response Window: 24 to 48 business hours</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ── Bottom Banner ── */}
      <section className="privacy_bottom_banner">
        <div className="privacy_banner_card">
          <h2 className="privacy_banner_title">Have Privacy Questions or Need Help?</h2>
          <p className="privacy_banner_desc">
            Our support and compliance team is here to assist you with any questions regarding your data or listings.
          </p>
          <div className="privacy_banner_buttons">
            <Link href="/contact" className="privacy_btn_primary">
              <Mail size={16} />
              <span>Contact Privacy Desk</span>
            </Link>
            <Link href="/support" className="privacy_btn_secondary">
              <HelpCircle size={16} />
              <span>Help Center &amp; FAQs</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
