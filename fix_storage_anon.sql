-- Forcefully allow public (anon) uploads to project-images
-- This is often needed if the user is not authenticated with Supabase Auth (using custom auth or none)

begin;

-- Drop existing policies to be clean
drop policy if exists "Allow Uploads" on storage.objects;
drop policy if exists "Forced Anon Uploads" on storage.objects;

-- Create a policy specifically for the 'anon' role (public users)
create policy "Forced Anon Uploads"
on storage.objects for insert
to anon
with check ( bucket_id = 'project-images' );

-- Also allow update/delete for dev convenience
create policy "Forced Anon Updates"
on storage.objects for update
to anon
using ( bucket_id = 'project-images' );

create policy "Forced Anon Deletes"
on storage.objects for delete
to anon
using ( bucket_id = 'project-images' );

commit;
