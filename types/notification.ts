export interface NotificationItem {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  property_id?: string | null;
  interest_id?: string | null;
  is_read: boolean;
  created_at: string;
}
