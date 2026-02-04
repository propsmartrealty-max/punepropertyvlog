-- RESTORE SCHEMA INTEGRITY (The "Golden State" Fix)
-- Diagnosis showed 'projects' has mixed camelCase and snake_case, and 'builderId' specifically.
-- This script normalizes EVERYTHING to snake_case and TEXT IDs.

BEGIN;

-- ---------------------------------------------------------
-- 1. DROP CONSTRAINTS (Safety First)
-- ---------------------------------------------------------
DO $$
DECLARE r record;
BEGIN
    FOR r IN (SELECT constraint_name FROM information_schema.table_constraints WHERE table_name = 'projects' AND constraint_type = 'FOREIGN KEY') LOOP
        EXECUTE 'ALTER TABLE projects DROP CONSTRAINT IF EXISTS "' || r.constraint_name || '"';
    END LOOP;
END $$;

-- ---------------------------------------------------------
-- 2. NORMALIZE 'PROJECTS' TABLE (Merge & Rename)
-- ---------------------------------------------------------

-- Helper macro logic for each column:
-- If camel exists and snake doesn't -> Rename
-- If both exist -> Update snake from camel (if null), then Drop camel

DO $$
BEGIN

    -- builderId -> builder_id
    IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='projects' AND column_name='builderId') THEN
        IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='projects' AND column_name='builder_id') THEN
            ALTER TABLE projects RENAME COLUMN "builderId" TO builder_id;
        ELSE
            UPDATE projects SET builder_id = "builderId" WHERE builder_id IS NULL;
            ALTER TABLE projects DROP COLUMN "builderId";
        END IF;
    END IF;

    -- priceRange -> price_range
    IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='projects' AND column_name='priceRange') THEN
        IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='projects' AND column_name='price_range') THEN
            ALTER TABLE projects RENAME COLUMN "priceRange" TO price_range;
        ELSE
            UPDATE projects SET price_range = "priceRange" WHERE price_range IS NULL;
            ALTER TABLE projects DROP COLUMN "priceRange";
        END IF;
    END IF;

    -- possessionDate -> possession_date
    IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='projects' AND column_name='possessionDate') THEN
        IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='projects' AND column_name='possession_date') THEN
            ALTER TABLE projects RENAME COLUMN "possessionDate" TO possession_date;
        ELSE
            UPDATE projects SET possession_date = "possessionDate" WHERE possession_date IS NULL;
            ALTER TABLE projects DROP COLUMN "possessionDate";
        END IF;
    END IF;

    -- heroImage -> hero_image
    IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='projects' AND column_name='heroImage') THEN
        IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='projects' AND column_name='hero_image') THEN
            ALTER TABLE projects RENAME COLUMN "heroImage" TO hero_image;
        ELSE
            UPDATE projects SET hero_image = "heroImage" WHERE hero_image IS NULL;
            ALTER TABLE projects DROP COLUMN "heroImage";
        END IF;
    END IF;

    -- masterLayout -> master_layout
    IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='projects' AND column_name='masterLayout') THEN
        IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='projects' AND column_name='master_layout') THEN
            ALTER TABLE projects RENAME COLUMN "masterLayout" TO master_layout;
        ELSE
            UPDATE projects SET master_layout = "masterLayout" WHERE master_layout IS NULL;
            ALTER TABLE projects DROP COLUMN "masterLayout";
        END IF;
    END IF;

     -- floorPlans -> floor_plans
    IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='projects' AND column_name='floorPlans') THEN
        IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='projects' AND column_name='floor_plans') THEN
            ALTER TABLE projects RENAME COLUMN "floorPlans" TO floor_plans;
        ELSE
            UPDATE projects SET floor_plans = "floorPlans" WHERE floor_plans IS NULL;
            ALTER TABLE projects DROP COLUMN "floorPlans";
        END IF;
    END IF;

    -- seoKeywords -> seo_keywords
    IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='projects' AND column_name='seoKeywords') THEN
        IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='projects' AND column_name='seo_keywords') THEN
            ALTER TABLE projects RENAME COLUMN "seoKeywords" TO seo_keywords;
        ELSE
            UPDATE projects SET seo_keywords = "seoKeywords" WHERE seo_keywords IS NULL;
            ALTER TABLE projects DROP COLUMN "seoKeywords";
        END IF;
    END IF;

    -- metaDescription -> meta_description
    IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='projects' AND column_name='metaDescription') THEN
        IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='projects' AND column_name='meta_description') THEN
            ALTER TABLE projects RENAME COLUMN "metaDescription" TO meta_description;
        ELSE
            UPDATE projects SET meta_description = "metaDescription" WHERE meta_description IS NULL;
            ALTER TABLE projects DROP COLUMN "metaDescription";
        END IF;
    END IF;

    -- configurationDetails -> configuration_details
    IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='projects' AND column_name='configurationDetails') THEN
        IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='projects' AND column_name='configuration_details') THEN
            ALTER TABLE projects RENAME COLUMN "configurationDetails" TO configuration_details;
        ELSE
            UPDATE projects SET configuration_details = "configurationDetails" WHERE configuration_details IS NULL;
            ALTER TABLE projects DROP COLUMN "configurationDetails";
        END IF;
    END IF;

    -- verificationStatus -> verification_status
    IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='projects' AND column_name='verificationStatus') THEN
        IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='projects' AND column_name='verification_status') THEN
            ALTER TABLE projects RENAME COLUMN "verificationStatus" TO verification_status;
        ELSE
            UPDATE projects SET verification_status = "verificationStatus" WHERE verification_status IS NULL;
            ALTER TABLE projects DROP COLUMN "verificationStatus";
        END IF;
    END IF;
    
    -- priceType -> price_type
    IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='projects' AND column_name='priceType') THEN
        IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='projects' AND column_name='price_type') THEN
            ALTER TABLE projects RENAME COLUMN "priceType" TO price_type;
        ELSE
            UPDATE projects SET price_type = "priceType" WHERE price_type IS NULL;
            ALTER TABLE projects DROP COLUMN "priceType";
        END IF;
    END IF;

