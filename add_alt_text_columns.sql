
-- Migration: Add Alt Text Columns

-- For Builders
ALTER TABLE builders 
ADD COLUMN IF NOT EXISTS logo_alt text DEFAULT '',
ADD COLUMN IF NOT EXISTS hero_image_alt text DEFAULT '';

-- For Projects
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS thumbnail_alt text DEFAULT '';

-- Notify
NOTIFY pgrst, 'reload schema';
