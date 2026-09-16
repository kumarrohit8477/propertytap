export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
  role: UserRole;
  email_verified: boolean;
  phone_verified: boolean;
  created_at: string;
  updated_at: string;
}
