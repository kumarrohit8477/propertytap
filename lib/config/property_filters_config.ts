import { PropertyCategory } from '@/types/property';

export type PropertyFilterGroup = 'residential' | 'pg' | 'hostel' | 'land' | 'commercial' | 'all';

export function get_filter_group_for_category(
  category_id_or_slug?: string,
  categories: PropertyCategory[] = []
): PropertyFilterGroup {
  if (!category_id_or_slug) return 'all';

  const cat = categories.find(
    (c) => c.id === category_id_or_slug || c.slug === category_id_or_slug
  );

  const slug = (cat?.slug || category_id_or_slug).toLowerCase();
  const name = (cat?.name || '').toLowerCase();

  if (slug === 'pg' || name === 'pg') {
    return 'pg';
  }

  if (slug === 'hostel' || name === 'hostel') {
    return 'hostel';
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
