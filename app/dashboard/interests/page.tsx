'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { create_client } from '@/lib/supabase/client';
import { format_date } from '@/lib/utils/utils';
import '@/app/dashboard/dashboard.css';
import './interests.css';

export default function InterestsPage() {
  const [interests, set_interests] = useState<any[]>([]);
  const [loading, set_loading] = useState(true);
  const [current_user_id, set_current_user_id] = useState<string | null>(null);

  useEffect(() => {
    async function load_interests() {
      set_loading(true);
      const supabase = create_client();
      const { data: user_data } = await supabase.auth.getUser();

      if (user_data.user) {
        set_current_user_id(user_data.user.id);
        const { data } = await supabase
          .from('interests')
          .select(`
            *,
            property:properties(
              id, title, city, locality, price, purpose,
              area, area_unit, bedrooms, bathrooms, furnishing, address,
              images:property_images(image_url, is_primary, sort_order)
            ),
            interested_user:profiles!interests_interested_user_id_fkey(full_name, email, phone),
            owner:profiles!interests_owner_id_fkey(full_name, email, phone)
          `)
          .or(`interested_user_id.eq.${user_data.user.id},owner_id.eq.${user_data.user.id}`)
          .order('created_at', { ascending: false });

        set_interests(data || []);
      }
      set_loading(false);
    }
    load_interests();
  }, []);

  const get_primary_image = (images: any[]) => {
    if (!images || images.length === 0) return null;
    return (
      images.find((img: any) => img.is_primary)?.image_url ||
      [...images].sort((a: any, b: any) => a.sort_order - b.sort_order)[0]?.image_url
    );
  };

  const format_price = (price: number, purpose: string) => {
    if (!price) return 'Price on request';
    const formatted = price >= 10000000
      ? `₹${(price / 10000000).toFixed(2)} Cr`
      : price >= 100000
      ? `₹${(price / 100000).toFixed(1)} L`
      : `₹${price.toLocaleString('en-IN')}`;
    return purpose === 'rent' ? `${formatted}/mo` : formatted;
  };

  return (
    <div className="dashboard_layout_container">
      <main className="dashboard_main_content">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: 0 }}>
          My Interests
        </h1>
        {loading ? (
          <div className="interests_loading_box">
            <div className="interests_spinner" />
            <p>Loading your interests...</p>
          </div>
        ) : interests.length === 0 ? (
          <div className="interests_empty_box">
            <div className="interests_empty_icon"></div>
            <h3>No Active Interests Yet</h3>
            <p>Express interest on property detail pages to connect with listers.</p>
            <Link href="/properties" className="interests_explore_btn">Explore Properties</Link>
          </div>
        ) : (
          <div className="interests_grid">
            {interests.map((item) => {
              const prop = item.property;
              const is_my_interest = item.interested_user_id === current_user_id;
              const other_user = is_my_interest ? item.owner : item.interested_user;
              const primary_image = get_primary_image(prop?.images || []);

              return (
                <div key={item.id} className="interests_card">
                  {/* Property Image */}
                  <div className="interests_card_image_wrap">
                    {primary_image ? (
                      <img src={primary_image} alt={prop?.title} className="interests_card_image" />
                    ) : (
                      <div className="interests_card_no_image"></div>
                    )}
                    <span className={`interests_purpose_badge ${prop?.purpose === 'rent' ? 'badge_rent' : 'badge_sale'}`}>
                      {prop?.purpose === 'rent' ? 'For Rent' : 'For Sale'}
                    </span>
                    <span className={`interests_role_badge ${is_my_interest ? 'role_seeker' : 'role_owner'}`}>
                      {is_my_interest ? 'My Interest' : 'Seeker'}
                    </span>
                  </div>

                  {/* Property Info */}
                  <div className="interests_card_body">
                    <h3 className="interests_card_title">{prop?.title || 'Property'}</h3>

                    <div className="interests_card_location">
                      {prop?.locality}{prop?.city ? `, ${prop.city}` : ''}
                    </div>

                    {/* Price */}
                    <div className="interests_card_price">
                      {format_price(prop?.price, prop?.purpose)}
                    </div>

                    {/* Property specs */}
                    <div className="interests_card_specs">
                      {prop?.bedrooms != null && (
                        <span className="interests_spec_pill">{prop.bedrooms} BHK</span>
                      )}
                      {prop?.bathrooms != null && (
                        <span className="interests_spec_pill">{prop.bathrooms} Bath</span>
                      )}
                      {prop?.area && (
                        <span className="interests_spec_pill">{prop.area} {prop.area_unit || 'sq.ft'}</span>
                      )}
                      {prop?.furnishing && (
                        <span className="interests_spec_pill">{prop.furnishing}</span>
                      )}
                    </div>

                    {/* Contact Info */}
                    {other_user && (
                      <div className="interests_contact_box">
                        <div className="interests_contact_label">
                          {is_my_interest ? 'Owner Contact' : 'Interested Person'}
                        </div>
                        <div className="interests_contact_name">{other_user.full_name || '—'}</div>
                        <div className="interests_contact_actions">
                          {other_user.phone && other_user.phone !== 'Not provided' && (
                            <>
                              <a href={`tel:${other_user.phone}`} className="interests_contact_pill phone_pill">
                                {other_user.phone}
                              </a>
                              <a
                                href={`https://wa.me/${other_user.phone.replace(/[^0-9]/g, '').length === 10 ? '91' + other_user.phone.replace(/[^0-9]/g, '') : other_user.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="interests_contact_pill whatsapp_pill"
                              >
                                WhatsApp
                              </a>
                            </>
                          )}
                          {other_user.email && other_user.email !== 'Not provided' && (
                            <a href={`mailto:${other_user.email}`} className="interests_contact_pill email_pill">
                              {other_user.email}
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="interests_card_footer">
                      <span className="interests_card_date">{format_date(item.created_at)}</span>
                      {prop?.id && (
                        <Link href={`/properties/${prop.id}`} className="interests_view_btn">
                          View Property →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
