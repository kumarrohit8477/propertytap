'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  ShieldAlert,
  Clock,
  Sparkles,
  CheckCircle2,
  Mail,
  Scale,
  Ban,
  UserCheck,
  HelpCircle,
} from 'lucide-react';
import './terms.css';

const SECTIONS = [
  { id: 'acceptance', label: '1. Acceptance of Terms' },
  { id: 'mediator_role', label: '2. Platform Role & Zero Brokerage' },
  { id: 'user_responsibilities', label: '3. User Due Diligence & Safety' },
  { id: 'listing_guidelines', label: '4. Listing Accuracy & Rules' },
  { id: 'prohibited_conduct', label: '5. Prohibited Conduct' },
  { id: 'limitation_liability', label: '6. Limitation of Liability' },
  { id: 'termination', label: '7. Account Termination & Updates' },
];

export default function TermsPage() {
  return (
    <div className="terms_page_wrapper">
      {/* ── Top Hero Section ── */}
      <section className="terms_hero_section">
        <h1 className="terms_hero_title">
          PropertyTap <span className="terms_hero_gradient">Terms of Service</span>
        </h1>
        <p className="terms_hero_subtitle">
          Please read these terms carefully before accessing or using PropertyTap. They define our
          role as a direct discovery platform, user responsibilities, and safety commitments.
        </p>

        <div className="terms_date_badge">
          <Clock size={13} />
          <span>Last Updated: November 2026 • Version 1.2</span>
        </div>

        {/* Quick Highlights Row */}
        <div className="terms_highlights_row">
          <div className="terms_highlight_card">
            <div className="terms_hl_icon hl_blue">
              <Scale size={20} />
            </div>
            <div>
              <h3 className="terms_hl_title">Direct Discovery Platform</h3>
              <p className="terms_hl_desc">We connect seekers and owners directly with ₹0 brokerage.</p>
            </div>
          </div>

          <div className="terms_highlight_card">
            <div className="terms_hl_icon hl_green">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h3 className="terms_hl_title">Zero Commission Forever</h3>
              <p className="terms_hl_desc">PropertyTap is never a party to financial rental or sale agreements.</p>
            </div>
          </div>

          <div className="terms_highlight_card">
            <div className="terms_hl_icon hl_amber">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="terms_hl_title">Independent Verification</h3>
              <p className="terms_hl_desc">Always inspect properties in person before transferring funds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Terms Content & Table of Contents ── */}
      <section className="terms_main_section">
        {/* Sticky Sidebar */}
        <aside className="terms_nav_sidebar">
          <span className="terms_nav_heading">Table of Contents</span>
          {SECTIONS.map((sec) => (
            <a key={sec.id} href={`#${sec.id}`} className="terms_nav_link">
              {sec.label}
            </a>
          ))}
        </aside>

        {/* Terms Body */}
        <div className="terms_content_column">
          {/* Section 1 */}
          <article id="acceptance" className="terms_section_card">
            <div className="terms_sec_header">
              <span className="terms_sec_number">01</span>
              <h2 className="terms_sec_title">Acceptance of Terms</h2>
            </div>
            <p className="terms_paragraph">
              By accessing, browsing, registering an account, or listing properties on PropertyTap (&ldquo;the Platform&rdquo;),
              you agree to be legally bound by these Terms of Service and our Privacy Policy.
            </p>
            <p className="terms_paragraph">
              If you do not agree to these terms, you must discontinue your use of PropertyTap immediately.
            </p>
          </article>

          {/* Section 2 */}
          <article id="mediator_role" className="terms_section_card">
            <div className="terms_sec_header">
              <span className="terms_sec_number">02</span>
              <h2 className="terms_sec_title">Platform Role &amp; Zero Brokerage Model</h2>
            </div>
            <p className="terms_paragraph">
              PropertyTap functions solely as an online information and connection platform designed to
              bring property seekers and verified property listers together.
            </p>

            <div className="terms_alert_box">
              <CheckCircle2 size={20} className="terms_alert_icon" />
              <p className="terms_alert_text">
                <strong>Zero Brokerage Clarification:</strong> PropertyTap does <strong>NOT</strong> charge brokerage,
                commissions, or transaction fees on any lease, rent, purchase, or sale agreement. PropertyTap is not a real
                estate broker, landlord, tenant, or property manager.
              </p>
            </div>

            <p className="terms_paragraph">
              Any contracts, agreements, payments, lease tenures, security deposits, or sale deeds entered into
              are strictly and exclusively between the property seeker and the property lister.
            </p>
          </article>

          {/* Section 3 */}
          <article id="user_responsibilities" className="terms_section_card">
            <div className="terms_sec_header">
              <span className="terms_sec_number">03</span>
              <h2 className="terms_sec_title">User Due Diligence &amp; Safety Guidelines</h2>
            </div>
            <p className="terms_paragraph">
              Users are solely responsible for conducting their own independent physical and legal due diligence
              before entering into agreements or transferring money:
            </p>
            <ul className="terms_list">
              <li>Always visit and inspect the property in person before paying deposits or advance rent.</li>
              <li>Verify the identity of the owner and request official ownership / title documentation.</li>
              <li>Never transfer money via UPI or bank transfer to unknown individuals claiming to hold a property without in-person inspection.</li>
              <li>PropertyTap never asks users to transfer token money on behalf of any owner or lister.</li>
            </ul>
          </article>

          {/* Section 4 */}
          <article id="listing_guidelines" className="terms_section_card">
            <div className="terms_sec_header">
              <span className="terms_sec_number">04</span>
              <h2 className="terms_sec_title">Listing Accuracy &amp; Guidelines</h2>
            </div>
            <p className="terms_paragraph">
              When listing a property on PropertyTap, owners and authorized representatives agree that:
            </p>
            <ul className="terms_list">
              <li>All photos, specifications, pricing, and availability dates posted are truthful and accurate.</li>
              <li>You hold legitimate legal authorization to rent, lease, or sell the listed property.</li>
              <li>You will promptly update or deactivate listings once a property has been rented or sold.</li>
              <li>Listings containing deceptive pricing, copyrighted stock photos, or discriminatory criteria will be removed immediately.</li>
            </ul>
          </article>

          {/* Section 5 */}
          <article id="prohibited_conduct" className="terms_section_card">
            <div className="terms_sec_header">
              <span className="terms_sec_number">05</span>
              <h2 className="terms_sec_title">Prohibited Conduct</h2>
            </div>
            <p className="terms_paragraph">
              The following activities are strictly prohibited on PropertyTap:
            </p>
            <ul className="terms_list">
              <li>Harvesting, scraping, or indexing user phone numbers or emails using automated scripts or bots.</li>
              <li>Posing as a direct property owner when acting as an undisclosed fee-charging middleman.</li>
              <li>Posting duplicate listings across multiple categories to manipulate feed placement.</li>
              <li>Engaging in harassing, abusive, or unlawful communication with other platform members.</li>
            </ul>
          </article>

          {/* Section 6 */}
          <article id="limitation_liability" className="terms_section_card">
            <div className="terms_sec_header">
              <span className="terms_sec_number">06</span>
              <h2 className="terms_sec_title">Limitation of Liability</h2>
            </div>
            <p className="terms_paragraph">
              To the fullest extent permitted by law, PropertyTap and its operators shall not be liable for any
              direct, indirect, incidental, or consequential damages resulting from transactions, disputes, physical
              property defects, rental non-payment, or security deposit disagreements between seekers and listers.
            </p>
          </article>

          {/* Section 7 */}
          <article id="termination" className="terms_section_card">
            <div className="terms_sec_header">
              <span className="terms_sec_number">07</span>
              <h2 className="terms_sec_title">Account Termination &amp; Policy Updates</h2>
            </div>
            <p className="terms_paragraph">
              PropertyTap reserves the right to suspend or permanently terminate accounts that violate these terms,
              attempt fraudulent activities, or harm platform integrity. We may update these terms periodically to
              reflect platform developments or legal requirements.
            </p>
          </article>
        </div>
      </section>

      {/* ── Bottom Banner ── */}
      <section className="terms_bottom_banner">
        <div className="terms_banner_card">
          <h2 className="terms_banner_title">Have Questions About Our Terms?</h2>
          <p className="terms_banner_desc">
            Our legal and customer support team is available to assist you with any questions or clarifications.
          </p>
          <div className="terms_banner_buttons">
            <Link href="/contact" className="terms_btn_primary">
              <Mail size={16} />
              <span>Contact Support</span>
            </Link>
            <Link href="/privacy" className="terms_btn_secondary">
              <FileText size={16} />
              <span>View Privacy Policy</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
