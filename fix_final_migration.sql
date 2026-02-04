-- FINAL MASTER FIX
-- This script safely handles renaming, orphan data, and type conversion.
-- Run this ONCE to fix everything.

BEGIN;

-- 1. Standardize Column Name (builderId -> builder_id)
DO $$
BEGIN
    IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='projects' AND column_name='builderId') THEN
        ALTER TABLE projects RENAME COLUMN "builderId" TO builder_id;
    END IF;
END $$;

-- 2. Drop existing FK constraints to avoid blocking changes
DO $$
DECLARE r record;
BEGIN
    FOR r IN (SELECT constraint_name FROM information_schema.table_constraints WHERE table_name = 'projects' AND constraint_type = 'FOREIGN KEY') LOOP
        EXECUTE 'ALTER TABLE projects DROP CONSTRAINT IF EXISTS "' || r.constraint_name || '"';
    END LOOP;
END $$;

-- 3. Fix Orphan Data (Insert missing builders)
-- Now we are sure the column is 'builder_id'
INSERT INTO builders (id, name, slug, description, is_verified)
SELECT DISTINCT p.builder_id, p.builder_id, 'legacy-' || lower(regexp_replace(p.builder_id, '\s+', '-', 'g')), 'Legacy Data - Auto Generated', false
FROM projects p
LEFT JOIN builders b ON p.builder_id = b.id
WHERE b.id IS NULL AND p.builder_id IS NOT NULL;

-- 4. Convert Types to TEXT (to support 'b123' and 'Godrej Properties')
ALTER TABLE builders ALTER COLUMN id TYPE TEXT USING id::text;
ALTER TABLE projects ALTER COLUMN builder_id TYPE TEXT USING builder_id::text;

-- 5. Restore Foreign Key
ALTER TABLE projects 
ADD CONSTRAINT projects_builder_id_fkey 
FOREIGN KEY (builder_id) 
REFERENCES builders(id)
ON DELETE SET NULL;

COMMIT;
