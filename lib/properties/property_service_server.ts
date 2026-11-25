import { create_client } from '@/lib/supabase/client';
import { PropertyFilterParams, PropertyItem, PropertyCategory } from '@/types/property';
import { get_category_ids_for_filter } from '@/lib/config/property_filters_config';

export async function get_properties_server(params: PropertyFilterParams = {}) {
  const supabase = create_client();
  let query = supabase
    .from('properties')
    .select(`
      *,
      category:property_categories(*),
      images:property_images(*),
      owner:profiles(id, full_name, display_name, profile_type, avatar_url, phone)
    `)
    .eq('status', 'active');

  if (params.query) {
    query = query.or(
      `title.ilike.%${params.query}%,city.ilike.%${params.query}%,locality.ilike.%${params.query}%`
    );
  }
  if (params.city) query = query.ilike('city', `%${params.city}%`);
  if (params.locality) query = query.ilike('locality', `%${params.locality}%`);
  
  if (params.category_ids && params.category_ids.length > 0) {
    query = query.in('category_id', params.category_ids);
  } else if (params.category_id && params.category_id !== 'all') {
    const { data: all_cats } = await supabase
      .from('property_categories')
      .select('*')
      .eq('is_active', true);
    
    const cat_ids = get_category_ids_for_filter(params.category_id, (all_cats as PropertyCategory[]) || []);

    if (cat_ids.length > 1) {
      query = query.in('category_id', cat_ids);
    } else if (cat_ids.length === 1) {
      query = query.eq('category_id', cat_ids[0]);
    } else {
      query = query.eq('category_id', params.category_id);
    }
  }
  if (params.purpose) query = query.eq('purpose', params.purpose);
  if (params.min_price !== undefined) query = query.gte('price', params.min_price);
  if (params.max_price !== undefined) query = query.lte('price', params.max_price);
  if (params.bedrooms !== undefined) query = query.gte('bedrooms', params.bedrooms);
  if (params.bathrooms !== undefined) query = query.gte('bathrooms', params.bathrooms);
  if (params.furnishing) query = query.eq('furnishing', params.furnishing);
  if (params.parking !== undefined) query = query.eq('parking', params.parking);
  if (params.floor !== undefined) query = query.eq('floor', params.floor);
  if (params.pg_type) query = query.eq('pg_type', params.pg_type);
  if (params.sharing_type) query = query.eq('sharing_type', params.sharing_type);
  if (params.food_included !== undefined) query = query.eq('food_included', params.food_included);
  if (params.land_type) query = query.eq('land_type', params.land_type);
  if (params.facing) query = query.eq('facing', params.facing);
  if (params.min_area !== undefined) query = query.gte('area', params.min_area);
  if (params.max_area !== undefined) query = query.lte('area', params.max_area);

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
  const supabase = create_client();
  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      category:property_categories(*),
      images:property_images(*),
      owner:profiles(id, full_name, display_name, profile_type, avatar_url, phone)
    `)
    .eq('id', id)
    .single();

  return { property: data as PropertyItem | null, error };
}

export async function get_categories_server() {
  const supabase = create_client();
  const { data, error } = await supabase
    .from('property_categories')
    .select('*')
    .eq('is_active', true)
    .order('name');

  return { categories: (data as PropertyCategory[]) || [], error };
}
