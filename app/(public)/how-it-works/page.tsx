'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  PhoneCall,
  Key,
  PlusCircle,
  Building2,
  UserCheck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Check,
  ChevronDown,
  Zap,
  DollarSign,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';
import './how_it_works.css';

const SEEKER_STEPS = [
  {
    step: 'Step 01',
    icon: <Search size={26} />,
    colorClass: 'icon_blue',
    title: 'Search & Filter Smartly',
    desc: 'Explore thousands of verified apartments, independent houses, PGs, villas, and commercial properties. Filter precisely by city, locality, budget, bedrooms, and amenities.',
    perks: ['Verified real property photos', 'Accurate locality & city tags', 'Custom budget filters'],
  },
  {
    step: 'Step 02',
    icon: <PhoneCall size={26} />,
    colorClass: 'icon_green',
    title: 'Connect Directly with Owners',
    desc: 'Skip middleman markups and pushy brokers. Connect directly with verified owners and listers via direct phone call, WhatsApp chat, or platform notifications.',
    perks: ['100% Zero Brokerage', 'Direct WhatsApp & Phone reach', 'No hidden contact fees'],
  },
  {
    step: 'Step 03',
    icon: <Key size={26} />,
    colorClass: 'icon_amber',
    title: 'Visit, Agree & Move In',
    desc: 'Schedule on-site visits with the owner at your convenience. Inspect the property in person, negotiate terms transparently, and close the deal with complete peace of mind.',
    perks: ['Direct price negotiation', 'Zero paperwork commissions', 'Fast & transparent closure'],
  },
];

const OWNER_STEPS = [
  {
    step: 'Step 01',
    icon: <PlusCircle size={26} />,
    colorClass: 'icon_green',
    title: 'Post Listing in 2 Minutes',
    desc: 'List your property with our fast 6-step guided form. Enter title, location, monthly rent or sale price, upload high-quality photos, and publish for free.',
    perks: ['100% Free launch offer', 'High-res image gallery', 'Instant listing preview'],
  },
  {
    step: 'Step 02',
    icon: <Building2 size={26} />,
    colorClass: 'icon_blue',
    title: 'Instant Pan-India Exposure',
    desc: 'Your property is instantly displayed to thousands of genuine buyers and tenants searching daily across your city, locality, and preferred category.',
    perks: ['City landing page feature', 'Smart feed recommendation', 'Social discovery tags'],
  },
  {
    step: 'Step 03',
    icon: <UserCheck size={26} />,
    colorClass: 'icon_purple',
    title: 'Direct Calls & Zero Broker Cut',
    desc: 'Get genuine inquiries straight to your phone. Don’t lose 15 to 30 days of rental earnings or 2% sale price to traditional broker commissions.',
    perks: ['Keep 100% of your earnings', 'Real-time seeker notifications', 'No broker spam calls'],
  },
];

const COMPARISON_ROWS = [
  {
    feature: 'Brokerage & Commission',
    traditional: '15 to 30 Days Rent (or 1-2% on Sale)',
    propertytap: '₹0 (Zero Brokerage Forever)',
  },
  {
    feature: 'Communication',
    traditional: 'Through third-party brokers & agents',
    propertytap: 'Direct Owner-Seeker Connectivity',
  },
  {
    feature: 'Listing Transparency',
    traditional: 'Often outdated, fake, or recycled ads',
    propertytap: 'Verified photos & active listings',
  },
  {
    feature: 'Contact Information',
    traditional: 'Hidden behind heavy paid paywalls',
    propertytap: 'Direct WhatsApp and Call access',
  },
  {
    feature: 'Listing Cost for Owners',
    traditional: 'Up to ₹2,000 – ₹5,000 per listing',
    propertytap: '100% Free Launch Special',
  },
];

const PILLARS = [
  {
    icon: <DollarSign size={22} />,
    colorClass: 'icon_green',
    title: 'Zero Brokerage',
    desc: 'We never take a cut from your property rent or sale. 100% transparent direct deals.',
  },
  {
    icon: <ShieldCheck size={22} />,
    colorClass: 'icon_blue',
    title: 'Verified Listings',
    desc: 'Automated moderation and quality checks keep listings genuine and spam-free.',
  },
  {
    icon: <Zap size={22} />,
    colorClass: 'icon_amber',
    title: 'Direct WhatsApp & Call',
    desc: 'Connect in seconds via instant WhatsApp chat or direct call without waiting.',
  },
  {
    icon: <HeartHandshake size={22} />,
    colorClass: 'icon_purple',
    title: 'Direct Negotiations',
    desc: 'Negotiate rent, deposit, and terms directly with the other party with no third-party pressure.',
  },
];

const FAQ_ITEMS = [
  {
    question: 'Is PropertyTap really 100% free with Zero Brokerage?',
    answer:
      'Yes, completely! PropertyTap does not charge any brokerage, service commissions, or hidden transaction fees to seekers or owners. Our platform operates on a transparent Zero Brokerage model.',
  },
  {
    question: 'How do I contact a property owner or lister?',
    answer:
      'When browsing any listing, simply click the "Show Interest", "WhatsApp", or "Call Now" buttons to connect directly with the owner without middleman intervention.',
  },
  {
    question: 'How long does it take for an owner listing to go live?',
    answer:
      'Listings are created in less than 2 minutes and go live instantly upon completing the 6-step form and photo upload.',
  },
  {
    question: 'What types of properties can be listed and found on PropertyTap?',
    answer:
      'PropertyTap covers all property types: Residential Apartments, Independent Houses / Villas, PG & Hostels, Commercial Offices / Shops, and Plots / Land.',
  },
];

