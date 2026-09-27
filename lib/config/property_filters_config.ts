import { PropertyCategory } from '@/types/property';

export type PropertyFilterGroup = 'residential' | 'pg' | 'hostel' | 'land' | 'commercial' | 'all';

export interface SeekerFilterGroup {
  key: string;
  label: string;
  propertyTypes: string[];
  slugs: string[];
  filter_group_type: PropertyFilterGroup;
}

export const SEEKER_FILTER_GROUPS: SeekerFilterGroup[] = [
  {
    key: 'land',
    label: 'Land / Plot',
    propertyTypes: ['Land', 'Plot', 'Residential Land', 'Commercial Land', 'Agricultural Land'],
    slugs: ['land', 'plot', 'residential-land', 'commercial-land', 'agricultural-land'],
    filter_group_type: 'land',
  },
  {
    key: 'apartment-flat-house',
    label: 'Apartment / Flat / House',
    propertyTypes: ['Apartment', 'Flat', 'House'],
    slugs: ['apartment', 'flat', 'house', 'residential'],
    filter_group_type: 'residential',
  },
  {
    key: 'hostel-pg',
    label: 'Hostel / PG',
    propertyTypes: ['Hostel', 'PG'],
    slugs: ['hostel', 'pg'],
    filter_group_type: 'pg',
  },
  {
    key: 'office-workspace',
    label: 'Office & Workspace',
    propertyTypes: ['Office', 'Workspace'],
    slugs: ['office', 'workspace'],
    filter_group_type: 'commercial',
  },
  {
    key: 'shops-showrooms',
    label: 'Shops & Showrooms',
    propertyTypes: ['Shop', 'Showroom'],
    slugs: ['shop', 'showroom'],
    filter_group_type: 'commercial',
  },
  {
    key: 'villa-warehouses',
    label: 'Villa & Warehouses',
    propertyTypes: ['Villa', 'Warehouse'],
    slugs: ['villa', 'warehouse'],
    filter_group_type: 'commercial',
  },
];

export function get_category_ids_for_filter(
  category_id_or_group_key?: string,
  categories: PropertyCategory[] = []
): string[] {
  if (!category_id_or_group_key || category_id_or_group_key === 'all') {
    return [];
  }

  // 1. Direct group key or label match
  const group = SEEKER_FILTER_GROUPS.find(
    (g) => g.key === category_id_or_group_key || g.label === category_id_or_group_key
  );

  if (group) {
    return categories
      .filter((cat) => {
        const cat_slug = (cat.slug || '').toLowerCase();
        const cat_name = (cat.name || '').toLowerCase();
        return (
          group.slugs.includes(cat_slug) ||
          group.propertyTypes.some((pt) => pt.toLowerCase() === cat_name)
        );
      })
      .map((cat) => cat.id);
  }

  // 2. Direct category ID or slug match
  const direct_cat = categories.find(
    (c) => c.id === category_id_or_group_key || c.slug === category_id_or_group_key
  );

  if (direct_cat) {
    const matching_group = SEEKER_FILTER_GROUPS.find(
      (g) =>
        g.slugs.includes((direct_cat.slug || '').toLowerCase()) ||
        g.propertyTypes.some((pt) => pt.toLowerCase() === (direct_cat.name || '').toLowerCase())
    );

    if (matching_group) {
      const group_ids = categories
        .filter((cat) => {
          const cat_slug = (cat.slug || '').toLowerCase();
          const cat_name = (cat.name || '').toLowerCase();
          return (
            matching_group.slugs.includes(cat_slug) ||
            matching_group.propertyTypes.some((pt) => pt.toLowerCase() === cat_name)
          );
        })
        .map((cat) => cat.id);

      if (group_ids.length > 0) return group_ids;
    }

    return [direct_cat.id];
  }

  const is_uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    category_id_or_group_key
  );

  return is_uuid ? [category_id_or_group_key] : [];
}

export function get_seeker_group_key(
  category_id_or_slug?: string,
  categories: PropertyCategory[] = []
): string {
  if (!category_id_or_slug || category_id_or_slug === 'all') return '';

  const existing_group = SEEKER_FILTER_GROUPS.find(
    (g) => g.key === category_id_or_slug || g.label === category_id_or_slug
  );
  if (existing_group) return existing_group.key;

  const cat = categories.find(
    (c) => c.id === category_id_or_slug || c.slug === category_id_or_slug
  );
  const cat_slug = (cat?.slug || category_id_or_slug).toLowerCase();
  const cat_name = (cat?.name || '').toLowerCase();

  const matched_group = SEEKER_FILTER_GROUPS.find(
    (g) =>
      g.slugs.includes(cat_slug) ||
      g.propertyTypes.some((pt) => pt.toLowerCase() === cat_name)
  );

  return matched_group ? matched_group.key : '';
}

export function get_filter_group_for_category(
  category_id_or_group_key?: string,
  categories: PropertyCategory[] = []
): PropertyFilterGroup {
  if (!category_id_or_group_key || category_id_or_group_key === 'all') return 'all';

  const seeker_group = SEEKER_FILTER_GROUPS.find(
    (g) => g.key === category_id_or_group_key || g.label === category_id_or_group_key
  );
  if (seeker_group) {
    return seeker_group.filter_group_type;
  }

  const cat = categories.find(
    (c) => c.id === category_id_or_group_key || c.slug === category_id_or_group_key
  );

  const slug = (cat?.slug || category_id_or_group_key).toLowerCase();
  const name = (cat?.name || '').toLowerCase();

  if (slug === 'pg' || name === 'pg' || slug === 'hostel' || name === 'hostel' || slug === 'hostel-pg') {
    return 'pg';
  }

  if (
    slug === 'land' ||
    slug.includes('land') ||
    slug === 'plot' ||
    name.includes('land') ||
    name.includes('plot')
  ) {
    return 'land';
  }

  if (
    slug === 'commercial' ||
    slug === 'shop' ||
    slug === 'office' ||
    slug === 'workspace' ||
    slug === 'showroom' ||
    slug === 'warehouse' ||
    name.includes('commercial') ||
    name.includes('shop') ||
    name.includes('office')
  ) {
    return 'commercial';
  }

  return 'residential';
}
