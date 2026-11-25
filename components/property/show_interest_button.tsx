'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use_auth } from '@/hooks/use_auth';
import { show_interest } from '@/lib/properties/property_service';
import { create_client } from '@/lib/supabase/client';
import Button from '@/components/ui/button';
import './show_interest_button.css';

interface ShowInterestButtonProps {
  property_id: string;
  owner_id: string;
  full_width?: boolean;
}

export default function ShowInterestButton({
  property_id,
  owner_id,
  full_width = false,
}: ShowInterestButtonProps) {
  const { user } = use_auth();
  const router = useRouter();

  const [loading, set_loading] = useState(false);
  const [success, set_success] = useState(false);
  const [error_msg, set_error_msg] = useState<string | null>(null);

  // Check if interest has already been expressed by the logged-in user
  useEffect(() => {
    if (!user) return;

    if (typeof window !== 'undefined' && sessionStorage.getItem('just_expressed_' + property_id) === 'true') {
      set_success(true);
      return;
    }

    const check_interest = async () => {
      try {
        const supabase = create_client();
        const { data } = await supabase
          .from('interests')
          .select('id')
          .eq('property_id', property_id)
          .eq('interested_user_id', user.id)
          .maybeSingle();

        if (data) {
          set_success(true);
        }
      } catch (err) {
        console.error('Failed to verify interest status', err);
      }
    };

    check_interest();
  }, [user, property_id]);

  const handle_click = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!user) {
      if (typeof window !== 'undefined') {
        const return_url = window.location.pathname + window.location.search;
        sessionStorage.setItem(
          'pending_interest',
          JSON.stringify({ property_id, owner_id, return_url })
        );
        router.push(
          `/login?redirect=${encodeURIComponent(return_url)}&interest_prop=${property_id}&owner_id=${owner_id}`
        );
      } else {
        router.push('/login');
      }
      return;
    }

    if (user.id === owner_id) {
      set_error_msg('You are the owner of this property.');
      setTimeout(() => set_error_msg(null), 3000);
      return;
    }

    set_loading(true);
    set_error_msg(null);

    const { error } = await show_interest(property_id, owner_id);

    if (error) {
      if (error.message.includes('unique_property_interested_user') || error.message.includes('duplicate')) {
        set_error_msg('Already expressed interest.');
        set_success(true);
      } else {
        set_error_msg(error.message || 'Failed to express interest.');
      }
      setTimeout(() => set_error_msg(null), 3500);
    } else {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('just_expressed_' + property_id, 'true');
      }
      set_success(true);
    }

    set_loading(false);
  };

  return (
    <div className="show_interest_wrapper">
      {success ? (
        <div className="show_interest_success_msg" title="Check Notifications for contact details">
          <span className="btn_text_full">Interest Sent</span>
          <span className="btn_text_short">Sent</span>
        </div>
      ) : (
        <Button
          variant="primary"
          full_width={full_width}
          disabled={loading}
          onClick={handle_click}
          className="show_interest_btn"
        >
          {loading ? (
            'Processing...'
          ) : (
            <>
              <span className="btn_text_full">Show Interest</span>
              <span className="btn_text_short">Interest</span>
            </>
          )}
        </Button>
      )}

      {error_msg && <div className="show_interest_error_msg" role="alert">{error_msg}</div>}
    </div>
  );
}
