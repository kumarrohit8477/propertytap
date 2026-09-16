'use client';

import React, { useState } from 'react';
import { PropertyImage } from '@/types/property';
import './property_gallery.css';

interface PropertyGalleryProps {
  images?: PropertyImage[];
  title: string;
}

export default function PropertyGallery({ images = [], title }: PropertyGalleryProps) {
  const default_image = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200';
  const display_images = images.length > 0 ? images.map((img) => img.image_url) : [default_image];
  const [selected_index, set_selected_index] = useState(0);

  return (
    <div className="property_gallery_container">
      <div className="property_gallery_main_wrapper">
        <img
          src={display_images[selected_index]}
          alt={`${title} - image ${selected_index + 1}`}
          className="property_gallery_main_image"
        />
      </div>

      {display_images.length > 1 && (
        <div className="property_gallery_thumbnails">
          {display_images.map((url, idx) => (
            <div
              key={idx}
              className={`property_gallery_thumbnail_item ${
                selected_index === idx ? 'property_gallery_thumbnail_active' : ''
              }`}
              onClick={() => set_selected_index(idx)}
            >
              <img
                src={url}
                alt={`${title} thumbnail ${idx + 1}`}
                className="property_gallery_thumbnail_image"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
