-- FIX PROJECT ID TYPE (ROBUST V2)
-- Handles missing columns in 'leads' and renaming in 'project_configurations'.

BEGIN;

-- 1. DROP CONSTRAINTS (Safety First)
-- We attempt to drop any FKs referencing projects(id) from known tables.
DO $$
DECLARE r record;
BEGIN
    FOR r IN (SELECT constraint_name FROM information_schema.table_constraints WHERE table_name = 'leads' AND constraint_type = 'FOREIGN KEY') LOOP
        EXECUTE 'ALTER TABLE leads DROP CONSTRAINT IF EXISTS "' || r.constraint_name || '"';
    END LOOP;
    
    FOR r IN (SELECT constraint_name FROM information_schema.table_constraints WHERE table_name = 'project_configurations' AND constraint_type = 'FOREIGN KEY') LOOP
        EXECUTE 'ALTER TABLE project_configurations DROP CONSTRAINT IF EXISTS "' || r.constraint_name || '"';
    END LOOP;
END $$;


-- 2. CONVERT projects.id TO TEXT
-- This is the core fix.
ALTER TABLE projects ALTER COLUMN id TYPE TEXT USING id::text;


-- 3. FIX 'leads' TABLE
-- Issue: Previous run failed because 'project_id' didn't exist.
DO $$
BEGIN
    -- Case A: 'projectId' exists (camelCase) -> Rename to snake
    IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='leads' AND column_name='projectId') THEN
        ALTER TABLE leads RENAME COLUMN "projectId" TO project_id;
    END IF;

    -- Case B: Column doesn't exist at all -> Create it
    IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='leads' AND column_name='project_id') THEN
        ALTER TABLE leads ADD COLUMN project_id TEXT;
    END IF;
    
    -- Now ensure it is TEXT type
    ALTER TABLE leads ALTER COLUMN project_id TYPE TEXT USING project_id::text;
END $$;

-- Link Leads to Projects
ALTER TABLE leads 
ADD CONSTRAINT leads_project_id_fkey 
FOREIGN KEY (project_id) REFERENCES projects(id)
ON DELETE SET NULL;


-- 4. FIX 'project_configurations' TABLE
-- Standardize to snake_case 'project_id' and TEXT type
DO $$
BEGIN
    -- Rename camelCase to snake_case
    IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='project_configurations' AND column_name='projectId') THEN
         ALTER TABLE project_configurations RENAME COLUMN "projectId" TO project_id;
    END IF;

    -- Ensure TEXT type
    ALTER TABLE project_configurations ALTER COLUMN project_id TYPE TEXT USING project_id::text;
END $$;

-- Link Configurations to Projects
ALTER TABLE project_configurations 
ADD CONSTRAINT project_configurations_project_id_fkey 
FOREIGN KEY (project_id) REFERENCES projects(id)
ON DELETE CASCADE;


COMMIT;