END $$;

-- ---------------------------------------------------------
-- 3. NORMALIZE 'BUILDERS' TABLE (Cleanup legacy camelCase)
-- ---------------------------------------------------------
DO $$
BEGIN
    -- createdAt -> created_at
    IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='builders' AND column_name='createdAt') THEN
        IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='builders' AND column_name='created_at') THEN
            ALTER TABLE builders RENAME COLUMN "createdAt" TO created_at;
        ELSE
            ALTER TABLE builders DROP COLUMN "createdAt";
        END IF;
    END IF;
END $$;


-- ---------------------------------------------------------
-- 4. TYPE CONVERSION (UUID -> TEXT)
-- ---------------------------------------------------------
-- We safely cast IDs to text. If already text, this is a no-op.
ALTER TABLE builders ALTER COLUMN id TYPE TEXT USING id::text;
ALTER TABLE projects ALTER COLUMN builder_id TYPE TEXT USING builder_id::text;


-- ---------------------------------------------------------
-- 5. ORPHAN FIX (Insert Ghost Builders)
-- ---------------------------------------------------------
-- Insert missing builders referenced by projects
INSERT INTO builders (id, name, slug, description, is_verified)
SELECT DISTINCT p.builder_id, p.builder_id, 'legacy-' || lower(regexp_replace(p.builder_id, '\s+', '-', 'g')), 'Legacy Data - Auto Generated', false
FROM projects p
LEFT JOIN builders b ON p.builder_id = b.id
WHERE b.id IS NULL AND p.builder_id IS NOT NULL;


-- ---------------------------------------------------------
-- 6. RESTORE CONSTRAINTS
-- ---------------------------------------------------------
ALTER TABLE projects 
ADD CONSTRAINT projects_builder_id_fkey 
FOREIGN KEY (builder_id) 
REFERENCES builders(id)
ON DELETE SET NULL;


COMMIT;
