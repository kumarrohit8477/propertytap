'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MessageSquare,
  Send,
  Clock,
  MapPin,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Headphones,
} from 'lucide-react';
import { FaWhatsapp, FaInstagram, FaLinkedinIn, FaFacebookF } from 'react-icons/fa';
import './contact.css';

const FAQ_ITEMS = [
  {
    question: 'Is PropertyTap really 100% free with Zero Brokerage?',
    answer:
      'Yes, absolutely! PropertyTap operates on a strict Zero Brokerage philosophy. We do not charge commissions from property seekers, tenants, or owners. You connect and negotiate directly.',
  },
  {
    question: 'How do I list my property on PropertyTap?',
    answer:
      'Click the "+ List Property" button in the top navigation bar. Follow our simple guided listing steps, select your property type, upload photos, and publish. During our launch offer, listing is 100% free!',
  },
  {
    question: 'How quickly does your team respond to inquiries?',
    answer:
      'Our WhatsApp and phone support lines are active from 9:00 AM to 8:00 PM IST with near-instant replies. Inquiries sent via the contact form or email are typically answered within 2 to 4 hours.',
  },
  {
    question: 'How do I report a suspicious or misleading listing?',
    answer:
      'You can report any listing directly using the "Report" button on the property details page, or message us via WhatsApp / this form with the listing ID. Our trust & safety team acts immediately.',
  },
  {
    question: 'Can real estate agents or brokers also use PropertyTap?',
    answer:
      'Yes, genuine owners, brokers, and builders can list properties transparently on PropertyTap, provided all listing details and pricing are accurate and adhere to our platform guidelines.',
  },
];

const TOPICS = [
  { id: 'general', label: 'General Inquiry' },
  { id: 'listing', label: 'Listing Assistance' },
  { id: 'issue', label: 'Report an Issue' },
  { id: 'partnership', label: 'Partnership / Business' },
];

