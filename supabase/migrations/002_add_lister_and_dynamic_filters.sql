-- Migration 002: Add lister profile fields and dynamic filter columns to properties

-- 1. Profiles Table Extensions
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS display_name TEXT,
  ADD COLUMN IF NOT EXISTS profile_type TEXT DEFAULT 'individual';

-- 2. Properties Table Extensions for Dynamic Filters
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS pg_type TEXT,
  ADD COLUMN IF NOT EXISTS sharing_type TEXT,
  ADD COLUMN IF NOT EXISTS food_included BOOLEAN,
  ADD COLUMN IF NOT EXISTS land_type TEXT,
  ADD COLUMN IF NOT EXISTS facing TEXT,
  ADD COLUMN IF NOT EXISTS parking BOOLEAN,
  ADD COLUMN IF NOT EXISTS floor INTEGER;

-- 3. Populate existing profiles display_name if null
UPDATE public.profiles
SET display_name = full_name
WHERE display_name IS NULL OR display_name = '';
