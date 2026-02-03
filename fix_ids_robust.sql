-- FIX ID TYPES (Robust Version with FK Handling)
-- This script handles foreign key dependencies that block ID type changes.

-- 1. Drop conflicting Foreign Key constraints
-- Error indicated "project_configurations_projectId_fkey" failure.
ALTER TABLE project_configurations DROP CONSTRAINT IF EXISTS "project_configurations_projectId_fkey";

-- Also drop other potential FKs to be safe
ALTER TABLE leads DROP CONSTRAINT IF EXISTS "leads_project_id_fkey";
ALTER TABLE leads DROP CONSTRAINT IF EXISTS "leads_projectId_fkey";

-- 2. Convert Child Columns to TEXT (so they match the new Parent ID type)
-- project_configurations
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'project_configurations' AND column_name = 'projectId') THEN
        ALTER TABLE project_configurations ALTER COLUMN "projectId" TYPE text USING "projectId"::text;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'project_configurations' AND column_name = 'project_id') THEN
        ALTER TABLE project_configurations ALTER COLUMN "project_id" TYPE text USING "project_id"::text;
    END IF;
END $$;

-- leads
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'projectId') THEN
        ALTER TABLE leads ALTER COLUMN "projectId" TYPE text USING "projectId"::text;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'project_id') THEN
        ALTER TABLE leads ALTER COLUMN "project_id" TYPE text USING "project_id"::text;
    END IF;
END $$;


-- 3. Convert Parent Tables (Projects & Builders) to TEXT IDs
ALTER TABLE projects ALTER COLUMN id DROP DEFAULT;
ALTER TABLE projects ALTER COLUMN id TYPE text USING id::text;

ALTER TABLE builders ALTER COLUMN id DROP DEFAULT;
ALTER TABLE builders ALTER COLUMN id TYPE text USING id::text;


-- 4. Re-add Foreign Keys (Optional but recommended)
-- Only add if columns match.
DO $$ BEGIN
    -- project_configurations
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'project_configurations' AND column_name = 'projectId') THEN
        ALTER TABLE project_configurations ADD CONSTRAINT "project_configurations_projectId_fkey" 
        FOREIGN KEY ("projectId") REFERENCES projects(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 5. Reload Schema
NOTIFY pgrst, 'reload config';
