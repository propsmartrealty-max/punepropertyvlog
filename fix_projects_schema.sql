-- FIX PROJECTS SCHEMA
-- The frontend is trying to sort by 'created_at', but the column is missing.

BEGIN;

-- Add 'created_at' if it doesn't exist
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Optional: Add 'updated_at' while we are at it, as it's good practice
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

COMMIT;
