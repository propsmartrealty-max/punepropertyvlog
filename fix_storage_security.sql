-- FIX STORAGE PERMISSIONS
-- This script enables file uploads for 'website-assets' and 'project-images'.

-- 1. Unrestriced Access to storage.buckets (Optional but helpful for admin)
-- (Usually managed by Supabase UI, but good to ensure)

-- 2. POLICIES FOR 'website-assets' (Builders, Banners)
BEGIN;

-- Allow Public READ (so images load on the website)
DROP POLICY IF EXISTS "Public Read website-assets" ON storage.objects;
CREATE POLICY "Public Read website-assets"
ON storage.objects FOR SELECT
USING ( bucket_id = 'website-assets' );

-- Allow Admin INSERT (Upload)
DROP POLICY IF EXISTS "Admin Insert website-assets" ON storage.objects;
CREATE POLICY "Admin Insert website-assets"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'website-assets' AND auth.role() = 'authenticated' );

-- Allow Admin UPDATE (Replace file)
DROP POLICY IF EXISTS "Admin Update website-assets" ON storage.objects;
CREATE POLICY "Admin Update website-assets"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'website-assets' AND auth.role() = 'authenticated' );

-- Allow Admin DELETE (Remove file)
DROP POLICY IF EXISTS "Admin Delete website-assets" ON storage.objects;
CREATE POLICY "Admin Delete website-assets"
ON storage.objects FOR DELETE
USING ( bucket_id = 'website-assets' AND auth.role() = 'authenticated' );


-- 3. POLICIES FOR 'project-images' (Projects)
-- Allow Public READ
DROP POLICY IF EXISTS "Public Read project-images" ON storage.objects;
CREATE POLICY "Public Read project-images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'project-images' );

-- Allow Admin INSERT
DROP POLICY IF EXISTS "Admin Insert project-images" ON storage.objects;
CREATE POLICY "Admin Insert project-images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'project-images' AND auth.role() = 'authenticated' );

-- Allow Admin UPDATE
DROP POLICY IF EXISTS "Admin Update project-images" ON storage.objects;
CREATE POLICY "Admin Update project-images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'project-images' AND auth.role() = 'authenticated' );

-- Allow Admin DELETE
DROP POLICY IF EXISTS "Admin Delete project-images" ON storage.objects;
CREATE POLICY "Admin Delete project-images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'project-images' AND auth.role() = 'authenticated' );

COMMIT;
