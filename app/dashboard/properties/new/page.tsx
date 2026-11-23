'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { get_categories, create_property, upload_property_images } from '@/lib/properties/property_service';
import { PropertyCategory, PropertyPurpose } from '@/types/property';
import { get_filter_group_for_category } from '@/lib/config/property_filters_config';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import '@/app/dashboard/dashboard.css';
import './new_property.css';

export default function NewPropertyPage() {
  const router = useRouter();
  const [step, set_step] = useState(1);
  const [categories, set_categories] = useState<PropertyCategory[]>([]);
  const [loading, set_loading] = useState(false);
  const [error_msg, set_error_msg] = useState<string | null>(null);

  // Form State
  const [category_id, set_category_id] = useState('');
  const [purpose, set_purpose] = useState<PropertyPurpose>('rent');
  const [title, set_title] = useState('');
  const [description, set_description] = useState('');
  const [price, set_price] = useState('');
  const [city, set_city] = useState('');
  const [locality, set_locality] = useState('');
  const [address, set_address] = useState('');
  const [area, set_area] = useState('');
  const [area_unit, set_area_unit] = useState('sqft');
  const [bedrooms, set_bedrooms] = useState('');
  const [bathrooms, set_bathrooms] = useState('');
  const [furnishing, set_furnishing] = useState('unfurnished');
  const [parking, set_parking] = useState(false);
  const [floor, set_floor] = useState('');

  // PG / Hostel fields
  const [pg_type, set_pg_type] = useState('boys');
  const [sharing_type, set_sharing_type] = useState('single');
  const [food_included, set_food_included] = useState(true);

  // Land fields
  const [land_type, set_land_type] = useState('residential_plot');
  const [facing, set_facing] = useState('north');

  const [image_files, set_image_files] = useState<File[]>([]);
  const [preview_urls, set_preview_urls] = useState<string[]>([]);
  const [loading_status, set_loading_status] = useState('');

  useEffect(() => {
    async function load_cats() {
      const { categories: data } = await get_categories();
      const EXCLUDED_CATEGORIES = ['commercial', 'residential', 'land'];
      const filtered = (data || []).filter((cat) => {
        const slug = (cat.slug || '').toLowerCase().trim();
        const name = (cat.name || '').toLowerCase().trim();
        return !EXCLUDED_CATEGORIES.includes(slug) && !EXCLUDED_CATEGORIES.includes(name);
      });
      set_categories(filtered);
      if (filtered.length > 0) {
        set_category_id(filtered[0].id);
      }
    }
    load_cats();
  }, []);

  const filter_group = get_filter_group_for_category(category_id, categories);

  const handle_image_select = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      set_image_files((prev) => [...prev, ...selected]);
      const urls = selected.map((f) => URL.createObjectURL(f));
      set_preview_urls((prev) => [...prev, ...urls]);
    }
  };

  const handle_remove_image = (index: number) => {
    URL.revokeObjectURL(preview_urls[index]);
    set_image_files((prev) => prev.filter((_, i) => i !== index));
    set_preview_urls((prev) => prev.filter((_, i) => i !== index));
  };

  const handle_submit_property = async () => {
    set_loading(true);
    set_loading_status('Creating property listing...');
    set_error_msg(null);

    const is_residential = filter_group === 'residential' || filter_group === 'all';
    const is_pg_or_hostel = filter_group === 'pg' || filter_group === 'hostel';
    const is_land = filter_group === 'land';
    const is_commercial = filter_group === 'commercial';

    const { data: new_prop, error } = await create_property({
      category_id,
      purpose,
      title,
      description,
      price: Number(price),
      city,
      locality,
      address,
      area: area ? Number(area) : null,
      area_unit: area_unit || 'sqft',
      bedrooms: is_residential && bedrooms ? Number(bedrooms) : null,
      bathrooms: filter_group === 'residential' && bathrooms ? Number(bathrooms) : null,
      furnishing: (is_residential || is_commercial) ? furnishing : null,
      parking: (is_residential || is_commercial) ? parking : null,
      floor: filter_group === 'residential' && floor !== '' ? Number(floor) : null,
      pg_type: is_pg_or_hostel ? pg_type : null,
      sharing_type: is_pg_or_hostel ? sharing_type : null,
      food_included: is_pg_or_hostel ? food_included : null,
      land_type: is_land ? land_type : null,
      facing: is_land ? facing : null,
    });

    if (error || !new_prop) {
      set_error_msg(error?.message || 'Failed to create property.');
      set_loading(false);
      set_loading_status('');
      return;
    }

    if (image_files.length > 0) {
      set_loading_status(`Uploading ${image_files.length} property images...`);
      const { error: upload_err } = await upload_property_images(new_prop.id, image_files);
      if (upload_err) {
        console.error('Image upload issue:', upload_err);
      }
    }

    router.push('/dashboard/properties');
    router.refresh();
  };

  return (
    <div className="dashboard_layout_container">
      <main className="dashboard_main_content">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: 0 }}>
            List Your Property (Free Launch Offer)
          </h1>
          <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>
            Follow our 6-step listing guide to publish your property feed card.
          </p>
        </div>

        <div className="new_property_card">
          <div className="new_property_stepper">
            <span className={`new_property_step_item ${step === 1 ? 'new_property_step_active' : ''}`}>1. Category</span>
            <span className={`new_property_step_item ${step === 2 ? 'new_property_step_active' : ''}`}>2. Purpose</span>
            <span className={`new_property_step_item ${step === 3 ? 'new_property_step_active' : ''}`}>3. Details</span>
            <span className={`new_property_step_item ${step === 4 ? 'new_property_step_active' : ''}`}>4. Images</span>
            <span className={`new_property_step_item ${step === 5 ? 'new_property_step_active' : ''}`}>5. Review</span>
            <span className={`new_property_step_item ${step === 6 ? 'new_property_step_active' : ''}`}>6. Plan</span>
          </div>

          {error_msg && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem' }}>
              {error_msg}
            </div>
          )}

          {/* STEP 1: CATEGORY */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3>Step 1: Select Property Category</h3>
              <div className="new_property_grid_options">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`new_property_option_card ${category_id === cat.id ? 'new_property_option_selected' : ''}`}
                    onClick={() => set_category_id(cat.id)}
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: PURPOSE */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3>Step 2: Select Listing Purpose</h3>
              <div className="new_property_grid_options">
                <div
                  className={`new_property_option_card ${purpose === 'rent' ? 'new_property_option_selected' : ''}`}
                  onClick={() => set_purpose('rent')}
                >
                  🏢 For Rent
                </div>
                <div
                  className={`new_property_option_card ${purpose === 'sale' ? 'new_property_option_selected' : ''}`}
                  onClick={() => set_purpose('sale')}
                >
                  🏡 For Sale
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DETAILS (Context-Aware based on Category) */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3>Step 3: Property Location &amp; Details</h3>
              <Input label="Property Title" placeholder="e.g. Spacious Property Title" value={title} onChange={(e) => set_title(e.target.value)} required />
              <Input
                label={filter_group === 'pg' || filter_group === 'hostel' ? "Monthly Rent (₹)" : "Price (₹)"}
                type="number"
                placeholder="e.g. 25000"
                value={price}
                onChange={(e) => set_price(e.target.value)}
                required
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input label="City" placeholder="e.g. Agra" value={city} onChange={(e) => set_city(e.target.value)} required />
                <Input label="Locality" placeholder="e.g. Dayalbagh" value={locality} onChange={(e) => set_locality(e.target.value)} required />
              </div>

              <Input label="Address" placeholder="Full address details" value={address} onChange={(e) => set_address(e.target.value)} />

              {/* 1. RESIDENTIAL SPECIFIC FIELDS */}
              {(filter_group === 'residential' || filter_group === 'all') && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <Input label="Area (sqft)" type="number" placeholder="e.g. 1200" value={area} onChange={(e) => set_area(e.target.value)} />
                    <Input label="BHK" type="number" placeholder="e.g. 2" value={bedrooms} onChange={(e) => set_bedrooms(e.target.value)} />
                    <Input label="Bathrooms" type="number" placeholder="e.g. 2" value={bathrooms} onChange={(e) => set_bathrooms(e.target.value)} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Furnishing</label>
                      <select style={{ padding: '0.625rem', borderRadius: '8px', border: '1px solid #d1d5db' }} value={furnishing} onChange={(e) => set_furnishing(e.target.value)}>
                        <option value="unfurnished">Unfurnished</option>
                        <option value="semi-furnished">Semi-Furnished</option>
                        <option value="fully-furnished">Fully Furnished</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Parking Available</label>
                      <select style={{ padding: '0.625rem', borderRadius: '8px', border: '1px solid #d1d5db' }} value={parking ? 'true' : 'false'} onChange={(e) => set_parking(e.target.value === 'true')}>
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </div>

                    <Input label="Floor Number" type="number" placeholder="e.g. 2" value={floor} onChange={(e) => set_floor(e.target.value)} />
                  </div>
                </>
              )}

              {/* 2. PG / HOSTEL SPECIFIC FIELDS */}
              {(filter_group === 'pg' || filter_group === 'hostel') && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>{filter_group === 'pg' ? 'PG Type' : 'Hostel Type'}</label>
                    <select style={{ padding: '0.625rem', borderRadius: '8px', border: '1px solid #d1d5db' }} value={pg_type} onChange={(e) => set_pg_type(e.target.value)}>
                      <option value="boys">Boys</option>
                      <option value="girls">Girls</option>
                      <option value="co-living">Co-Living</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Room / Sharing</label>
                    <select style={{ padding: '0.625rem', borderRadius: '8px', border: '1px solid #d1d5db' }} value={sharing_type} onChange={(e) => set_sharing_type(e.target.value)}>
                      <option value="single">Single Room</option>
                      <option value="double">Double Sharing</option>
                      <option value="triple">Triple Sharing</option>
                      <option value="four_plus">4+ Sharing</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Food Included</label>
                    <select style={{ padding: '0.625rem', borderRadius: '8px', border: '1px solid #d1d5db' }} value={food_included ? 'true' : 'false'} onChange={(e) => set_food_included(e.target.value === 'true')}>
                      <option value="true">Food Included</option>
                      <option value="false">Food Not Included</option>
                    </select>
                  </div>
                </div>
              )}

              {/* 3. LAND / PLOT SPECIFIC FIELDS */}
              {filter_group === 'land' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Land Type</label>
                    <select style={{ padding: '0.625rem', borderRadius: '8px', border: '1px solid #d1d5db' }} value={land_type} onChange={(e) => set_land_type(e.target.value)}>
                      <option value="residential_plot">Residential Plot</option>
                      <option value="commercial_plot">Commercial Plot</option>
                      <option value="agricultural_land">Agricultural Land</option>
                    </select>
                  </div>

                  <Input label="Area Value" type="number" placeholder="e.g. 1000" value={area} onChange={(e) => set_area(e.target.value)} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Area Unit</label>
                    <select style={{ padding: '0.625rem', borderRadius: '8px', border: '1px solid #d1d5db' }} value={area_unit} onChange={(e) => set_area_unit(e.target.value)}>
                      <option value="sqft">sq.ft.</option>
                      <option value="sqyd">sq.yd.</option>
                      <option value="sqm">sq.m.</option>
                      <option value="acre">Acre</option>
                      <option value="bigha">Bigha</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Facing Direction</label>
                    <select style={{ padding: '0.625rem', borderRadius: '8px', border: '1px solid #d1d5db' }} value={facing} onChange={(e) => set_facing(e.target.value)}>
                      <option value="north">North</option>
                      <option value="south">South</option>
                      <option value="east">East</option>
                      <option value="west">West</option>
                      <option value="north_east">North-East</option>
                      <option value="north_west">North-West</option>
                      <option value="south_east">South-East</option>
                      <option value="south_west">South-West</option>
                    </select>
                  </div>
                </div>
              )}

              {/* 4. COMMERCIAL SPECIFIC FIELDS */}
              {filter_group === 'commercial' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <Input label="Area (sqft)" type="number" placeholder="e.g. 1500" value={area} onChange={(e) => set_area(e.target.value)} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Furnishing Status</label>
                    <select style={{ padding: '0.625rem', borderRadius: '8px', border: '1px solid #d1d5db' }} value={furnishing} onChange={(e) => set_furnishing(e.target.value)}>
                      <option value="unfurnished">Unfurnished</option>
                      <option value="semi-furnished">Semi-Furnished</option>
                      <option value="fully-furnished">Fully Furnished</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Parking Available</label>
                    <select style={{ padding: '0.625rem', borderRadius: '8px', border: '1px solid #d1d5db' }} value={parking ? 'true' : 'false'} onChange={(e) => set_parking(e.target.value === 'true')}>
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Description</label>
                <textarea style={{ padding: '0.625rem', borderRadius: '8px', border: '1px solid #d1d5db', minHeight: '100px', fontFamily: 'inherit' }} placeholder="Provide key highlights of your property..." value={description} onChange={(e) => set_description(e.target.value)} />
              </div>
            </div>
          )}

          {/* STEP 4: IMAGES */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3>Step 4: Upload Property Images</h3>

              <label className="image_upload_dropzone">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  multiple
                  onChange={handle_image_select}
                  style={{ display: 'none' }}
                />
                <span style={{ fontSize: '2.25rem' }}>📸</span>
                <span style={{ fontWeight: 700, color: '#1f2937', fontSize: '1rem' }}>
                  Click to select property photos
                </span>
                <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                  Supports PNG, JPG, WEBP or GIF (Select one or multiple)
                </span>
              </label>

              <p style={{ fontSize: '0.85rem', color: '#4b5563', margin: 0, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.6rem 0.85rem', borderRadius: '6px' }}>
                💡 <strong>Tip:</strong> The first image with the &quot;COVER&quot; badge will be used as the primary card image shown in search results and property listings.
              </p>

              {preview_urls.length > 0 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '0.95rem' }}>Selected Photos ({preview_urls.length})</strong>
                    <button
                      type="button"
                      onClick={() => {
                        preview_urls.forEach((u) => URL.revokeObjectURL(u));
                        set_image_files([]);
                        set_preview_urls([]);
                      }}
                      style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="image_preview_grid">
                    {preview_urls.map((url, idx) => (
                      <div
                        key={idx}
                        className={`image_preview_item ${idx === 0 ? 'is_primary' : ''}`}
                      >
                        <img src={url} alt={`Preview ${idx + 1}`} className="image_preview_thumb" />
                        {idx === 0 && <span className="image_preview_badge">Cover</span>}
                        <button
                          type="button"
                          className="image_preview_remove"
                          onClick={() => handle_remove_image(idx)}
                          title="Remove photo"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: REVIEW */}
          {step === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3>Step 5: Review Listing Preview</h3>
              <div className="review_card_preview">
                {preview_urls.length > 0 ? (
                  <img
                    src={preview_urls[0]}
                    alt="Cover preview"
                    className="review_image_thumb"
                  />
                ) : (
                  <div style={{ width: '180px', height: '140px', backgroundColor: '#f3f4f6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '0.8rem', flexShrink: 0 }}>
                    <span style={{ fontSize: '1.5rem' }}>🖼️</span>
                    <span>No image selected</span>
                  </div>
                )}
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#111827' }}>{title || 'Untitled Property'}</h4>
                  <p style={{ color: '#059669', fontWeight: 800, fontSize: '1.25rem', margin: '0.35rem 0' }}>
                    ₹{price || 0} / {purpose}
                  </p>
                  <p style={{ color: '#4b5563', margin: 0, fontSize: '0.9rem' }}>📍 {locality || 'Locality'}, {city || 'City'}</p>
                  {description && (
                    <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.5rem', maxHeight: '48px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: PAYMENT / PLAN */}
          {step === 6 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3>Step 6: Listing Plan &amp; Discount</h3>
              <div style={{ padding: '1.5rem', backgroundColor: '#ecfdf5', border: '2px solid #10b981', borderRadius: '12px', textAlign: 'center' }}>
                <span style={{ backgroundColor: '#059669', color: '#ffffff', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>100% LAUNCH DISCOUNT</span>
                <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>Listing Fee: ₹0</h2>
                <p style={{ color: '#047857' }}>Enjoy free listing during our initial launch period. No hidden fees or brokerage charges!</p>
              </div>
            </div>
          )}

          <div className="new_property_actions_bar">
            {step > 1 ? (
              <Button variant="secondary" onClick={() => set_step(step - 1)}>
                &larr; Back
              </Button>
            ) : <div />}

            {step < 6 ? (
              <Button variant="primary" onClick={() => set_step(step + 1)}>
                Next Step &rarr;
              </Button>
            ) : (
              <Button variant="primary" disabled={loading} onClick={handle_submit_property}>
                {loading ? (loading_status || 'Publishing...') : 'Publish Listing (₹0 Free)'}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
