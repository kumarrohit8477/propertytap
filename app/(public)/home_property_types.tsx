'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import './home_property_types.css';

const PROPERTY_TYPES = [
  {
    label: 'House',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    route: '/properties?category_id=apartment-flat-house',
  },
  {
    label: 'Flat / Apartment',
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
    route: '/properties?category_id=apartment-flat-house',
  },
  {
    label: 'PG / Hostel',
    img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80',
    route: '/properties?category_id=hostel-pg',
  },
  {
    label: 'Office Spaces',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
    route: '/properties?category_id=office-workspace',
  },
  {
    label: 'Shop & Showroom',
    img: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80',
    route: '/properties?category_id=shops-showrooms',
  },
  {
    label: 'Villa',
    img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80',
    route: '/properties?category_id=villa-warehouses',
  },
  {
    label: 'Warehouse',
    img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80',
    route: '/properties?category_id=villa-warehouses',
  },
];

export default function HomePropertyTypes() {
  const router = useRouter();

  return (
    <section className="hpt_section">
      <div className="hpt_container">
        <div className="hpt_header">
          <h2 className="hpt_title">Browse by Property Type</h2>
          <p className="hpt_subtitle">Explore a wide range of properties as per your need</p>
        </div>

        <div className="hpt_grid">
          {PROPERTY_TYPES.map((type) => (
            <div
              key={type.label}
              className="hpt_card"
              onClick={() => router.push(type.route)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && router.push(type.route)}
            >
              <div className="hpt_img_wrap">
                <img src={type.img} alt={type.label} className="hpt_img" />
              </div>
              <span className="hpt_label">{type.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}