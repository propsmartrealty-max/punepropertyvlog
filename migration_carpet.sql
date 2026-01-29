-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Configuration Details (JSONB for rich data including Carpet Area)
alter table projects add column if not exists "configurationDetails" jsonb;

-- 2. Verification
select column_name, data_type 
from information_schema.columns 
where table_name = 'projects' and column_name = 'configurationDetails';
