-- 1. Drop existing policies to prevent "Already Exists" error
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Authenticated Uploads" on storage.objects;
drop policy if exists "Public Access Assets" on storage.objects;
drop policy if exists "Authenticated Uploads Assets" on storage.objects;
drop policy if exists "Allow Uploads" on storage.objects;
drop policy if exists "Allow Deletes" on storage.objects;

-- 2. Ensure Buckets Exist
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('website-assets', 'website-assets', true)
on conflict (id) do nothing;

-- 3. Create Permissive Policies (Read/Write for everyone for dev simplicity)
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id in ('project-images', 'website-assets') );

create policy "Allow Uploads"
  on storage.objects for insert
  with check ( bucket_id in ('project-images', 'website-assets') );

create policy "Allow Deletes"
  on storage.objects for delete
  using ( bucket_id in ('project-images', 'website-assets') );
