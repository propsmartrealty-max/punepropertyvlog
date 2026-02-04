-- 1. Create Buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) VALUES ('website-assets', 'website-assets', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true) ON CONFLICT (id) DO NOTHING;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Object Read" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
DROP POLICY IF EXISTS "Auth Object Upload" ON storage.objects;
DROP POLICY IF EXISTS "Auth Object Update" ON storage.objects;
DROP POLICY IF EXISTS "Auth Object Delete" ON storage.objects;

-- 3. Create GLOBAL Public Access Policy (Read everything in buckets)
-- This allows anyone to view the images (Critical for Public Website)
CREATE POLICY "Public Object Read" ON storage.objects FOR SELECT USING (bucket_id IN ('website-assets', 'project-images'));

-- 4. Create Authenticated Upload/Delete Policies
CREATE POLICY "Auth Object Upload" ON storage.objects FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND bucket_id IN ('website-assets', 'project-images')
);

CREATE POLICY "Auth Object Update" ON storage.objects FOR UPDATE USING (
    auth.role() = 'authenticated' AND bucket_id IN ('website-assets', 'project-images')
);

CREATE POLICY "Auth Object Delete" ON storage.objects FOR DELETE USING (
    auth.role() = 'authenticated' AND bucket_id IN ('website-assets', 'project-images')
);
