'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { use_auth } from '@/hooks/use_auth';
import { show_interest } from '@/lib/properties/property_service';
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

  const handle_click = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!user) {
      router.push('/login');
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
      } else {
        set_error_msg(error.message || 'Failed to express interest.');
      }
      setTimeout(() => set_error_msg(null), 3500);
    } else {
      set_success(true);
    }

    set_loading(false);
  };

  return (
    <div className="show_interest_wrapper">
      {success ? (
        <div className="show_interest_success_msg" title="Check Notifications for contact details">
          ✅ Interest Sent
        </div>
      ) : (
        <Button
          variant="primary"
          full_width={full_width}
          disabled={loading}
          onClick={handle_click}
          className="show_interest_btn"
        >
          {loading ? 'Processing...' : 'Show Interest'}
        </Button>
      )}

      {error_msg && <div className="show_interest_error_msg" role="alert">{error_msg}</div>}
    </div>
  );
}
