'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowRight } from 'react-icons/fi';
import './home_property_types.css';

export default function HomePropertyTypes() {
  const router = useRouter();

  return (
    <section className="home_feed_section">
      <div className="home_type_header">
        <h2 className="home_feed_title">Browse by Property Type</h2>
        <p className="home_feed_subtitle">Find the perfect property, whatever your need.</p>
      </div>

      <div className="home_type_grid">
        {/* House */}
        <div type="button" className="home_type_card" onClick={() => router.push('/search?q=house')}>
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80" alt="House" className="home_type_img" />
          <div className="home_type_content">
            <span className="home_type_label">House</span>
            <div className="home_type_arrow">
              <FiArrowRight size={18} />
            </div>
          </div>
        </div>

        {/* Flat / Apartment */}
        <div className="home_type_card" onClick={() => router.push('/search?q=flat')}>
          <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80" alt="Flat" className="home_type_img" />
          <div className="home_type_content">
            <span className="home_type_label">Flat / Apartment</span>
            <div className="home_type_arrow">
              <FiArrowRight size={18} />
            </div>
          </div>
        </div>

        {/* PG / Hostel */}
        <div className="home_type_card" onClick={() => router.push('/search?q=pg')}>
          <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80" alt="PG" className="home_type_img" />
          <div className="home_type_content">
            <span className="home_type_label">PG / Hostel</span>
            <div className="home_type_arrow">
              <FiArrowRight size={18} />
            </div>
          </div>
        </div>

        {/* Villa */}
        <div className="home_type_card" onClick={() => router.push('/search?q=villa')}>
          <img src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80" alt="Villa" className="home_type_img" />
          <div className="home_type_content">
            <span className="home_type_label">Villa</span>
            <div className="home_type_arrow">
              <FiArrowRight size={18} />
            </div>
          </div>
        </div>

        {/* Land & Plots */}
        <div className="home_type_card" onClick={() => router.push('/search?q=land')}>
          <img src="https://media.onthemarket.co.in/Media/PropertyFiles/2618/uobbcf/600x959_11_ffffff_1_90_7c0c153c-e2d1-435a-822c-7891310338cc.jpeg" alt="Land & Plot" className="home_type_img" />
          <div className="home_type_content">
            <span className="home_type_label">Land &amp; Plots</span>
            <div className="home_type_arrow">
              <FiArrowRight size={18} />
            </div>
          </div>
        </div>

        {/* Office Spaces */}
        <div className="home_type_card" onClick={() => router.push('/search?q=office')}>
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" alt="Office Space" className="home_type_img" />
          <div className="home_type_content">
            <span className="home_type_label">Office Spaces</span>
            <div className="home_type_arrow">
              <FiArrowRight size={18} />
            </div>
          </div>
        </div>

        {/* Shop & Showroom */}
        <div className="home_type_card" onClick={() => router.push('/search?q=shop')}>
          <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80" alt="Shop & Showroom" className="home_type_img" />
          <div className="home_type_content">
            <span className="home_type_label">Shop &amp; Showroom</span>
            <div className="home_type_arrow">
              <FiArrowRight size={18} />
            </div>
          </div>
        </div>

        {/* Warehouse */}
        <div className="home_type_card" onClick={() => router.push('/search?q=warehouse')}>
          <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80" alt="Warehouse" className="home_type_img" />
          <div className="home_type_content">
            <span className="home_type_label">Warehouse</span>
            <div className="home_type_arrow">
              <FiArrowRight size={18} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}