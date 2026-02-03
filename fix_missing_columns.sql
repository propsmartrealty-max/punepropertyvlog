-- Ensure all required columns exist in builders table
-- Run this to guarantee the schema supports the data we are sending.

ALTER TABLE builders ADD COLUMN IF NOT EXISTS logo text;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS hero_image text;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS established_year integer;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS total_projects integer;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS ongoing_projects integer;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS locations text[];
ALTER TABLE builders ADD COLUMN IF NOT EXISTS experience integer;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS trust_score numeric;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS mobile text;

-- Notify change
NOTIFY pgrst, 'reload config';
