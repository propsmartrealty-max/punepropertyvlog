-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. RERA ID (Compliance)
alter table projects add column if not exists "reraId" text;

-- 2. Precise Pricing (e.g. "87.5 L" vs "80-90L")
alter table projects add column if not exists "exactPrice" text;

-- 3. SEO Keywords (Array of strings for Google Ranking)
alter table projects add column if not exists "seoKeywords" text[];

-- 4. Meta Description (Optimized for CTR)
alter table projects add column if not exists "metaDescription" text;

-- 5. Verification: Check if columns exist
select column_name, data_type 
from information_schema.columns 
where table_name = 'projects';
