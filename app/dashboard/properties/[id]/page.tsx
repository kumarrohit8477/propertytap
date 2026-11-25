'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  get_property_by_id,
  upload_property_images,
  delete_property_image,
  set_primary_property_image,
} from '@/lib/properties/property_service';
import { create_client } from '@/lib/supabase/client';
import { use_auth } from '@/hooks/use_auth';
import { PropertyImage, PropertyItem } from '@/types/property';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import {
  ArrowLeft,
  Upload,
  Trash2,
  Star,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import '@/app/dashboard/dashboard.css';
import './property_edit.css';

const MAX_IMAGES = 10;

export default function PropertyEditPage() {
  const params = useParams();
  const router = useRouter();
  const { user, is_admin, loading: auth_loading } = use_auth();
  const property_id = params?.id as string;
  const file_input_ref = useRef<HTMLInputElement>(null);

  const [loading, set_loading] = useState(true);
  const [saving, set_saving] = useState(false);
  const [property, set_property] = useState<PropertyItem | null>(null);

  // Form State
  const [title, set_title] = useState('');
  const [price, set_price] = useState('');
  const [purpose, set_purpose] = useState<'rent' | 'sale'>('rent');
  const [description, set_description] = useState('');
  const [city, set_city] = useState('');
  const [locality, set_locality] = useState('');
  const [address, set_address] = useState('');
  const [bedrooms, set_bedrooms] = useState('');
  const [bathrooms, set_bathrooms] = useState('');
  const [area, set_area] = useState('');
  const [area_unit, set_area_unit] = useState('sqft');
  const [furnishing, set_furnishing] = useState('unfurnished');
  const [parking, set_parking] = useState(false);

  // Images State
  const [images, set_images] = useState<PropertyImage[]>([]);
  const [uploading_images, set_uploading_images] = useState(false);
  const [action_image_id, set_action_image_id] = useState<string | null>(null);
  const [status_msg, set_status_msg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function load() {
      if (!property_id) return;
      const { property: data, error } = await get_property_by_id(property_id);
      if (error || !data) {
        set_status_msg({ type: 'error', text: 'Property could not be found or loaded.' });
        set_loading(false);
        return;
      }

      set_property(data);
      set_title(data.title);
      set_price(String(data.price));
      set_purpose(data.purpose || 'rent');
      set_description(data.description || '');
      set_city(data.city || '');
      set_locality(data.locality || '');
      set_address(data.address || '');
      set_bedrooms(data.bedrooms !== null && data.bedrooms !== undefined ? String(data.bedrooms) : '');
      set_bathrooms(data.bathrooms !== null && data.bathrooms !== undefined ? String(data.bathrooms) : '');
      set_area(data.area ? String(data.area) : '');
      set_area_unit(data.area_unit || 'sqft');
      set_furnishing(data.furnishing || 'unfurnished');
      set_parking(Boolean(data.parking));
      set_images((data.images || []).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)));
      set_loading(false);
    }
    load();
  }, [property_id]);

  // Check authorization
  const is_owner = user && property && (user.id === property.owner_id || is_admin);

  const handle_image_select = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    const remaining_slots = MAX_IMAGES - images.length;

    if (remaining_slots <= 0) {
      set_status_msg({ type: 'error', text: `Maximum limit of ${MAX_IMAGES} images reached.` });
      return;
    }

    const files_to_upload = files.slice(0, remaining_slots);
    set_uploading_images(true);
    set_status_msg(null);

    const has_existing_primary = images.some((img) => img.is_primary);
    const { images: new_images, error } = await upload_property_images(property_id, files_to_upload, {
      start_order: images.length,
      has_existing_primary,
    });

    if (error) {
      set_status_msg({ type: 'error', text: `Error uploading images: ${error.message}` });
    } else if (new_images && new_images.length > 0) {
      set_images((prev) => [...prev, ...new_images]);
      set_status_msg({ type: 'success', text: `Successfully uploaded ${new_images.length} new photo(s).` });
    }

    set_uploading_images(false);
    if (file_input_ref.current) {
      file_input_ref.current.value = '';
    }
  };

  const handle_set_primary = async (image_id: string) => {
    set_action_image_id(image_id);
    set_status_msg(null);

    const { success, error } = await set_primary_property_image(property_id, image_id);

    if (success) {
      set_images((prev) =>
        prev.map((img) => ({
          ...img,
          is_primary: img.id === image_id,
        }))
      );
      set_status_msg({ type: 'success', text: 'Cover photo updated successfully.' });
    } else {
      set_status_msg({ type: 'error', text: `Failed to set cover photo: ${error?.message || 'Unknown error'}` });
    }

    set_action_image_id(null);
  };

  const handle_delete_image = async (image: PropertyImage) => {
    const confirmed = window.confirm('Are you sure you want to delete this property photo?');
    if (!confirmed) return;

    set_action_image_id(image.id);
    set_status_msg(null);

    const { success, error } = await delete_property_image(image.id, property_id, image.storage_path);

    if (success) {
      set_images((prev) => {
        const filtered = prev.filter((img) => img.id !== image.id);
        // If deleted was primary and photos remain, the first one becomes primary
        if (image.is_primary && filtered.length > 0) {
          filtered[0].is_primary = true;
        }
        return filtered;
      });
      set_status_msg({ type: 'success', text: 'Photo deleted successfully.' });
    } else {
      set_status_msg({ type: 'error', text: `Failed to delete photo: ${error?.message || 'Unknown error'}` });
    }

    set_action_image_id(null);
  };

  const handle_save = async (e: React.FormEvent) => {
    e.preventDefault();
    set_saving(true);
    set_status_msg(null);

    const supabase = create_client();
    const { error } = await supabase
      .from('properties')
      .update({
        title: title.trim().toUpperCase(),
        price: Number(price),
        purpose,
        description,
        city: city.trim(),
        locality: locality.trim(),
        address: address.trim(),
        bedrooms: bedrooms ? Number(bedrooms) : null,
        bathrooms: bathrooms ? Number(bathrooms) : null,
        area: area ? Number(area) : null,
        area_unit,
        furnishing,
        parking,
        updated_at: new Date().toISOString(),
      })
      .eq('id', property_id);

    set_saving(false);

    if (error) {
      set_status_msg({ type: 'error', text: `Failed to save changes: ${error.message}` });
    } else {
      set_status_msg({ type: 'success', text: 'Property details updated successfully.' });
      setTimeout(() => {
        router.push('/dashboard/properties');
        router.refresh();
      }, 1000);
    }
  };

  if (loading || auth_loading) {
    return (
      <div className="dashboard_layout_container">
        <main className="dashboard_main_content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '2rem 0' }}>
            <Loader2 size={24} className="animate-spin" />
            <h3 style={{ margin: 0 }}>Loading property details...</h3>
          </div>
        </main>
      </div>
    );
  }

  if (property && !is_owner) {
    return (
      <div className="dashboard_layout_container">
        <main className="dashboard_main_content">
          <div className="property_edit_card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <AlertCircle size={40} color="#dc2626" style={{ margin: '0 auto 1rem' }} />
            <h2>Access Denied</h2>
            <p style={{ color: '#6b7280', margin: '0.5rem 0 1.5rem' }}>
              You do not have permission to edit this property listing.
            </p>
            <Link href="/dashboard/properties">
              <Button variant="primary">Back to My Properties</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard_layout_container">
      <main className="dashboard_main_content">
        <div className="property_edit_container">
          {/* Header */}
          <div className="property_edit_header">
            <div>
              <button
                type="button"
                onClick={() => router.push('/dashboard/properties')}
                className="property_edit_back_btn"
              >
                <ArrowLeft size={16} />
                <span>Back to My Properties</span>
              </button>
              <h1 className="property_edit_title" style={{ marginTop: '0.25rem' }}>
                Edit Property Listing
              </h1>
            </div>
            <Link href={`/properties/${property_id}`} target="_blank">
              <Button variant="outline">
                View Public Listing ↗
              </Button>
            </Link>
          </div>

          {/* Status Message */}
          {status_msg && (
            <div className={`property_edit_alert ${status_msg.type}`}>
              {status_msg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{status_msg.text}</span>
            </div>
          )}

          {/* ── PICTURE MANAGEMENT SECTION ───────────── */}
          <section className="property_edit_card">
            <div className="property_edit_section_title">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ImageIcon size={20} color="#2563eb" />
                Property Photos
              </span>
              <span className="property_edit_count_pill">
                {images.length} / {MAX_IMAGES} Photos
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '-0.5rem 0 0.5rem' }}>
              Upload, reorder cover photo, or delete photos for this property. High quality photos attract more buyers and tenants.
            </p>

            {/* Current Pictures Grid */}
            {images.length > 0 ? (
              <div className="pictures_grid">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className={`picture_card ${img.is_primary ? 'is_primary' : ''}`}
                  >
                    <img
                      src={img.image_url}
                      alt="Property"
                      className="picture_img"
                      loading="lazy"
                    />

                    {img.is_primary && (
                      <div className="picture_primary_badge">
                        <Star size={12} fill="#ffffff" />
                        <span>Cover Photo</span>
                      </div>
                    )}

                    <div className="picture_actions_overlay">
                      <div className="picture_top_actions">
                        <button
                          type="button"
                          onClick={() => handle_delete_image(img)}
                          disabled={action_image_id === img.id}
                          className="picture_btn_delete"
                          title="Delete photo"
                        >
                          {action_image_id === img.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>

                      <div className="picture_bottom_actions">
                        {!img.is_primary && (
                          <button
                            type="button"
                            onClick={() => handle_set_primary(img.id)}
                            disabled={action_image_id === img.id}
                            className="picture_btn_primary"
                          >
                            <Star size={12} />
                            <span>Set as Cover</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f9fafb', borderRadius: '8px' }}>
                <p style={{ color: '#6b7280', margin: 0 }}>No photos uploaded for this property yet.</p>
              </div>
            )}

            {/* Upload Area */}
            {images.length < MAX_IMAGES && (
              <>
                <input
                  ref={file_input_ref}
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  style={{ display: 'none' }}
                  onChange={handle_image_select}
                />
                <div
                  className="pictures_upload_dropzone"
                  onClick={() => file_input_ref.current?.click()}
                >
                  <div className="pictures_upload_icon_wrap">
                    {uploading_images ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : (
                      <Upload size={24} />
                    )}
                  </div>
                  <div>
                    <div className="pictures_upload_title">
                      {uploading_images
                        ? 'Uploading photos, please wait...'
                        : 'Click to upload more photos'}
                    </div>
                    <div className="pictures_upload_subtitle">
                      PNG, JPG or WEBP (Max 10 MB per photo) • Up to {MAX_IMAGES - images.length} more allowed
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* ── PROPERTY DETAILS SECTION ─────────────── */}
          <form className="property_edit_card" onSubmit={handle_save}>
            <div className="property_edit_section_title">
              Property Details
            </div>

            <div className="property_edit_grid_2col">
              <Input
                label="Property Title"
                value={title}
                onChange={(e) => set_title(e.target.value)}
                placeholder="e.g. LUXURY 3 BHK APARTMENT IN SECTOR 62"
                required
              />
              <Input
                label="Price (₹)"
                type="number"
                value={price}
                onChange={(e) => set_price(e.target.value)}
                placeholder="e.g. 25000"
                required
              />
            </div>

            <div className="property_edit_grid_2col">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Purpose</label>
                <select
                  value={purpose}
                  onChange={(e) => set_purpose(e.target.value as 'rent' | 'sale')}
                  style={{
                    padding: '0.625rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem',
                  }}
                >
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Furnishing</label>
                <select
                  value={furnishing}
                  onChange={(e) => set_furnishing(e.target.value)}
                  style={{
                    padding: '0.625rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem',
                  }}
                >
                  <option value="unfurnished">Unfurnished</option>
                  <option value="semi-furnished">Semi-Furnished</option>
                  <option value="furnished">Furnished</option>
                </select>
              </div>
            </div>

            <div className="property_edit_grid_2col">
              <Input
                label="Bedrooms (BHK)"
                type="number"
                value={bedrooms}
                onChange={(e) => set_bedrooms(e.target.value)}
                placeholder="e.g. 2, 3"
              />
              <Input
                label="Bathrooms"
                type="number"
                value={bathrooms}
                onChange={(e) => set_bathrooms(e.target.value)}
                placeholder="e.g. 2"
              />
            </div>

            <div className="property_edit_grid_2col">
              <Input
                label="Super Built-up Area"
                type="number"
                value={area}
                onChange={(e) => set_area(e.target.value)}
                placeholder="e.g. 1200"
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Area Unit</label>
                <select
                  value={area_unit}
                  onChange={(e) => set_area_unit(e.target.value)}
                  style={{
                    padding: '0.625rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem',
                  }}
                >
                  <option value="sqft">Sq. Ft.</option>
                  <option value="sqyd">Sq. Yards</option>
                  <option value="sqm">Sq. Meters</option>
                  <option value="acre">Acres</option>
                </select>
              </div>
            </div>

            <div className="property_edit_grid_2col">
              <Input
                label="City"
                value={city}
                onChange={(e) => set_city(e.target.value)}
                placeholder="e.g. Noida, Delhi, Lucknow"
                required
              />
              <Input
                label="Locality / Sector"
                value={locality}
                onChange={(e) => set_locality(e.target.value)}
                placeholder="e.g. Sector 62, Indira Nagar"
                required
              />
            </div>

            <Input
              label="Full Address / Landmark"
              value={address}
              onChange={(e) => set_address(e.target.value)}
              placeholder="e.g. Flat 402, Tower B, Green Valley Apartments"
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
              <input
                id="parking_check"
                type="checkbox"
                checked={parking}
                onChange={(e) => set_parking(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="parking_check" style={{ fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                Dedicated Parking Available
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Description</label>
              <textarea
                style={{
                  padding: '0.625rem',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  minHeight: '130px',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                }}
                value={description}
                onChange={(e) => set_description(e.target.value)}
                placeholder="Describe your property, nearby amenities, key highlights, etc."
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <Button
                variant="secondary"
                type="button"
                onClick={() => router.push('/dashboard/properties')}
              >
                Cancel
              </Button>
              <Button variant="primary" disabled={saving} type="submit">
                {saving ? 'Saving Changes...' : 'Save All Changes'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
