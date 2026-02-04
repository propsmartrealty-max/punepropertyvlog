-- FIX BUILDER ID TYPE & CASING (ROBUST)
-- 1. Standardize 'builderId' -> 'builder_id' in projects table
-- 2. Convert IDs to TEXT

BEGIN;

-- Part A: Fix Column Name in 'projects'
DO $$
BEGIN
    -- If 'builderId' exists but 'builder_id' doesn't, rename it.
    IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='projects' AND column_name='builderId') THEN
        IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='projects' AND column_name='builder_id') THEN
            ALTER TABLE projects RENAME COLUMN "builderId" TO builder_id;
        END IF;
    END IF;
END $$;

-- Part B: Drop Constraints (Generic approach since name might vary)
-- We try to find the constraint name dynamically or just try dropping common names
DO $$
DECLARE r record;
BEGIN
    -- Find and drop foreign keys pointing to builders
    FOR r IN (SELECT constraint_name FROM information_schema.table_constraints WHERE table_name = 'projects' AND constraint_type = 'FOREIGN KEY') LOOP
        EXECUTE 'ALTER TABLE projects DROP CONSTRAINT IF EXISTS "' || r.constraint_name || '"';
    END LOOP;
END $$;


-- Part C: Change Types to TEXT
-- We use '::text' to cast existing UUIDs to strings safely
ALTER TABLE builders ALTER COLUMN id TYPE TEXT USING id::text;
ALTER TABLE projects ALTER COLUMN builder_id TYPE TEXT USING builder_id::text;


-- Part D: Restore Foreign Key
-- Now that both are TEXT, we can link them
ALTER TABLE projects 
ADD CONSTRAINT projects_builder_id_fkey 
FOREIGN KEY (builder_id) 
REFERENCES builders(id)
ON DELETE SET NULL;

COMMIT;
