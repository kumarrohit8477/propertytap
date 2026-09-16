import { UserProfile } from './user';

export type PropertyPurpose = 'rent' | 'sale';
export type PropertyStatus = 'draft' | 'pending' | 'active' | 'expired' | 'rejected';

export interface PropertyCategory {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
  is_active: boolean;
  created_at?: string;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  storage_path?: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at?: string;
}

export interface PropertyItem {
  id: string;
  owner_id: string;
  category_id: string;
  title: string;
  description?: string | null;
  purpose: PropertyPurpose;
  price: number;
  price_period?: string;
  city: string;
  locality: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  area?: number | null;
  area_unit?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  furnishing?: string | null;
  status: PropertyStatus;
  created_at: string;
  updated_at: string;
  category?: PropertyCategory;
  images?: PropertyImage[];
  owner?: Partial<UserProfile>;
}

export interface PropertyFilterParams {
  query?: string;
  city?: string;
  locality?: string;
  category_id?: string;
  purpose?: PropertyPurpose;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  furnishing?: string;
  sort_by?: 'newest' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
}
