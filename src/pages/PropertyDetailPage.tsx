import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { get_property_by_id } from '@/lib/properties/property_service';
import { PropertyItem } from '@/types/property';
import PropertyGallery from '@/components/property/property_gallery';
import PropertyInfo from '@/components/property/property_info';
import { ArrowLeft, Loader2 } from 'lucide-react';
import '@/app/(public)/properties/[id]/property_detail.css';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [property, set_property] = useState<PropertyItem | null>(null);
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState(false);

  useEffect(() => {
    if (!id) return;
    let is_mounted = true;

    async function load() {
      set_loading(true);
      try {
        const { property: data, error: err } = await get_property_by_id(id!);
        if (err || !data) {
          if (is_mounted) set_error(true);
        } else if (is_mounted) {
          set_property(data);
          document.title = `${data.title} | PropertyTap`;
        }
      } catch {
        if (is_mounted) set_error(true);
      } finally {
        if (is_mounted) set_loading(false);
      }
    }
    load();

    return () => {
      is_mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', gap: '0.75rem' }}>
        <Loader2 size={24} className="animate-spin" color="#1d4ed8" />
        <span style={{ color: '#4b5563', fontWeight: 600 }}>Loading property details...</span>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>Property Not Found</h2>
        <p style={{ color: '#6b7280', margin: '0.5rem 0 1.5rem' }}>
          The property listing you are looking for does not exist or has been removed.
        </p>
        <Link to="/properties" style={{ color: '#1d4ed8', fontWeight: 600 }}>
          &larr; Back to all properties
        </Link>
      </div>
    );
  }

  return (
    <div className="property_detail_wrapper">
      {/* ── Breadcrumb & Top Navigation Bar ── */}
      <div className="property_detail_top_nav">
        <Link to="/properties" className="property_detail_back_btn">
          <ArrowLeft size={16} />
          <span>Back to Properties</span>
        </Link>
        <nav className="property_breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb_sep">/</span>
          <Link to="/properties">Properties</Link>
          <span className="breadcrumb_sep">/</span>
          <Link to={`/properties?city=${encodeURIComponent(property.city)}`}>
            {property.city}
          </Link>
          <span className="breadcrumb_sep">/</span>
          <span className="breadcrumb_current">{property.title}</span>
        </nav>
      </div>

      {/* ── Two-Column Layout ── */}
      <div className="property_detail_container">
        <div className="property_detail_gallery_col">
          <PropertyGallery images={property.images} title={property.title} />
        </div>
        <aside className="property_detail_info_col">
          <PropertyInfo property={property} />
        </aside>
      </div>
    </div>
  );
}
