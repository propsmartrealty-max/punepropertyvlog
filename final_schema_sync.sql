-- FINAL SCHEMA SYNC (Builders & Projects)
-- Run this to verify every single column exists in the correct snake_case format.

-- 1. BUILDERS Table
ALTER TABLE builders ADD COLUMN IF NOT EXISTS logo text;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS hero_image text;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS established_year integer;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS total_projects integer;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS ongoing_projects integer;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS trust_score numeric;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS mobile text;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS experience integer;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS locations text[];

-- 2. PROJECTS Table (Ensuring new fields)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS master_layout text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS floor_plans text[];
ALTER TABLE projects ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'Pending';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS price_per_sqft numeric;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS verification_source text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS highlights text[];

-- 3. Rename any lingering camelCase (Safety Check)
DO $$
BEGIN
    -- Builders
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'builders' AND column_name = 'trustScore') THEN
        ALTER TABLE builders RENAME COLUMN "trustScore" TO trust_score;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'builders' AND column_name = 'isVerified') THEN
        ALTER TABLE builders RENAME COLUMN "isVerified" TO is_verified;
    END IF;
    
    -- Projects
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'masterLayout') THEN
        ALTER TABLE projects RENAME COLUMN "masterLayout" TO master_layout;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'floorPlans') THEN
        ALTER TABLE projects RENAME COLUMN "floorPlans" TO floor_plans;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'pricePerSqft') THEN
        ALTER TABLE projects RENAME COLUMN "pricePerSqft" TO price_per_sqft;
    END IF;
END $$;

-- 4. Reload Schema
NOTIFY pgrst, 'reload config';
