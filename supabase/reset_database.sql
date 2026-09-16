-- Property Tap Database Reset Script
-- WARNING: This drops all Property Tap application tables in a clean, controlled manner.

DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS interests CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS property_listings CASCADE;
DROP TABLE IF EXISTS listing_plans CASCADE;
DROP TABLE IF EXISTS property_images CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS property_categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop custom types if present
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS property_purpose CASCADE;
DROP TYPE IF EXISTS property_status CASCADE;
DROP TYPE IF EXISTS listing_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS interest_status CASCADE;
DROP TYPE IF EXISTS report_status CASCADE;
