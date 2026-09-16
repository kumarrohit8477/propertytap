import { PropertyItem } from './property';
import { UserProfile } from './user';

export type InterestStatus = 'active' | 'withdrawn' | 'closed';

export interface InterestRecord {
  id: string;
  property_id: string;
  interested_user_id: string;
  owner_id: string;
  status: InterestStatus;
  created_at: string;
  property?: PropertyItem;
  interested_user?: UserProfile;
  owner?: UserProfile;
}
