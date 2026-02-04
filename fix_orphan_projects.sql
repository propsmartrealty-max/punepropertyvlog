-- FIX FOREIGN KEY VIOLATION (ORPHAN PROJECTS)
-- The error "Key (builder_id)=(Godrej Properties) is not present" means some projects
-- refer to a builder ID 'Godrej Properties' that doesn't exist in the 'builders' table.

BEGIN;

-- 1. Identify missing IDs and Insert Placeholder Builders
-- We insert a builder for ANY project that points to a non-existent builder_id.
INSERT INTO builders (id, name, slug, description, is_verified)
SELECT DISTINCT p.builder_id, p.builder_id, 'legacy-' || lower(regexp_replace(p.builder_id, '\s+', '-', 'g')), 'Legacy Data - Auto Generated', false
FROM projects p
LEFT JOIN builders b ON p.builder_id = b.id
WHERE b.id IS NULL AND p.builder_id IS NOT NULL;

-- 2. Now that the builders exist, we can safely apply the Foreign Key
ALTER TABLE projects 
DROP CONSTRAINT IF EXISTS projects_builder_id_fkey;

ALTER TABLE projects 
ADD CONSTRAINT projects_builder_id_fkey 
FOREIGN KEY (builder_id) 
REFERENCES builders(id)
ON DELETE SET NULL;

COMMIT;
