-- Rename camelCase columns to snake_case for 'builders' table
-- This aligns with the 'SeedData.tsx' script and general Supabase best practices.

DO $$
BEGIN
    -- 1. Rename 'heroImage' -> 'hero_image'
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'builders' AND column_name = 'heroImage') THEN
        ALTER TABLE builders RENAME COLUMN "heroImage" TO hero_image;
    END IF;

    -- 2. Rename 'establishedYear' -> 'established_year'
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'builders' AND column_name = 'establishedYear') THEN
        ALTER TABLE builders RENAME COLUMN "establishedYear" TO established_year;
    END IF;

    -- 3. Rename 'totalProjects' -> 'total_projects'
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'builders' AND column_name = 'totalProjects') THEN
        ALTER TABLE builders RENAME COLUMN "totalProjects" TO total_projects;
    END IF;

    -- 4. Rename 'ongoingProjects' -> 'ongoing_projects'
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'builders' AND column_name = 'ongoingProjects') THEN
        ALTER TABLE builders RENAME COLUMN "ongoingProjects" TO ongoing_projects;
    END IF;

     -- 5. Rename 'createdAt' -> 'created_at' (if applicable, for consistency)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'builders' AND column_name = 'createdAt') THEN
        ALTER TABLE builders RENAME COLUMN "createdAt" TO created_at;
    END IF;
END $$;

-- Force schema cache reload
NOTIFY pgrst, 'reload config';
