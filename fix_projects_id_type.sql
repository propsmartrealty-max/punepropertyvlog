-- FIX PROJECT ID TYPE (FINAL MISSING PIECE)
-- Verification showed 'projects.id' is still UUID, blocking 'p...' IDs.
-- This script converts it to TEXT.

BEGIN;

-- 1. Drop constraints relying on projects.id (e.g. leads, project_configurations)
-- We need to find them dynamically or just drop known ones.
-- Leads often reference project_id
-- Project Configurations reference projectId

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


-- 2. Convert projects.id to TEXT
ALTER TABLE projects ALTER COLUMN id TYPE TEXT USING id::text;

-- 3. Also convert referencing columns to TEXT so we can restore FKs
ALTER TABLE leads ALTER COLUMN project_id TYPE TEXT USING project_id::text;
ALTER TABLE project_configurations ALTER COLUMN "projectId" TYPE TEXT USING "projectId"::text; -- Note casing might be camel or snake, handling below.

-- Handle 'project_configurations' column name ambiguity:
DO $$
BEGIN
    IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='project_configurations' AND column_name='projectId') THEN
         -- Rename to snake_case while we are at it? Or just keep it. Let's start with Type.
         ALTER TABLE project_configurations ALTER COLUMN "projectId" TYPE TEXT USING "projectId"::text;
         
         -- Restore FK
         ALTER TABLE project_configurations 
         ADD CONSTRAINT project_configurations_project_id_fkey 
         FOREIGN KEY ("projectId") REFERENCES projects(id) ON DELETE CASCADE;
         
    ELSIF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='project_configurations' AND column_name='project_id') THEN
         ALTER TABLE project_configurations ALTER COLUMN project_id TYPE TEXT USING project_id::text;
         
         -- Restore FK
         ALTER TABLE project_configurations 
         ADD CONSTRAINT project_configurations_project_id_fkey 
         FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
    END IF;
END $$;


-- 4. Restore Leads FK
-- Assuming column is project_id (standard) or projectId
DO $$
BEGIN
    IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='leads' AND column_name='project_id') THEN
         ALTER TABLE leads 
         ADD CONSTRAINT leads_project_id_fkey 
         FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;
    END IF;
END $$;

COMMIT;
