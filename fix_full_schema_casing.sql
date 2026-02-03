-- Robust Migration: Fix CamelCase -> snake_case for Builders and Projects
-- This script handles "already exists" errors by checking first.

DO $$
BEGIN
    ----------------------------------------------------------------
    -- 1. BUILDERS TABLE
    ----------------------------------------------------------------

    -- hero_image
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'builders' AND column_name = 'heroImage') AND 
       NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'builders' AND column_name = 'hero_image') THEN
        ALTER TABLE builders RENAME COLUMN "heroImage" TO hero_image;
    END IF;

    -- established_year
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'builders' AND column_name = 'establishedYear') AND 
       NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'builders' AND column_name = 'established_year') THEN
        ALTER TABLE builders RENAME COLUMN "establishedYear" TO established_year;
    END IF;

    -- total_projects
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'builders' AND column_name = 'totalProjects') AND 
       NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'builders' AND column_name = 'total_projects') THEN
        ALTER TABLE builders RENAME COLUMN "totalProjects" TO total_projects;
    END IF;

    -- ongoing_projects
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'builders' AND column_name = 'ongoingProjects') AND 
       NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'builders' AND column_name = 'ongoing_projects') THEN
        ALTER TABLE builders RENAME COLUMN "ongoingProjects" TO ongoing_projects;
    END IF;

    ----------------------------------------------------------------
    -- 2. PROJECTS TABLE (Proactive Fixes)
    ----------------------------------------------------------------

    -- builder_id
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'builderId') AND 
       NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'builder_id') THEN
        ALTER TABLE projects RENAME COLUMN "builderId" TO builder_id;
    END IF;

    -- price_range
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'priceRange') AND 
       NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'price_range') THEN
        ALTER TABLE projects RENAME COLUMN "priceRange" TO price_range;
    END IF;

    -- possession_date
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'possessionDate') AND 
       NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'possession_date') THEN
        ALTER TABLE projects RENAME COLUMN "possessionDate" TO possession_date;
    END IF;

    -- rera_id
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'reraId') AND 
       NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'rera_id') THEN
        ALTER TABLE projects RENAME COLUMN "reraId" TO rera_id;
    END IF;

    -- exact_price
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'exactPrice') AND 
       NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'exact_price') THEN
        ALTER TABLE projects RENAME COLUMN "exactPrice" TO exact_price;
    END IF;
    
    -- price_type (Handle "priceType" from earlier script)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'priceType') AND 
       NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'price_type') THEN
        ALTER TABLE projects RENAME COLUMN "priceType" TO price_type;
    END IF;

    -- seo_keywords
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'seoKeywords') AND 
       NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'seo_keywords') THEN
        ALTER TABLE projects RENAME COLUMN "seoKeywords" TO seo_keywords;
    END IF;

    -- meta_description
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'metaDescription') AND 
       NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'meta_description') THEN
        ALTER TABLE projects RENAME COLUMN "metaDescription" TO meta_description;
    END IF;

    -- configuration_details (might be camelCase in some versions)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'configurationDetails') AND 
       NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'configuration_details') THEN
        ALTER TABLE projects RENAME COLUMN "configurationDetails" TO configuration_details;
    END IF;

END $$;

-- Force Schema Reload
NOTIFY pgrst, 'reload config';
