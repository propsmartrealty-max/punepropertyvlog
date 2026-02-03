-- FIX ID MISMATCH (UUID vs TEXT)
-- The Frontend uses IDs like 'b170...', which fail if the DB expects UUID.
-- We must convert the ID column to TEXT to support these IDs.

-- 1. Drop constraints if necessary (depending on setup, might need to drop FKs first if strict)
-- In this schema, projects.builderId is just 'text' with no strict FK usually, but we check.

ALTER TABLE builders ALTER COLUMN id DROP DEFAULT;
ALTER TABLE builders ALTER COLUMN id TYPE text USING id::text;

-- 2. Projects ID (Just in case, though p... seems to work or be handled)
ALTER TABLE projects ALTER COLUMN id DROP DEFAULT;
ALTER TABLE projects ALTER COLUMN id TYPE text USING id::text;

-- 3. Ensure 'logo' is definitely there
ALTER TABLE builders ADD COLUMN IF NOT EXISTS logo text;

-- 4. Reload policies to be safe
NOTIFY pgrst, 'reload config';
