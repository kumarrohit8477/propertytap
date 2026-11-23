'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Phone,
  Mail,
  HelpCircle,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Building2,
  DollarSign,
  UserCheck,
  X,
  ArrowRight,
  MessageSquare,
  Clock,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import './support.css';

interface FAQ {
  id: string;
  category: 'general' | 'seekers' | 'owners' | 'pricing' | 'safety';
  categoryLabel: string;
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  {
    id: 'free_owners',
    category: 'owners',
    categoryLabel: 'Listing a Property',
    question: 'Is PropertyTap completely free for property owners and landlords?',
    answer:
      'Yes, absolutely! Property owners and landlords can post residential, commercial, or PG listings completely free of cost during our launch offer. There are no hidden fees or charges for publishing listings.',
  },
  {
    id: 'contact_owner',
    category: 'seekers',
    categoryLabel: 'Seeking Properties',
    question: 'How do I contact a property owner directly?',
    answer:
      'On any property detail page, click "Show Interest", "Call Now", or "WhatsApp" to connect directly with the owner. We believe in direct human communication without pushy broker middlemen.',
  },
  {
    id: 'zero_brokerage',
    category: 'pricing',
    categoryLabel: 'Zero Brokerage',
    question: 'Does PropertyTap charge brokerage fees on rentals or sales?',
    answer:
      'Never! PropertyTap operates strictly under a Zero Brokerage philosophy. We do not take 15–30 days of rental income or 1–2% commission on property deals. 100% of the transaction value remains between you and the owner.',
  },
  {
    id: 'verification',
    category: 'safety',
    categoryLabel: 'Trust & Safety',
    question: 'How are listings verified on PropertyTap?',
    answer:
      'We run automated phone and email verification alongside quality screening of photos and listing descriptions. Users can also report suspicious or duplicate listings at any time for swift manual review.',
  },
  {
    id: 'listing_time',
    category: 'owners',
    categoryLabel: 'Listing a Property',
    question: 'How long does it take for a new listing to go live?',
    answer:
      'Creating a listing takes under 2 minutes through our simple 6-step form. Once you upload photos and press publish, your listing becomes active and visible to seekers across your city immediately.',
  },
  {
    id: 'edit_listing',
    category: 'owners',
    categoryLabel: 'Listing a Property',
    question: 'Can I edit or deactivate my listing once it has been posted?',
    answer:
      'Yes! You have full control from your PropertyTap dashboard. Navigate to "My Properties" to edit pricing, update descriptions, upload additional photos, or mark the property as rented/sold.',
  },
  {
    id: 'report_fake',
    category: 'safety',
    categoryLabel: 'Trust & Safety',
    question: 'What should I do if I encounter a fake, suspicious, or misleading listing?',
    answer:
      'Every listing page has a "Report" button. You can also message our support desk directly on WhatsApp (+91 9258073878) with the listing URL. Our trust & safety team investigates and suspends fraudulent accounts promptly.',
  },
  {
    id: 'commercial_pg',
    category: 'seekers',
    categoryLabel: 'Seeking Properties',
    question: 'Can I search for PGs, hostels, or commercial office spaces on PropertyTap?',
    answer:
      'Yes! PropertyTap covers all property types: Residential Apartments, Independent Villas, Student/Working Professional PGs, Commercial Shops & Offices, and Plot/Land properties with tailored search filters for each.',
  },
  {
    id: 'support_hours',
    category: 'general',
    categoryLabel: 'General Help',
    question: 'What are PropertyTap’s customer support hours?',
    answer:
      'Our live WhatsApp and phone desk is active Monday through Sunday from 9:00 AM to 8:00 PM IST. You can also email us 24/7 at info@propertytap.in, and we will get back to you within 2 to 4 business hours.',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Topics' },
  { id: 'seekers', label: 'Seeking Properties' },
  { id: 'owners', label: 'Listing a Property' },
  { id: 'pricing', label: 'Zero Brokerage' },
  { id: 'safety', label: 'Trust & Safety' },
  { id: 'general', label: 'General Help' },
];

export default function SupportPage() {
  const [search_query, set_search_query] = useState('');
  const [selected_category, set_selected_category] = useState('all');
  const [open_faq_id, set_open_faq_id] = useState<string | null>('free_owners');

  const filtered_faqs = useMemo(() => {
    return FAQS.filter((faq) => {
      const matches_category =
        selected_category === 'all' || faq.category === selected_category;
      const matches_query =
        !search_query.trim() ||
        faq.question.toLowerCase().includes(search_query.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search_query.toLowerCase());
      return matches_category && matches_query;
    });
  }, [search_query, selected_category]);

  const toggle_faq = (id: string) => {
    set_open_faq_id((prev) => (prev === id ? null : id));
  };

  return (
    <div className="support_page_wrapper">
      {/* ── Top Hero Section ── */}
      <section className="support_hero_section">
        <h1 className="support_hero_title">
          How Can We <span className="support_hero_gradient">Help You Today?</span>
        </h1>
        <p className="support_hero_subtitle">
          Search our comprehensive knowledge base or get in touch directly with our support specialists.
        </p>

        {/* Live Search Bar */}
        <div className="support_search_wrap">
          <Search size={18} className="support_search_icon" />
          <input
            type="text"
            className="support_search_input"
            placeholder="Search questions, topics, or keywords (e.g. 'zero brokerage', 'photos', 'contact owner')..."
            value={search_query}
            onChange={(e) => set_search_query(e.target.value)}
          />
          {search_query && (
            <button
              type="button"
              className="support_search_clear"
              onClick={() => set_search_query('')}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </section>

      {/* ── Direct Support Channels Grid ── */}
      <section className="support_channels_section">
        <div className="support_channels_grid">
          {/* WhatsApp Support Card (Featured) */}
          <div className="support_channel_card channel_card_featured">
            <div className="channel_header_row">
              <div className="channel_icon_wrap icon_green">
                <FaWhatsapp size={22} />
              </div>
              <div className="channel_status_badge">
                <span className="status_dot" /> Online Now
              </div>
            </div>
            <h3 className="channel_title">WhatsApp Live Chat</h3>
            <p className="channel_desc">
              Connect directly with our support team for instant assistance with your listings, accounts, or queries.
            </p>
            <a
              href="https://wa.me/919258073878?text=Hello%20PropertyTap%20Support,%20I%20need%20assistance."
              target="_blank"
              rel="noopener noreferrer"
              className="channel_action_link btn_whatsapp"
            >
              <FaWhatsapp size={16} />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Phone Desk Card */}
          <div className="support_channel_card">
            <div className="channel_header_row">
              <div className="channel_icon_wrap icon_blue">
                <Phone size={20} />
              </div>
            </div>
            <h3 className="channel_title">Phone Helpline</h3>
            <p className="channel_desc">
              Speak with a dedicated support executive during our active hours (Mon – Sun, 9:00 AM – 8:00 PM IST).
            </p>
            <a href="tel:+919258073878" className="channel_action_link btn_outline">
              <Phone size={15} />
              <span>+91 9258073878</span>
            </a>
          </div>

          {/* Email Support Card */}
          <div className="support_channel_card">
            <div className="channel_header_row">
              <div className="channel_icon_wrap icon_purple">
                <Mail size={20} />
              </div>
            </div>
            <h3 className="channel_title">Email Inquiries</h3>
            <p className="channel_desc">
              Send us detailed questions, corporate partnership requests, or feedback with guaranteed 24-hour response.
            </p>
            <a href="mailto:info@propertytap.in" className="channel_action_link btn_outline">
              <Mail size={15} />
              <span>info@propertytap.in</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ Knowledge Base Section ── */}
      <section className="support_topics_section">
        <div className="support_section_header">
          <span className="support_section_pretitle">Knowledge Base</span>
          <h2 className="support_section_title">Frequently Asked Questions</h2>
          <p className="support_section_subtitle">
            Browse commonly asked questions organized by topic.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="support_topics_grid">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`support_topic_pill ${selected_category === cat.id ? 'active' : ''}`}
              onClick={() => set_selected_category(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="support_faq_list">
          {filtered_faqs.length > 0 ? (
            filtered_faqs.map((faq) => {
              const is_open = open_faq_id === faq.id;
              return (
                <div key={faq.id} className={`support_faq_card ${is_open ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="support_faq_btn"
                    onClick={() => toggle_faq(faq.id)}
                    aria-expanded={is_open}
                  >
                    <div className="support_faq_q_wrap">
                      <span className="support_faq_cat_badge">{faq.categoryLabel}</span>
                      <span className="support_faq_question">{faq.question}</span>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`support_faq_chevron ${is_open ? 'rotated' : ''}`}
                    />
                  </button>
                  {is_open && (
                    <div className="support_faq_answer">
                      <p style={{ margin: 0 }}>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="support_no_results">
              <div className="support_no_results_icon">
                <HelpCircle size={24} />
              </div>
              <h3 className="support_no_results_title">No matching questions found</h3>
              <p className="support_no_results_desc">
                We couldn&apos;t find any questions matching &quot;{search_query}&quot;. Try a different term or contact us directly.
              </p>
              <button
                type="button"
                className="support_topic_pill active"
                onClick={() => {
                  set_search_query('');
                  set_selected_category('all');
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Still Need Help Banner ── */}
      <section className="support_help_banner">
        <div className="support_help_card">
          <h2 className="support_help_title">Didn&apos;t Find What You Need?</h2>
          <p className="support_help_desc">
            Our support specialists are always ready to answer any questions or help you navigate your property listings.
          </p>
          <div className="support_help_buttons">
            <a
              href="https://wa.me/919258073878?text=Hello%20PropertyTap,%20I%20have%20a%20question."
              target="_blank"
              rel="noopener noreferrer"
              className="support_btn_primary"
            >
              <FaWhatsapp size={18} />
              <span>Chat on WhatsApp</span>
            </a>
            <Link href="/contact" className="support_btn_secondary">
              <MessageSquare size={17} />
              <span>Open Contact Form</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
