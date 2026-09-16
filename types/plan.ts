export interface ListingPlan {
  id: string;
  name: string;
  duration_days: number;
  price: number;
  is_active: boolean;
  created_at?: string;
}

export interface PropertyListing {
  id: string;
  property_id: string;
  plan_id: string;
  start_date: string;
  expiry_date: string;
  amount: number;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  listing_status: 'active' | 'expired' | 'pending' | 'cancelled';
  created_at: string;
  plan?: ListingPlan;
}

export interface PaymentRecord {
  id: string;
  user_id: string;
  property_id?: string | null;
  listing_id?: string | null;
  amount: number;
  currency: string;
  provider: string;
  transaction_id?: string | null;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
}
