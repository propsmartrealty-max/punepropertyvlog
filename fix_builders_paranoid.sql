-- PARANOID FIX: Builders Table, Columns, and RLS
-- Run this to clear ANY issue with saving builders.

-- 1. Ensure Columns are snake_case (Idempotent)
DO $$
BEGIN
    -- Rename camelCase columns if they exist
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'builders' AND column_name = 'heroImage') THEN
        ALTER TABLE builders RENAME COLUMN "heroImage" TO hero_image;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'builders' AND column_name = 'establishedYear') THEN
        ALTER TABLE builders RENAME COLUMN "establishedYear" TO established_year;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'builders' AND column_name = 'totalProjects') THEN
        ALTER TABLE builders RENAME COLUMN "totalProjects" TO total_projects;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'builders' AND column_name = 'ongoingProjects') THEN
        ALTER TABLE builders RENAME COLUMN "ongoingProjects" TO ongoing_projects;
    END IF;
END $$;

-- 2. Ensure RLS is enabled and policies exist
ALTER TABLE builders ENABLE ROW LEVEL SECURITY;

-- Drop old policies to act fresh
DROP POLICY IF EXISTS "Public Read Builders" ON builders;
DROP POLICY IF EXISTS "Admin ALL Builders" ON builders;
DROP POLICY IF EXISTS "Enable read access for all users" ON builders;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON builders;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON builders;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON builders;

-- Create simple, robust policies
-- Read: Everyone
CREATE POLICY "Public Read Builders" ON builders
    FOR SELECT USING (true);

-- Write: Authenticated Only (Admins)
CREATE POLICY "Admin Insert Builders" ON builders
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin Update Builders" ON builders
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin Delete Builders" ON builders
    FOR DELETE USING (auth.role() = 'authenticated');

-- 3. Reload Config
NOTIFY pgrst, 'reload config';
