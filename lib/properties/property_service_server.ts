import { create_server_client } from '@/lib/supabase/server';
import { PropertyFilterParams, PropertyItem, PropertyCategory } from '@/types/property';

export async function get_properties_server(params: PropertyFilterParams = {}) {
  const supabase = create_server_client();
  let query = supabase
    .from('properties')
    .select(`
      *,
      category:property_categories(*),
      images:property_images(*),
      owner:profiles(id, full_name, avatar_url)
    `)
    .eq('status', 'active');

  if (params.query) {
    query = query.or(
      `title.ilike.%${params.query}%,city.ilike.%${params.query}%,locality.ilike.%${params.query}%`
    );
  }
  if (params.city) query = query.ilike('city', `%${params.city}%`);
  if (params.locality) query = query.ilike('locality', `%${params.locality}%`);
  if (params.category_id) query = query.eq('category_id', params.category_id);
  if (params.purpose) query = query.eq('purpose', params.purpose);
  if (params.min_price !== undefined) query = query.gte('price', params.min_price);
  if (params.max_price !== undefined) query = query.lte('price', params.max_price);
  if (params.bedrooms !== undefined) query = query.gte('bedrooms', params.bedrooms);
  if (params.furnishing) query = query.eq('furnishing', params.furnishing);

  if (params.sort_by === 'price_asc') {
    query = query.order('price', { ascending: true });
  } else if (params.sort_by === 'price_desc') {
    query = query.order('price', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const page = params.page || 1;
  const limit = params.limit || 12;
  const start = (page - 1) * limit;
  const end = start + limit - 1;
  query = query.range(start, end);

  const { data, error, count } = await query;
  return { properties: (data as PropertyItem[]) || [], error, count };
}

export async function get_property_by_id_server(id: string) {
  const supabase = create_server_client();
  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      category:property_categories(*),
      images:property_images(*),
      owner:profiles(id, full_name, avatar_url)
    `)
    .eq('id', id)
    .single();

  return { property: data as PropertyItem | null, error };
}

export async function get_categories_server() {
  const supabase = create_server_client();
  const { data, error } = await supabase
    .from('property_categories')
    .select('*')
    .eq('is_active', true)
    .order('name');

  return { categories: (data as PropertyCategory[]) || [], error };
}
