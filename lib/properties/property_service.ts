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

export async function upload_property_images(
  property_id: string,
  files: File[],
  options?: { start_order?: number; has_existing_primary?: boolean }
) {
  const supabase = create_client();
  const { data: user_data } = await supabase.auth.getUser();
  if (!user_data.user) {
    return { images: [], error: new Error('User not authenticated') };
  }

  // 1. Ownership check: Only owner or admin can upload
  const { data: property, error: prop_error } = await supabase
    .from('properties')
    .select('owner_id')
    .eq('id', property_id)
    .single();

  if (prop_error || !property) {
    return { images: [], error: new Error('Property listing not found') };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user_data.user.id)
    .single();

  if (property.owner_id !== user_data.user.id && profile?.role !== 'admin') {
    return { images: [], error: new Error('Access denied: Only the property owner can upload pictures.') };
  }

  // 2. Strict limit: Up to 10 photos total
  const { count } = await supabase
    .from('property_images')
    .select('*', { count: 'exact', head: true })
    .eq('property_id', property_id);

  const existing_count = count || 0;
  if (existing_count >= 10) {
    return { images: [], error: new Error('Maximum limit of 10 photos reached for this property.') };
  }

  const remaining_slots = 10 - existing_count;
  const files_to_upload = files.slice(0, remaining_slots);

  const uploaded_images: any[] = [];
  const errors: string[] = [];
  const start_order = options?.start_order ?? existing_count;
  const has_existing_primary = options?.has_existing_primary ?? (existing_count > 0);

  for (let i = 0; i < files_to_upload.length; i++) {
    const file = files_to_upload[i];
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

    const is_primary = !has_existing_primary && i === 0;

    const { data: db_image, error: db_error } = await supabase
      .from('property_images')
      .insert({
        property_id,
        image_url: public_url_data.publicUrl,
        storage_path: upload_data.path,
        sort_order: start_order + i,
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

export async function delete_property_image(image_id: string, property_id: string, storage_path?: string | null) {
  const supabase = create_client();
  const { data: user_data } = await supabase.auth.getUser();
  if (!user_data.user) {
    return { success: false, error: new Error('User not authenticated') };
  }

  // Ownership check: Only owner or admin can delete
  const { data: property } = await supabase
    .from('properties')
    .select('owner_id')
    .eq('id', property_id)
    .single();

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user_data.user.id)
    .single();

  if (!property || (property.owner_id !== user_data.user.id && profile?.role !== 'admin')) {
    return { success: false, error: new Error('Access denied: Only the property owner can delete pictures.') };
  }

  if (storage_path) {
    try {
      await supabase.storage.from('property_images').remove([storage_path]);
    } catch (err) {
      console.warn('Storage deletion failed, continuing with DB record deletion', err);
    }
  }

  const { error } = await supabase
    .from('property_images')
    .delete()
    .eq('id', image_id);

  if (error) {
    return { success: false, error };
  }

  // Ensure there is always a primary image if images remain
  const { data: remaining } = await supabase
    .from('property_images')
    .select('id, is_primary')
    .eq('property_id', property_id)
    .order('sort_order', { ascending: true });

  if (remaining && remaining.length > 0) {
    const has_primary = remaining.some((img) => img.is_primary);
    if (!has_primary) {
      await supabase
        .from('property_images')
        .update({ is_primary: true })
        .eq('id', remaining[0].id);
    }
  }

  return { success: true, error: null };
}

export async function set_primary_property_image(property_id: string, image_id: string) {
  const supabase = create_client();
  const { data: user_data } = await supabase.auth.getUser();
  if (!user_data.user) {
    return { success: false, error: new Error('User not authenticated') };
  }

  // Ownership check: Only owner or admin can update cover
  const { data: property } = await supabase
    .from('properties')
    .select('owner_id')
    .eq('id', property_id)
    .single();

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user_data.user.id)
    .single();

  if (!property || (property.owner_id !== user_data.user.id && profile?.role !== 'admin')) {
    return { success: false, error: new Error('Access denied: Only the property owner can update pictures.') };
  }

  await supabase
    .from('property_images')
    .update({ is_primary: false })
    .eq('property_id', property_id);

  const { error } = await supabase
    .from('property_images')
    .update({ is_primary: true })
    .eq('id', image_id);

  return { success: !error, error };
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
