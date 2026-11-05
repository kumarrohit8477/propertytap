import { create_client } from '@/lib/supabase/client';
import { PropertyFilterParams, PropertyItem, PropertyCategory } from '@/types/property';
import { get_category_ids_for_filter } from '@/lib/config/property_filters_config';

export async function get_properties(params: PropertyFilterParams = {}) {
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
    query = query.or(`title.ilike.%${params.query}%,city.ilike.%${params.query}%,locality.ilike.%${params.query}%`);
  }

  if (params.city) {
    query = query.ilike('city', `%${params.city}%`);
  }

  if (params.locality) {
    query = query.ilike('locality', `%${params.locality}%`);
  }

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

  if (params.purpose) {
    query = query.eq('purpose', params.purpose);
  }

  if (params.min_price !== undefined) {
    query = query.gte('price', params.min_price);
  }

  if (params.max_price !== undefined) {
    query = query.lte('price', params.max_price);
  }

  if (params.bedrooms !== undefined) {
    query = query.gte('bedrooms', params.bedrooms);
  }

  if (params.bathrooms !== undefined) {
    query = query.gte('bathrooms', params.bathrooms);
  }

  if (params.furnishing) {
    query = query.eq('furnishing', params.furnishing);
  }

  if (params.parking !== undefined) {
    query = query.eq('parking', params.parking);
  }

  if (params.floor !== undefined) {
    query = query.eq('floor', params.floor);
  }

  if (params.pg_type) {
    query = query.eq('pg_type', params.pg_type);
  }

  if (params.sharing_type) {
    query = query.eq('sharing_type', params.sharing_type);
  }

  if (params.food_included !== undefined) {
    query = query.eq('food_included', params.food_included);
  }

  if (params.land_type) {
    query = query.eq('land_type', params.land_type);
  }

  if (params.facing) {
    query = query.eq('facing', params.facing);
  }

  if (params.min_area !== undefined) {
    query = query.gte('area', params.min_area);
  }

  if (params.max_area !== undefined) {
    query = query.lte('area', params.max_area);
  }

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

export async function get_property_by_id(id: string) {
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

export async function create_property(payload: Partial<PropertyItem>) {
  const supabase = create_client();
  const { data: user_data } = await supabase.auth.getUser();
  if (!user_data.user) {
    return { data: null, error: new Error('User not authenticated') };
  }

  const { data, error } = await supabase
    .from('properties')
    .insert({
      owner_id: user_data.user.id,
      category_id: payload.category_id,
      title: payload.title,
      description: payload.description,
      purpose: payload.purpose,
      price: payload.price,
      price_period: payload.price_period || 'month',
      city: payload.city,
      locality: payload.locality,
      address: payload.address,
      area: payload.area,
      area_unit: payload.area_unit || 'sqft',
      bedrooms: payload.bedrooms,
      bathrooms: payload.bathrooms,
      furnishing: payload.furnishing,
      pg_type: payload.pg_type,
      sharing_type: payload.sharing_type,
      food_included: payload.food_included,
      land_type: payload.land_type,
      facing: payload.facing,
      parking: payload.parking,
      floor: payload.floor,
      status: 'active',
    })
    .select()
    .single();

  if (error || !data) {
    return { data: null, error };
  }

  // Create initial listing record under launch special plan (₹0)
  const { data: plan } = await supabase
    .from('listing_plans')
    .select('id, duration_days')
    .eq('is_active', true)
    .single();

  if (plan) {
    const expiry_date = new Date();
    expiry_date.setDate(expiry_date.getDate() + (plan.duration_days || 30));

    await supabase.from('property_listings').insert({
      property_id: data.id,
      plan_id: plan.id,
      expiry_date: expiry_date.toISOString(),
      amount: 0.00,
      payment_status: 'completed',
      listing_status: 'active',
    });

    await supabase.from('payments').insert({
      user_id: user_data.user.id,
      property_id: data.id,
      amount: 0.00,
      currency: 'INR',
      provider: 'launch_discount',
      transaction_id: `LAUNCH_FREE_${Date.now()}`,
      status: 'completed',
    });
  }

  return { data: data as PropertyItem, error: null };
}

export async function upload_property_images(property_id: string, files: File[]) {
  const supabase = create_client();
  const uploaded_images: any[] = [];
  const errors: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const file_ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const file_name = `${property_id}/${Date.now()}_${i}.${file_ext}`;

    const { data: upload_data, error: upload_error } = await supabase.storage
      .from('property_images')
      .upload(file_name, file, { 
        contentType: file.type || undefined,
        upsert: true 
      });

    if (upload_error || !upload_data) {
      console.error('Storage upload error for file', file.name, upload_error);
      errors.push(upload_error?.message || `Failed to upload ${file.name}`);
      continue;
    }

    const { data: public_url_data } = supabase.storage
      .from('property_images')
      .getPublicUrl(upload_data.path);

    const is_primary = i === 0;

    const { data: db_image, error: db_error } = await supabase
      .from('property_images')
      .insert({
        property_id,
        image_url: public_url_data.publicUrl,
        storage_path: upload_data.path,
        sort_order: i,
        is_primary,
      })
      .select()
      .single();

    if (db_error) {
      console.error('DB insert error for image', file.name, db_error);
      errors.push(db_error.message);
    } else if (db_image) {
      uploaded_images.push(db_image);
    }
  }

  return {
    images: uploaded_images,
    error: errors.length > 0 ? new Error(errors.join('; ')) : null,
  };
}

export async function get_categories() {
  const supabase = create_client();
  const { data, error } = await supabase
    .from('property_categories')
    .select('*')
    .eq('is_active', true)
    .order('name');

  return { categories: (data as PropertyCategory[]) || [], error };
}

export async function show_interest(property_id: string, owner_id: string) {
  const supabase = create_client();
  const { data: user_data } = await supabase.auth.getUser();

  if (!user_data.user) {
    return { data: null, error: new Error('Please login to show interest.') };
  }

  if (user_data.user.id === owner_id) {
    return { data: null, error: new Error('You cannot show interest in your own property.') };
  }

  const { data, error } = await supabase
    .from('interests')
    .insert({
      property_id,
      interested_user_id: user_data.user.id,
      owner_id,
      status: 'active',
    })
    .select()
    .single();

  return { data, error };
}

export async function get_user_my_properties() {
  const supabase = create_client();
  const { data: user_data } = await supabase.auth.getUser();
  if (!user_data.user) return { properties: [], error: new Error('Not authenticated') };

  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      category:property_categories(*),
      images:property_images(*),
      interests:interests(count)
    `)
    .eq('owner_id', user_data.user.id)
    .order('created_at', { ascending: false });

  return { properties: data || [], error };
}
