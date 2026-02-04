-- FIX BUILDER ID TYPE
-- The frontend generates IDs like 'b170....' (TEXT), but the DB expects UUID.
-- We must convert the column to TEXT to support this.

BEGIN;

-- 1. Drop foreign key constraints temporarily (projects refer to builders)
-- We need to find the constraint name. Usually it's 'projects_builder_id_fkey'.
-- We'll try to drop it if it exists.
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_builder_id_fkey;

-- 2. Alter 'builders.id' to TEXT
ALTER TABLE builders ALTER COLUMN id TYPE TEXT;

-- 3. Also alter 'projects.builder_id' to TEXT to match
ALTER TABLE projects ALTER COLUMN builder_id TYPE TEXT;

-- 4. Re-add the Foreign Key
ALTER TABLE projects 
ADD CONSTRAINT projects_builder_id_fkey 
FOREIGN KEY (builder_id) 
REFERENCES builders(id)
ON DELETE SET NULL; -- Or CASCADE, depending on preference. SET NULL is safer.

COMMIT;
