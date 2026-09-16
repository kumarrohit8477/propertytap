'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { get_categories, create_property, upload_property_images } from '@/lib/properties/property_service';
import { PropertyCategory, PropertyPurpose } from '@/types/property';
import DashboardSidebar from '@/components/layout/dashboard_sidebar';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
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
  const [bedrooms, set_bedrooms] = useState('');
  const [bathrooms, set_bathrooms] = useState('');
  const [furnishing, set_furnishing] = useState('unfurnished');
  const [image_files, set_image_files] = useState<File[]>([]);

  useEffect(() => {
    async function load_cats() {
      const { categories: data } = await get_categories();
      set_categories(data);
      if (data.length > 0) {
        set_category_id(data[0].id);
      }
    }
    load_cats();
  }, []);

  const handle_image_select = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      set_image_files(Array.from(e.target.files));
    }
  };

  const handle_submit_property = async () => {
    set_loading(true);
    set_error_msg(null);

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
      bedrooms: bedrooms ? Number(bedrooms) : null,
      bathrooms: bathrooms ? Number(bathrooms) : null,
      furnishing,
    });

    if (error || !new_prop) {
      set_error_msg(error?.message || 'Failed to create property.');
      set_loading(false);
      return;
    }

    if (image_files.length > 0) {
      await upload_property_images(new_prop.id, image_files);
    }

    router.push('/dashboard/properties');
    router.refresh();
  };

  return (
    <div className="dashboard_layout_container">
      <DashboardSidebar />

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

          {/* STEP 3: DETAILS */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3>Step 3: Property Location &amp; Details</h3>
              <Input label="Property Title" placeholder="e.g. Spacious 2 BHK Apartment in Agra" value={title} onChange={(e) => set_title(e.target.value)} required />
              <Input label="Price (₹)" type="number" placeholder="e.g. 25000" value={price} onChange={(e) => set_price(e.target.value)} required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input label="City" placeholder="e.g. Agra" value={city} onChange={(e) => set_city(e.target.value)} required />
                <Input label="Locality" placeholder="e.g. Dayalbagh" value={locality} onChange={(e) => set_locality(e.target.value)} required />
              </div>
              <Input label="Address" placeholder="Full address details" value={address} onChange={(e) => set_address(e.target.value)} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <Input label="Area (sqft)" type="number" placeholder="e.g. 1200" value={area} onChange={(e) => set_area(e.target.value)} />
                <Input label="Bedrooms" type="number" placeholder="e.g. 2" value={bedrooms} onChange={(e) => set_bedrooms(e.target.value)} />
                <Input label="Bathrooms" type="number" placeholder="e.g. 2" value={bathrooms} onChange={(e) => set_bathrooms(e.target.value)} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Furnishing Status</label>
                <select style={{ padding: '0.625rem', borderRadius: '8px', border: '1px solid #d1d5db' }} value={furnishing} onChange={(e) => set_furnishing(e.target.value)}>
                  <option value="unfurnished">Unfurnished</option>
                  <option value="semi-furnished">Semi-Furnished</option>
                  <option value="fully-furnished">Fully Furnished</option>
                </select>
              </div>
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
              <input type="file" accept="image/*" multiple onChange={handle_image_select} />
              <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Select multiple images. The first image will be used as the primary card cover image.</p>
              {image_files.length > 0 && (
                <div>
                  <strong>Selected Images: {image_files.length}</strong>
                  <ul>
                    {image_files.map((file, idx) => (
                      <li key={idx} style={{ fontSize: '0.85rem' }}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: REVIEW */}
          {step === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3>Step 5: Review Listing Preview</h3>
              <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{title || 'Untitled Property'}</h4>
                <p style={{ color: '#059669', fontWeight: 800, fontSize: '1.25rem', margin: '0.5rem 0' }}>₹{price || 0} / {purpose}</p>
                <p style={{ color: '#4b5563', margin: 0 }}>📍 {locality}, {city}</p>
                <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '0.5rem' }}>{description}</p>
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
                {loading ? 'Publishing...' : 'Publish Listing (₹0 Free)'}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
