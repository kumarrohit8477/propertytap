'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Target,
  Eye,
  ShieldCheck,
  HeartHandshake,
  Building2,
  Users,
  CheckCircle2,
  Lock,
  ArrowRight,
  PlusCircle,
  Search,
  Zap,
} from 'lucide-react';
import './about.css';

const STATS = [
  { number: '₹0', label: 'Brokerage Charged' },
  { number: '100%', label: 'Direct Connectivity' },
  { number: '50+', label: 'Cities Across India' },
  { number: '2 Min', label: 'Average Listing Time' },
];

const VALUES = [
  {
    icon: <ShieldCheck size={24} />,
    colorClass: 'icon_green',
    title: 'Zero Brokerage Philosophy',
    desc: 'We firmly believe middleman commissions have no place in modern real estate discovery. Both seekers and owners deserve 100% fair transactions.',
  },
  {
    icon: <Users size={24} />,
    colorClass: 'icon_blue',
    title: 'Direct Human Connection',
    desc: 'We bridge property seekers and genuine owners without call-center barriers, paywalls, or pushy sales brokers getting in the middle.',
  },
  {
    icon: <Lock size={24} />,
    colorClass: 'icon_amber',
    title: 'Honesty & Transparency',
    desc: 'Verified photos, real locality pricing, and honest property amenities. What you see on PropertyTap is authentic and verified.',
  },
  {
    icon: <Zap size={24} />,
    colorClass: 'icon_purple',
    title: 'Fast & Tech-Enabled',
    desc: 'Cutting-edge search, dynamic filters, and instant WhatsApp / phone channels allow you to find or lease properties in record time.',
  },
];

const PRINCIPLES = [
  {
    title: 'Zero Commission Guarantee',
    desc: 'PropertyTap is an independent discovery platform. We are never party to transactions and never deduct brokerage fees from rents or sale agreements.',
  },
  {
    title: 'Privacy & Data Protection',
    desc: 'We respect your confidentiality. Your phone numbers and personal contact information are never sold to external marketing agencies or cold callers.',
  },
  {
    title: 'Quality & Community Moderation',
    desc: 'Our team monitors listings for accuracy and actively responds to community reports to keep the marketplace safe, authentic, and high quality.',
  },
];

