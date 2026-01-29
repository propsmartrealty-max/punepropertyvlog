-- Create Storage Buckets if they don't exist
insert into storage.buckets (id, name, public) 
values 
  ('website-assets', 'website-assets', true),
  ('project-images', 'project-images', true)
on conflict (id) do nothing;

-- Drop existing policies to ensure clean slate (optional but safer for idempotency if policies changed)
drop policy if exists "Public Access Assets" on storage.objects;
drop policy if exists "Auth Upload Assets" on storage.objects;
drop policy if exists "Auth Delete Assets" on storage.objects;

drop policy if exists "Public Access Project Images" on storage.objects;
drop policy if exists "Auth Upload Project Images" on storage.objects;
drop policy if exists "Auth Delete Project Images" on storage.objects;

-- Policies for website-assets
create policy "Public Access Assets" on storage.objects for select using ( bucket_id = 'website-assets' );
create policy "Auth Upload Assets" on storage.objects for insert with check ( bucket_id = 'website-assets' and auth.role() = 'authenticated' );
create policy "Auth Delete Assets" on storage.objects for delete using ( bucket_id = 'website-assets' and auth.role() = 'authenticated' );

-- Policies for project-images
create policy "Public Access Project Images" on storage.objects for select using ( bucket_id = 'project-images' );
create policy "Auth Upload Project Images" on storage.objects for insert with check ( bucket_id = 'project-images' and auth.role() = 'authenticated' );
create policy "Auth Delete Project Images" on storage.objects for delete using ( bucket_id = 'project-images' and auth.role() = 'authenticated' );
