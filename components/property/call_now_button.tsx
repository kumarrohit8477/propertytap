'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { use_auth } from '@/hooks/use_auth';
import { Phone } from 'lucide-react';
import { create_client } from '@/lib/supabase/client';
import { show_interest } from '@/lib/properties/property_service';
import './call_now_button.css';

interface CallNowButtonProps {
  phone?: string | null;
  owner_id: string;
  property_id?: string;
  full_width?: boolean;
}

export default function CallNowButton({
  phone,
  owner_id,
  property_id,
  full_width = false,
}: CallNowButtonProps) {
  const { user } = use_auth();
  const router = useRouter();

  const [loading, set_loading] = useState(false);
  const [error_msg, set_error_msg] = useState<string | null>(null);

  const handle_click = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. If user is not logged in -> redirect to login page with return URL
    if (!user) {
      if (typeof window !== 'undefined') {
        const return_url = window.location.pathname + window.location.search;
        router.push(`/login?redirect=${encodeURIComponent(return_url)}`);
      } else {
        router.push('/login');
      }
      return;
    }

    // 2. If user is the owner
    if (user.id === owner_id) {
      set_error_msg('You are the owner of this property.');
      setTimeout(() => set_error_msg(null), 3000);
      return;
    }

    set_error_msg(null);
    let target_phone = phone;

    // 3. If phone is not passed via props, fetch from profile
    if (!target_phone) {
      set_loading(true);
      try {
        const supabase = create_client();
        const { data: profile } = await supabase
          .from('profiles')
          .select('phone')
          .eq('id', owner_id)
          .single();

        if (profile?.phone) {
          target_phone = profile.phone;
        }
      } catch (err) {
        console.error('Failed to retrieve owner phone number', err);
      } finally {
        set_loading(false);
      }
    }

    // 4. If phone is available, open phone dialer directly
    if (target_phone) {
      const clean_phone = target_phone.replace(/[^\d+]/g, '');

      // Also record interest in background so owner gets a notification
      if (property_id) {
        show_interest(property_id, owner_id).catch(() => {});
      }

      window.location.href = `tel:${clean_phone}`;
    } else {
      set_error_msg('Owner contact number not available.');
      setTimeout(() => set_error_msg(null), 3500);
    }
  };

  return (
    <div className={`call_now_wrapper ${full_width ? 'call_now_wrapper_full' : ''}`}>
      <button
        type="button"
        className={`call_now_btn ${full_width ? 'call_now_btn_full' : ''}`}
        onClick={handle_click}
        disabled={loading}
        title="Direct Call to Owner"
        aria-label="Call Now"
      >
        <Phone size={14} className="call_now_icon" />
        <span>{loading ? 'Connecting...' : 'Call Now'}</span>
      </button>

      {error_msg && (
        <div className="call_now_error_msg" role="alert">
          {error_msg}
        </div>
      )}
    </div>
  );
}
