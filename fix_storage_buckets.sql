-- Fix Storage Buckets & Policies (Robust Version)
-- This script handles "Already Exists" errors by removing old policies first.

-- 1. Ensure Buckets Exist
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('website-assets', 'website-assets', true)
on conflict (id) do nothing;

-- 2. Drop Conflicting Policies (The Fix)
drop policy if exists "Public Access Assets" on storage.objects;
drop policy if exists "Auth Upload Assets" on storage.objects;
drop policy if exists "Auth Delete Assets" on storage.objects;

drop policy if exists "Give public access to public buckets" on storage.objects;
drop policy if exists "Allow authenticated uploads" on storage.objects;
drop policy if exists "Allow authenticated updates" on storage.objects;
drop policy if exists "Allow authenticated deletes" on storage.objects;

-- 3. Create Clean Policies
-- Allow public read access to both buckets
create policy "Give public access to public buckets"
on storage.objects for select
using ( bucket_id in ('project-images', 'website-assets') );

-- Allow authenticated users to upload to both buckets
create policy "Allow authenticated uploads"
on storage.objects for insert
with check (
  bucket_id in ('project-images', 'website-assets')
  and auth.role() = 'authenticated'
);

-- Allow authenticated users to update/delete in both buckets
create policy "Allow authenticated updates"
on storage.objects for update
using (
  bucket_id in ('project-images', 'website-assets')
  and auth.role() = 'authenticated'
);

create policy "Allow authenticated deletes"
on storage.objects for delete
using (
  bucket_id in ('project-images', 'website-assets')
  and auth.role() = 'authenticated'
);

-- 4. Reload Schema Cache
NOTIFY pgrst, 'reload config';
