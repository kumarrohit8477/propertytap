export type UserRole = 'user' | 'admin';
export type ProfileType = 'individual' | 'pg' | 'hostel' | 'company';

export interface UserProfile {
  id: string;
  full_name: string;
  display_name?: string | null;
  profile_type?: ProfileType | null;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
  role: UserRole;
  email_verified: boolean;
  phone_verified: boolean;
  created_at: string;
  updated_at: string;
}
