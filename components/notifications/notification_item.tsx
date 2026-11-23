'use client';

import React from 'react';
import Link from 'next/link';
import { NotificationItem as NotificationType } from '@/types/notification';
import { format_date } from '@/lib/utils/utils';
import {
  Phone,
  Mail,
  Home,
  CheckCircle2,
  Bell,
  Check,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import './notification_item.css';

interface NotificationItemProps {
  notification: NotificationType;
  on_mark_read: (id: string) => void;
}

export default function NotificationItem({
  notification,
  on_mark_read,
}: NotificationItemProps) {
  // Parse structured message if present
  const lines = (notification.message || '').split('\n').map((l) => l.trim()).filter(Boolean);
  let contactRole = '';
  let contactName = '';
  let phone = '';
  let email = '';
  let propertyTitle = '';
  const extraLines: string[] = [];

  for (const line of lines) {
    if (line.toLowerCase().startsWith('property lister:')) {
      contactRole = 'Property Lister';
      contactName = line.split(/:\s*(.+)/)[1] || '';
    } else if (line.toLowerCase().startsWith('interested user:')) {
      contactRole = 'Interested Seeker';
      contactName = line.split(/:\s*(.+)/)[1] || '';
    } else if (line.toLowerCase().startsWith('phone:')) {
      phone = line.split(/:\s*(.+)/)[1] || '';
    } else if (line.toLowerCase().startsWith('email:')) {
      email = line.split(/:\s*(.+)/)[1] || '';
    } else if (line.toLowerCase().startsWith('property:')) {
      propertyTitle = line.split(/:\s*(.+)/)[1] || '';
    } else {
      extraLines.push(line);
    }
  }

  const isStructured = Boolean(contactName || phone || email || propertyTitle);
  const cleanPhoneDigits = phone.replace(/[^0-9]/g, '');
  const isInterestSent = notification.type === 'interest_sent' || notification.title.toLowerCase().includes('shared');

  return (
    <article
      className={`notification_card ${
        !notification.is_read ? 'notification_card_unread' : ''
      }`}
    >
      {/* ── Card Header ── */}
      <div className="notif_header">
        <div className="notif_header_left">
          <div
            className={`notif_icon_box ${
              isInterestSent ? 'notif_icon_sent' : 'notif_icon_received'
            }`}
          >
            {isInterestSent ? (
              <CheckCircle2 size={20} />
            ) : (
              <Bell size={20} />
            )}
          </div>
          <div className="notif_title_group">
            <div className="notif_title_row">
              <h3 className="notif_title">{notification.title}</h3>
              {!notification.is_read ? (
                <span className="notif_badge_unread">New</span>
              ) : (
                <span className="notif_badge_read">Read</span>
              )}
            </div>
            <span className="notif_time">
              {format_date(notification.created_at)}
            </span>
          </div>
        </div>

        {!notification.is_read && (
          <button
            type="button"
            className="notif_mark_read_btn"
            onClick={() => on_mark_read(notification.id)}
            title="Mark as read"
          >
            <Check size={14} />
            <span>Mark as read</span>
          </button>
        )}
      </div>

      {/* ── Card Body (Structured Contact Exchange or Plain Message) ── */}
      {isStructured ? (
        <div className="notif_details_box">
          {/* Contact Identity Row */}
          <div className="notif_identity_row">
            <div className="notif_avatar_circle">
              {contactName ? contactName.charAt(0).toUpperCase() : 'C'}
            </div>
            <div className="notif_person_info">
              <div className="notif_person_name_row">
                <span className="notif_person_name">{contactName || 'User'}</span>
                {contactRole && (
                  <span className={`notif_role_tag ${isInterestSent ? 'notif_role_lister' : 'notif_role_seeker'}`}>
                    {contactRole}
                  </span>
                )}
              </div>
              {propertyTitle && (
                <div className="notif_property_row">
                  <Home size={14} className="notif_prop_icon" />
                  <span className="notif_prop_label">Property:</span>
                  {notification.property_id ? (
                    <Link
                      href={`/properties/${notification.property_id}`}
                      className="notif_prop_link"
                    >
                      <span>{propertyTitle}</span>
                      <ExternalLink size={12} />
                    </Link>
                  ) : (
                    <span className="notif_prop_name">{propertyTitle}</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Contact Actions Grid */}
          <div className="notif_contact_actions">
            {phone && phone !== 'Not provided' && (
              <>
                <a
                  href={`tel:${phone}`}
                  className="notif_action_pill notif_action_phone"
                >
                  <Phone size={14} />
                  <span>Call: <strong>{phone}</strong></span>
                </a>

                {cleanPhoneDigits.length >= 10 && (
                  <a
                    href={`https://wa.me/${cleanPhoneDigits.length === 10 ? '91' + cleanPhoneDigits : cleanPhoneDigits}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="notif_action_pill notif_action_whatsapp"
                  >
                    <MessageCircle size={14} />
                    <span>WhatsApp</span>
                  </a>
                )}
              </>
            )}

            {email && email !== 'Not provided' && (
              <a
                href={`mailto:${email}`}
                className="notif_action_pill notif_action_email"
              >
                <Mail size={14} />
                <span>{email}</span>
              </a>
            )}
          </div>

          {extraLines.length > 0 && (
            <div className="notif_extra_text">
              {extraLines.join('\n')}
            </div>
          )}
        </div>
      ) : (
        <div className="notif_plain_message">
          {notification.message}
        </div>
      )}
    </article>
  );
}
