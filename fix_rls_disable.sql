-- NUCLEAR OPTION: Disable RLS
-- This removes ALL permission checks. Use only for debugging.

ALTER TABLE builders DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads DISABLE ROW LEVEL SECURITY; -- If using a tracking table
-- Storage objects usually handled by Storage Policies, but tables are key here.

-- Ensure Storage is Public
-- (We already did this in fix_storage_buckets.sql but let's be sure uploads are allowed)

-- Reload
NOTIFY pgrst, 'reload config';
