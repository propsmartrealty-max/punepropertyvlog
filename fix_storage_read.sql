-- Ensure 'anon' (public) users can view files
begin;
-- Drop existing select policy if exists to avoid conflicts
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Forced Public View" on storage.objects;

-- Create a permissive select policy for our buckets
create policy "Forced Public View"
on storage.objects for select
to public
using ( bucket_id in ('project-images', 'website-assets') );

commit;
