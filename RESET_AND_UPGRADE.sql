-- ⚠️ WARNING: THIS WILL RESET YOUR PROJECT DATA TO ALLOW FRESH HIGH-QUALITY FETCHING
-- Run this in Supabase SQL Editor

-- 1. Truncate existing data (Clean Slate)
truncate table projects;
truncate table builders;

-- 2. Add SEO & Metadata Columns (Safe if not exists)
alter table projects add column if not exists "reraId" text;
alter table projects add column if not exists "exactPrice" text;
alter table projects add column if not exists "seoKeywords" text[];
alter table projects add column if not exists "metaDescription" text;
alter table projects add column if not exists "configurationDetails" jsonb;

-- 3. Verify Columns
select column_name 
from information_schema.columns 
where table_name = 'projects';

-- 4. Result
-- You should see 'reraId', 'configurationDetails', etc. in the output.
-- Now go to /admin/seed and click "Start Population" to see the Magic!
