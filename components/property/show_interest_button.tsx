'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { use_auth } from '@/hooks/use_auth';
import { show_interest } from '@/lib/properties/property_service';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
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
  const [show_auth_modal, set_show_auth_modal] = useState(false);

  const handle_click = async () => {
    if (!user) {
      set_show_auth_modal(true);
      return;
    }

    if (user.id === owner_id) {
      set_error_msg('You are the owner of this property.');
      return;
    }

    set_loading(true);
    set_error_msg(null);

    const { error } = await show_interest(property_id, owner_id);

    if (error) {
      if (error.message.includes('unique_property_interested_user') || error.message.includes('duplicate')) {
        set_error_msg('You have already expressed interest in this property.');
      } else {
        set_error_msg(error.message || 'Failed to express interest.');
      }
    } else {
      set_success(true);
    }

    set_loading(false);
  };

  return (
    <div className="show_interest_wrapper">
      {success ? (
        <div className="show_interest_success_msg">
          ✅ Interest shared! Check Notifications for contact details.
        </div>
      ) : (
        <Button
          variant="primary"
          full_width={full_width}
          disabled={loading}
          onClick={handle_click}
        >
          {loading ? 'Processing...' : 'Show Interest'}
        </Button>
      )}

      {error_msg && <div className="show_interest_error_msg">{error_msg}</div>}

      <Modal
        is_open={show_auth_modal}
        on_close={() => set_show_auth_modal(false)}
        title="Account Required"
      >
        <p style={{ fontSize: '0.95rem', color: '#4b5563', marginBottom: '1.25rem' }}>
          Please login or create an account to show interest in this property and exchange contact details securely.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button
            variant="primary"
            full_width={true}
            onClick={() => router.push('/login')}
          >
            Login
          </Button>
          <Button
            variant="outline"
            full_width={true}
            onClick={() => router.push('/signup')}
          >
            Create Account
          </Button>
        </div>
      </Modal>
    </div>
  );
}
