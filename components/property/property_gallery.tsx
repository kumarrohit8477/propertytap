'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PropertyImage } from '@/types/property';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import './property_gallery.css';

interface PropertyGalleryProps {
  images?: PropertyImage[];
  title: string;
}

export default function PropertyGallery({ images = [], title }: PropertyGalleryProps) {
  const default_image = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200';
  const display_images = images.length > 0 ? images.map((img) => img.image_url) : [default_image];
  const [selected_index, set_selected_index] = useState(0);
  const [lightbox_open, set_lightbox_open] = useState(false);
  const [lightbox_index, set_lightbox_index] = useState(0);

  const open_lightbox = (idx: number) => {
    set_lightbox_index(idx);
    set_lightbox_open(true);
  };

  const close_lightbox = () => set_lightbox_open(false);

  const go_prev = useCallback(() => {
    set_lightbox_index((i) => (i === 0 ? display_images.length - 1 : i - 1));
  }, [display_images.length]);

  const go_next = useCallback(() => {
    set_lightbox_index((i) => (i === display_images.length - 1 ? 0 : i + 1));
  }, [display_images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightbox_open) return;
    const on_key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close_lightbox();
      if (e.key === 'ArrowLeft') go_prev();
      if (e.key === 'ArrowRight') go_next();
    };
    window.addEventListener('keydown', on_key);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', on_key);
      document.body.style.overflow = '';
    };
  }, [lightbox_open, go_prev, go_next]);

  // Touch swipe support
  const touch_start_x = React.useRef<number | null>(null);
  const on_touch_start = (e: React.TouchEvent) => {
    touch_start_x.current = e.touches[0].clientX;
  };
  const on_touch_end = (e: React.TouchEvent) => {
    if (touch_start_x.current === null) return;
    const diff = touch_start_x.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? go_next() : go_prev();
    touch_start_x.current = null;
  };

  return (
    <>
      <div className="property_gallery_container">
        <div className="property_gallery_main_wrapper">
          <img
            src={display_images[selected_index]}
            alt={`${title} - image ${selected_index + 1}`}
            className="property_gallery_main_image"
            onClick={() => open_lightbox(selected_index)}
            title="Click to view fullscreen"
          />
          <div className="property_gallery_fullscreen_hint">🔍 Click to expand</div>
          {display_images.length > 1 && (
            <>
              <div className="property_gallery_counter">
                {selected_index + 1} / {display_images.length}
              </div>
              <button
                className="property_gallery_nav property_gallery_nav_prev"
                onClick={(e) => { e.stopPropagation(); set_selected_index((i) => (i === 0 ? display_images.length - 1 : i - 1)); }}
                aria-label="Previous image"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                className="property_gallery_nav property_gallery_nav_next"
                onClick={(e) => { e.stopPropagation(); set_selected_index((i) => (i === display_images.length - 1 ? 0 : i + 1)); }}
                aria-label="Next image"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
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

      {/* ── Lightbox ── */}
      {lightbox_open && (
        <div
          className="gallery_lightbox_backdrop"
          onClick={close_lightbox}
          onTouchStart={on_touch_start}
          onTouchEnd={on_touch_end}
        >
          {/* Close */}
          <button
            className="gallery_lightbox_close"
            onClick={close_lightbox}
            aria-label="Close"
          >
            <X size={22} />
          </button>

          {/* Counter */}
          <div className="gallery_lightbox_counter">
            {lightbox_index + 1} / {display_images.length}
          </div>

          {/* Prev */}
          {display_images.length > 1 && (
            <button
              className="gallery_lightbox_nav gallery_lightbox_prev"
              onClick={(e) => { e.stopPropagation(); go_prev(); }}
              aria-label="Previous"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Main Image */}
          <div className="gallery_lightbox_img_wrap" onClick={(e) => e.stopPropagation()}>
            <img
              src={display_images[lightbox_index]}
              alt={`${title} - ${lightbox_index + 1}`}
              className="gallery_lightbox_img"
            />
          </div>

          {/* Next */}
          {display_images.length > 1 && (
            <button
              className="gallery_lightbox_nav gallery_lightbox_next"
              onClick={(e) => { e.stopPropagation(); go_next(); }}
              aria-label="Next"
            >
              <ChevronRight size={28} />
            </button>
          )}

          {/* Thumbnail strip */}
          {display_images.length > 1 && (
            <div className="gallery_lightbox_thumbs" onClick={(e) => e.stopPropagation()}>
              {display_images.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`thumb ${idx + 1}`}
                  className={`gallery_lightbox_thumb ${lightbox_index === idx ? 'gallery_lightbox_thumb_active' : ''}`}
                  onClick={() => set_lightbox_index(idx)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
