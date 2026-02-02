-- Fix: Add missing priceType column to projects table
-- This column is required by the AI Seeder

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS "priceType" text DEFAULT 'L'; 

-- Add check constraint to ensure only valid values
ALTER TABLE projects 
DROP CONSTRAINT IF EXISTS allowed_price_types;

ALTER TABLE projects 
ADD CONSTRAINT allowed_price_types CHECK ("priceType" IN ('L', 'Cr', 'K'));

-- Refresh schema cache happens automatically in Supabase usually, 
-- but running this confirms the schema change.