export default function HowItWorksPage() {
  const [tab, set_tab] = useState<'seekers' | 'owners'>('seekers');
  const [active_faq, set_active_faq] = useState<number | null>(0);

  const toggle_faq = (index: number) => {
    set_active_faq((prev) => (prev === index ? null : index));
  };

  const current_steps = tab === 'seekers' ? SEEKER_STEPS : OWNER_STEPS;

  return (
    <div className="hiw_page_wrapper">
      {/* ── Hero Section ── */}
      <section className="hiw_hero_section">
        <h1 className="hiw_hero_title">
          How <span className="hiw_hero_gradient">PropertyTap</span> Works
        </h1>
        <p className="hiw_hero_subtitle">
          Finding or listing real estate in India has never been this seamless.
          Skip broker commissions, connect directly, and seal the deal on your own terms.
        </p>

        {/* Tab Switcher */}
        <div className="hiw_tab_switcher">
          <button
            type="button"
            className={`hiw_tab_btn ${tab === 'seekers' ? 'active' : ''}`}
            onClick={() => set_tab('seekers')}
          >
            <Search size={16} />
            <span>I Want to Find a Property</span>
          </button>
          <button
            type="button"
            className={`hiw_tab_btn ${tab === 'owners' ? 'active' : ''}`}
            onClick={() => set_tab('owners')}
          >
            <PlusCircle size={16} />
            <span>I Want to List a Property</span>
          </button>
        </div>
      </section>

      {/* ── 3-Step Walkthrough ── */}
      <section className="hiw_steps_section">
        <div className="hiw_steps_grid">
          {current_steps.map((s) => (
            <div key={s.step} className="hiw_step_card">
              <div className="hiw_step_top">
                <div className={`hiw_step_icon_wrap ${s.colorClass}`}>{s.icon}</div>
                <span className="hiw_step_badge">{s.step}</span>
              </div>
              <h3 className="hiw_step_title">{s.title}</h3>
              <p className="hiw_step_desc">{s.desc}</p>
              <ul className="hiw_step_perks">
                {s.perks.map((p, idx) => (
                  <li key={idx} className="hiw_step_perk_item">
                    <Check size={14} className="hiw_perk_check" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Comparison Section: Traditional Broker vs PropertyTap ── */}
      <section className="hiw_comparison_section">
        <div className="hiw_section_header">
          <h2 className="hiw_section_title">Traditional Brokers vs. PropertyTap</h2>
          <p className="hiw_section_subtitle">
            See how much time, money, and hassle you save when middleman commissions are eliminated.
          </p>
        </div>

        <div className="hiw_comparison_card">
          <table className="hiw_comparison_table">
            <thead>
              <tr>
                <th className="hiw_th_feature">Feature</th>
                <th className="hiw_th_traditional">Traditional Brokers</th>
                <th className="hiw_th_propertytap">PropertyTap Platform</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, i) => (
                <tr key={i}>
                  <td className="hiw_td_feature">{row.feature}</td>
                  <td className="hiw_td_traditional">❌ {row.traditional}</td>
                  <td className="hiw_td_propertytap">✅ {row.propertytap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Platform Pillars Grid ── */}
      <section className="hiw_pillars_section">
        <div className="hiw_section_header">
          <h2 className="hiw_section_title">Built for Direct &amp; Fair Real Estate</h2>
          <p className="hiw_section_subtitle">
            Everything you need for seamless property discovery and leasing.
          </p>
        </div>

        <div className="hiw_pillars_grid">
          {PILLARS.map((p, idx) => (
            <div key={idx} className="hiw_pillar_card">
              <div className={`hiw_pillar_icon ${p.colorClass}`}>{p.icon}</div>
              <h3 className="hiw_pillar_title">{p.title}</h3>
              <p className="hiw_pillar_desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final Call to Action ── */}
      <section className="hiw_cta_section">
        <div className="hiw_cta_card">
          <h2 className="hiw_cta_title">Ready to Experience Zero Brokerage?</h2>
          <p className="hiw_cta_desc">
            Whether you want to discover your next home or list your property for genuine seekers,
            get started with PropertyTap in under two minutes.
          </p>
          <div className="hiw_cta_buttons">
            <Link href="/properties" className="hiw_btn_primary">
              <Search size={17} />
              <span>Explore Properties</span>
            </Link>
            <Link href="/dashboard/properties/new" className="hiw_btn_success">
              <PlusCircle size={17} />
              <span>Post Property for Free</span>
            </Link>
          </div>
          <div className="hiw_cta_trust_notes">
            <span>✓ No credit card needed</span>
            <span>✓ ₹0 Brokerage Guaranteed</span>
            <span>✓ Verified Listings</span>
          </div>
        </div>
      </section>
    </div>
  );
}