export default function ContactPage() {
  const [topic, set_topic] = useState('general');
  const [name, set_name] = useState('');
  const [email, set_email] = useState('');
  const [phone, set_phone] = useState('');
  const [phone_error, set_phone_error] = useState<string | null>(null);
  const [message, set_message] = useState('');
  const [loading, set_loading] = useState(false);
  const [submitted, set_submitted] = useState(false);
  const [active_faq, set_active_faq] = useState<number | null>(0);

  const handle_submit = (e: React.FormEvent) => {
    e.preventDefault();
    set_phone_error(null);

    const clean_phone = phone.replace(/\D/g, '');
    if (clean_phone && clean_phone.length !== 10) {
      set_phone_error('Please enter a valid 10-digit mobile number.');
      return;
    }

    set_loading(true);

    setTimeout(() => {
      set_loading(false);
      set_submitted(true);
    }, 600);
  };

  const handle_reset = () => {
    set_submitted(false);
    set_name('');
    set_email('');
    set_phone('');
    set_message('');
    set_topic('general');
  };

  const toggle_faq = (index: number) => {
    set_active_faq((prev) => (prev === index ? null : index));
  };

  return (
    <div className="contact_page_wrapper">
      {/* ── Top Hero Section ── */}
      <section className="contact_hero_section">
        <h1 className="contact_hero_title">
          Get in Touch with <span className="contact_hero_gradient">PropertyTap</span>
        </h1>
        <p className="contact_hero_subtitle">
          Have a question about zero-brokerage listings, need help discovering properties,
          or looking for business partnerships? Our support team is always ready to assist.
        </p>

        {/* Quick Highlights Bar */}
        <div className="contact_highlights_row">
          <div className="contact_highlight_item">
            <Clock size={16} className="contact_highlight_icon" />
            <span><strong>&lt; 2 Hours</strong> Average Response</span>
          </div>
          <div className="contact_highlight_divider" />
          <div className="contact_highlight_item">
            <Headphones size={16} className="contact_highlight_icon" />
            <span><strong>WhatsApp &amp; Call</strong> Live Help</span>
          </div>
          <div className="contact_highlight_divider" />
          <div className="contact_highlight_item">
            <ShieldCheck size={16} className="contact_highlight_icon" />
            <span><strong>₹0 Brokerage</strong> Transparency</span>
          </div>
        </div>
      </section>

      {/* ── Main 2-Column Content ── */}
      <section className="contact_main_section">
        <div className="contact_grid_container">
          {/* Left Column: Direct Channels & Reach-out Cards */}
          <div className="contact_info_column">
            <div className="contact_info_header">
              <h2 className="contact_section_heading">Direct Channels</h2>
              <p className="contact_section_desc">
                Choose the communication channel that works best for you.
              </p>
            </div>

            {/* Phone Call Card */}
            <div className="contact_channel_card">
              <div className="channel_card_top">
                <div className="channel_icon_wrap icon_phone">
                  <Phone size={20} />
                </div>
              </div>
              <h3 className="channel_card_title">Phone Desk</h3>
              <p className="channel_card_desc">
                Prefer speaking directly to a representative? Give us a call during support hours.
              </p>
              <div className="channel_action_group">
                <a href="tel:+919258073878" className="channel_action_btn btn_outline">
                  <Phone size={15} />
                  <span>+91 9258073878</span>
                </a>
              </div>
            </div>

            {/* Email Support Card */}
            <div className="contact_channel_card">
              <div className="channel_card_top">
                <div className="channel_icon_wrap icon_mail">
                  <Mail size={20} />
                </div>
              </div>
              <h3 className="channel_card_title">Email Inquiries</h3>
              <p className="channel_card_desc">
                For detailed queries, corporate partnerships, legal, or feedback, email us directly.
              </p>
              <div className="channel_action_group">
                <a href="mailto:info@propertytap.in" className="channel_action_btn btn_outline">
                  <Mail size={15} />
                  <span>info@propertytap.in</span>
                </a>
              </div>
              <div className="channel_hours_note">
                <Clock size={13} />
                <span>Guaranteed response within 24 hours</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="contact_form_column">
            <div className="contact_form_card">
              {submitted ? (
                <div className="contact_success_state">
                  <div className="success_icon_wrap">
                    <CheckCircle2 size={44} className="success_check_icon" />
                  </div>
                  <h3 className="success_title">Message Sent Successfully!</h3>
                  <p className="success_desc">
                    Thank you, <strong>{name || 'valued user'}</strong>! Our team has received your message regarding{' '}
                    <strong>{TOPICS.find((t) => t.id === topic)?.label}</strong>. We will reach out to{' '}
                    <strong>{email}</strong> shortly.
                  </p>
                  <button type="button" className="success_reset_btn" onClick={handle_reset}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handle_submit} className="contact_form_inner">
                  <div className="contact_form_header">
                    <div className="form_header_badge">
                      <MessageSquare size={14} />
                      <span>Online Form</span>
                    </div>
                    <h2 className="form_title">Send Us a Message</h2>
                    <p className="form_subtitle">
                      Fill out the form below and an expert from our team will get in touch with you.
                    </p>
                  </div>

                  {/* Topic Selector */}
                  <div className="form_field_group">
                    <label className="form_label">What can we help you with?</label>
                    <div className="form_topic_pills">
                      {TOPICS.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          className={`form_topic_pill ${topic === t.id ? 'active' : ''}`}
                          onClick={() => set_topic(t.id)}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name Field */}
                  <div className="form_field_group">
                    <label className="form_label" htmlFor="contact_name">
                      Your Full Name <span className="required_star">*</span>
                    </label>
                    <input
                      id="contact_name"
                      type="text"
                      className="form_input"
                      placeholder="e.g. Aman Sharma"
                      value={name}
                      onChange={(e) => set_name(e.target.value)}
                      required
                    />
                  </div>

                  {/* Email & Phone Row */}
                  <div className="form_row_grid">
                    <div className="form_field_group">
                      <label className="form_label" htmlFor="contact_email">
                        Email Address <span className="required_star">*</span>
                      </label>
                      <input
                        id="contact_email"
                        type="email"
                        className="form_input"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => set_email(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form_field_group">
                      <label className="form_label" htmlFor="contact_phone">
                        Phone / WhatsApp <span className="optional_label">(Optional, 10 digits)</span>
                      </label>
                      <input
                        id="contact_phone"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        pattern="[0-9]{10}"
                        className="form_input"
                        placeholder="e.g. 9876543210"
                        value={phone}
                        onChange={(e) => {
                          set_phone(e.target.value.replace(/\D/g, '').slice(0, 10));
                          if (phone_error) set_phone_error(null);
                        }}
                      />
                      {phone_error && (
                        <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                          {phone_error}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="form_field_group">
                    <label className="form_label" htmlFor="contact_message">
                      Your Message <span className="required_star">*</span>
                    </label>
                    <textarea
                      id="contact_message"
                      className="form_textarea"
                      placeholder="Tell us about your property requirements, questions, or issues..."
                      value={message}
                      onChange={(e) => set_message(e.target.value)}
                      rows={5}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="form_submit_btn" disabled={loading}>
                    {loading ? (
                      <span className="btn_loading_state">
                        <span className="btn_spinner" />
                        <span>Sending message...</span>
                      </span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send size={16} />
                      </>
                    )}
                  </button>

                  <p className="form_privacy_notice">
                    Your information is confidential and will never be shared with third parties.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