export default function AboutPage() {
  return (
    <div className="about_page_wrapper">
      {/* ── Hero Section ── */}
      <section className="about_hero_section">
        <h1 className="about_hero_title">
          Revolutionizing Real Estate with{' '}
          <span className="about_hero_gradient">Zero Brokerage</span>
        </h1>
        <p className="about_hero_subtitle">
          PropertyTap is India&apos;s modern real estate discovery platform created to eliminate
          middleman commissions, empower property seekers, and connect verified owners directly.
        </p>

        {/* Stats Row */}
        <div className="about_stats_row">
          {STATS.map((s, idx) => (
            <div key={idx} className="about_stat_item">
              <span className="about_stat_number">{s.number}</span>
              <span className="about_stat_label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission & Vision Dual Cards ── */}
      <section className="about_vision_section">
        <div className="about_vision_grid">
          {/* Mission Card */}
          <div className="about_vision_card about_card_accent_blue">
            <div className="about_vision_icon_wrap icon_blue">
              <Target size={26} />
            </div>
            <h2 className="about_vision_title">Our Mission</h2>
            <p className="about_vision_desc">
              To democratize real estate discovery across India by connecting property seekers, tenants,
              and genuine owners directly. We exist to remove unnecessary middleman fees, restore
              fairness to renting and buying, and make property exploration fast, transparent, and enjoyable.
            </p>
          </div>

          {/* Vision Card */}
          <div className="about_vision_card about_card_accent_green">
            <div className="about_vision_icon_wrap icon_green">
              <Eye size={26} />
            </div>
            <h2 className="about_vision_title">Our Vision</h2>
            <p className="about_vision_desc">
              To become India&apos;s most trusted, community-centric real estate network—where finding a home,
              a student PG, an office space, or a land plot is as simple and effortless as a single tap,
              with zero hidden fees and direct human relationships at its core.
            </p>
          </div>
        </div>
      </section>

      {/* ── Core Values Section ── */}
      <section className="about_values_section">
        <div className="about_section_header">
          <h2 className="about_section_title">Our Core Platform Values</h2>
          <p className="about_section_subtitle">
            These guiding principles drive every feature, policy, and interaction on PropertyTap.
          </p>
        </div>

        <div className="about_values_grid">
          {VALUES.map((v, idx) => (
            <div key={idx} className="about_value_card">
              <div className={`about_vision_icon_wrap ${v.colorClass}`}>{v.icon}</div>
              <h3 className="about_value_title">{v.title}</h3>
              <p className="about_value_desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Story / Why PropertyTap Was Built ── */}
      <section className="about_story_section">
        <div className="about_story_card">
          <div className="about_story_content">
            <h2 className="about_story_title">Why We Built PropertyTap</h2>
            <p className="about_story_paragraph">
              For decades, finding a rental home or buying a property in Indian cities meant paying
              hefty broker fees—often 15 to 30 days of rental income or 1% to 2% of the entire property price—just
              to exchange a phone number.
            </p>
            <p className="about_story_paragraph">
              Meanwhile, property owners lost rental revenue and struggled with unresponsive middlemen.
              We asked a simple question: <strong>Why should discovering a home come with a broker tax?</strong>
            </p>
            <ul className="about_story_points">
              <li className="about_story_point_item">
                <CheckCircle2 size={16} className="about_point_check" />
                <span>100% Free listing for owners and landlords</span>
              </li>
              <li className="about_story_point_item">
                <CheckCircle2 size={16} className="about_point_check" />
                <span>Instant direct WhatsApp &amp; phone connectivity</span>
              </li>
              <li className="about_story_point_item">
                <CheckCircle2 size={16} className="about_point_check" />
                <span>Zero brokerage on residential, PG, and commercial properties</span>
              </li>
            </ul>
          </div>

          <div className="about_story_illustration">
            <div className="about_illus_header">
              <div className="about_illus_icon">
                <Building2 size={20} />
              </div>
              <div>
                <div className="about_illus_title">PropertyTap Platform</div>
                <div className="about_illus_sub">Verified Direct Network</div>
              </div>
            </div>
            <div className="about_illus_item">
              <span>Middleman Brokerage</span>
              <span className="about_illus_badge">₹0 Free</span>
            </div>
            <div className="about_illus_item">
              <span>Owner Contact Access</span>
              <span className="about_illus_badge">Direct &amp; Instant</span>
            </div>
            <div className="about_illus_item">
              <span>Listing Duration</span>
              <span className="about_illus_badge">30 Days Active</span>
            </div>
            <div className="about_illus_item">
              <span>Hidden Processing Fees</span>
              <span className="about_illus_badge">None</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Operating Principles & Safety ── */}
      <section className="about_trust_section">
        <div className="about_section_header">
          <h2 className="about_section_title">Our Operating Commitments</h2>
          <p className="about_section_subtitle">
            How we protect our users and maintain an honest real estate ecosystem.
          </p>
        </div>

        <div className="about_trust_grid">
          {PRINCIPLES.map((p, idx) => (
            <div key={idx} className="about_trust_card">
              <h3 className="about_trust_title">{p.title}</h3>
              <p className="about_trust_desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final Call to Action ── */}
      <section className="about_cta_section">
        <div className="about_cta_card">
          <h2 className="about_cta_title">Join the Zero Brokerage Movement</h2>
          <p className="about_cta_desc">
            Whether you are looking for your dream flat, an affordable PG, a commercial office,
            or listing your space for rent, get started today without middleman fees.
          </p>
          <div className="about_cta_buttons">
            <Link href="/properties" className="about_btn_primary">
              <Search size={17} />
              <span>Explore Listings</span>
            </Link>
            <Link href="/dashboard/properties/new" className="about_btn_secondary">
              <PlusCircle size={17} />
              <span>Post Property for Free</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
