-- FIX BUILDER SCHEMA CONFLICTS (MERGE & CLEAN)
-- This script handles the case where BOTH snake_case and camelCase columns exist.
-- It merges data into snake_case and drops the camelCase versions.

BEGIN;

DO $$
BEGIN

    -- 1. HANDLE 'establishedYear' -> 'established_year'
    IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='builders' AND column_name='establishedYear') THEN
        -- Ensure target exists
        IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='builders' AND column_name='established_year') THEN
            ALTER TABLE builders RENAME COLUMN "establishedYear" TO established_year;
        ELSE
            -- Both exist. Merge data.
            UPDATE builders SET established_year = "establishedYear" WHERE established_year IS NULL;
            ALTER TABLE builders DROP COLUMN "establishedYear";
        END IF;
    END IF;

    -- 2. HANDLE 'totalProjects' -> 'total_projects'
    IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='builders' AND column_name='totalProjects') THEN
        IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='builders' AND column_name='total_projects') THEN
            ALTER TABLE builders RENAME COLUMN "totalProjects" TO total_projects;
        ELSE
            UPDATE builders SET total_projects = "totalProjects" WHERE total_projects IS NULL;
            ALTER TABLE builders DROP COLUMN "totalProjects";
        END IF;
    END IF;

    -- 3. HANDLE 'ongoingProjects' -> 'ongoing_projects'
    IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='builders' AND column_name='ongoingProjects') THEN
        IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='builders' AND column_name='ongoing_projects') THEN
            ALTER TABLE builders RENAME COLUMN "ongoingProjects" TO ongoing_projects;
        ELSE
            UPDATE builders SET ongoing_projects = "ongoingProjects" WHERE ongoing_projects IS NULL;
            ALTER TABLE builders DROP COLUMN "ongoingProjects";
        END IF;
    END IF;

    -- 4. HANDLE 'heroImage' -> 'hero_image'
    IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='builders' AND column_name='heroImage') THEN
        IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='builders' AND column_name='hero_image') THEN
            ALTER TABLE builders RENAME COLUMN "heroImage" TO hero_image;
        ELSE
            UPDATE builders SET hero_image = "heroImage" WHERE hero_image IS NULL;
            ALTER TABLE builders DROP COLUMN "heroImage";
        END IF;
    END IF;

    -- 5. HANDLE 'trustScore' -> 'trust_score'
    IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='builders' AND column_name='trustScore') THEN
        IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='builders' AND column_name='trust_score') THEN
            ALTER TABLE builders RENAME COLUMN "trustScore" TO trust_score;
        ELSE
            UPDATE builders SET trust_score = "trustScore" WHERE trust_score IS NULL;
            ALTER TABLE builders DROP COLUMN "trustScore";
        END IF;
    END IF;

    -- 6. HANDLE 'isVerified' -> 'is_verified'
    IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='builders' AND column_name='isVerified') THEN
        IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='builders' AND column_name='is_verified') THEN
            ALTER TABLE builders RENAME COLUMN "isVerified" TO is_verified;
        ELSE
            UPDATE builders SET is_verified = "isVerified" WHERE is_verified IS NULL;
            ALTER TABLE builders DROP COLUMN "isVerified";
        END IF;
    END IF;

END $$;

-- 7. Ensure New Columns Exist (Safe Checks)
ALTER TABLE builders ADD COLUMN IF NOT EXISTS mobile TEXT;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS trust_score NUMERIC DEFAULT 0;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS experience NUMERIC DEFAULT 0;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS locations TEXT[] DEFAULT '{}';

COMMIT;
