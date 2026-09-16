-- Property Tap Seed Data

-- 1. Default Categories
INSERT INTO public.property_categories (id, name, slug, parent_id, is_active) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Residential', 'residential', NULL, true),
  ('c1000000-0000-0000-0000-000000000002', 'Commercial', 'commercial', NULL, true),
  ('c1000000-0000-0000-0000-000000000003', 'Land', 'land', NULL, true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.property_categories (name, slug, parent_id, is_active) VALUES
  ('House', 'house', 'c1000000-0000-0000-0000-000000000001', true),
  ('Flat', 'flat', 'c1000000-0000-0000-0000-000000000001', true),
  ('Apartment', 'apartment', 'c1000000-0000-0000-0000-000000000001', true),
  ('Villa', 'villa', 'c1000000-0000-0000-0000-000000000001', true),
  ('PG', 'pg', 'c1000000-0000-0000-0000-000000000001', true),
  ('Hostel', 'hostel', 'c1000000-0000-0000-0000-000000000001', true),
  ('Shop', 'shop', 'c1000000-0000-0000-0000-000000000002', true),
  ('Office', 'office', 'c1000000-0000-0000-0000-000000000002', true),
  ('Workspace', 'workspace', 'c1000000-0000-0000-0000-000000000002', true),
  ('Showroom', 'showroom', 'c1000000-0000-0000-0000-000000000002', true),
  ('Warehouse', 'warehouse', 'c1000000-0000-0000-0000-000000000002', true),
  ('Plot', 'plot', 'c1000000-0000-0000-0000-000000000003', true),
  ('Residential Land', 'residential-land', 'c1000000-0000-0000-0000-000000000003', true),
  ('Commercial Land', 'commercial-land', 'c1000000-0000-0000-0000-000000000003', true),
  ('Agricultural Land', 'agricultural-land', 'c1000000-0000-0000-0000-000000000003', true)
ON CONFLICT (slug) DO NOTHING;

-- 2. Listing Plans (Including Launch Special ₹0 Plan)
INSERT INTO public.listing_plans (name, duration_days, price, is_active) VALUES
  ('Launch Special (1 Month)', 30, 0.00, true),
  ('Standard (1 Month)', 30, 499.00, false),
  ('Premium (3 Months)', 90, 1199.00, false);
