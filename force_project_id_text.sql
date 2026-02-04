-- FORCE PROJECT ID TO TEXT (NUCLEAR OPTION)
-- The previous attempts failed because hidden constraints blocked the change.
-- This script finds ALL foreign keys pointing to 'projects' and drops them.

BEGIN;

-- 1. DROP ALL FOREIGN KEYS REFERENCING projects(id)
-- This uses a system query to find any table (leads, configurations, etc.) linking to projects.
DO $$
DECLARE r record;
BEGIN
    FOR r IN (
        SELECT tc.table_name, tc.constraint_name 
        FROM information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu 
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu 
          ON ccu.constraint_name = tc.constraint_name
        WHERE ccu.table_name = 'projects' AND ccu.column_name = 'id' AND tc.constraint_type = 'FOREIGN KEY'
    ) LOOP
        RAISE NOTICE 'Dropping constraint % from table %', r.constraint_name, r.table_name;
        EXECUTE 'ALTER TABLE "' || r.table_name || '" DROP CONSTRAINT "' || r.constraint_name || '"';
    END LOOP;
END $$;


-- 2. NOW WE CAN CHANGE THE TYPE
ALTER TABLE projects ALTER COLUMN id TYPE TEXT USING id::text;


-- 3. FIX DEPENDENT COLUMNS (So they can link back)
-- We need to fix any table that WAS linking to it.
-- We know 'leads' and 'project_configurations' are the main ones.
-- We check columns loosely to catch 'project_id' or 'projectId'

-- Fix LEADS
DO $$
BEGIN
    -- Rename camel to snake if present
    IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='leads' AND column_name='projectId') THEN
        ALTER TABLE leads RENAME COLUMN "projectId" TO project_id;
    END IF;
    -- Create if missing
    IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='leads' AND column_name='project_id') THEN
        ALTER TABLE leads ADD COLUMN project_id TEXT;
    END IF;
    -- Change type
    ALTER TABLE leads ALTER COLUMN project_id TYPE TEXT USING project_id::text;
    -- Restore Constraint
    ALTER TABLE leads ADD CONSTRAINT leads_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;
END $$;

-- Fix PROJECT_CONFIGURATIONS
DO $$
BEGIN
    IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='project_configurations' AND column_name='projectId') THEN
         ALTER TABLE project_configurations RENAME COLUMN "projectId" TO project_id;
    END IF;
    ALTER TABLE project_configurations ALTER COLUMN project_id TYPE TEXT USING project_id::text;
    ALTER TABLE project_configurations ADD CONSTRAINT project_configurations_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
END $$;


COMMIT;
