-- Create Banners Table if not exists
CREATE TABLE IF NOT EXISTS banners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT,
    image_url TEXT NOT NULL,
    link TEXT,
    isActive BOOLEAN DEFAULT true,
    sortOrder INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- 1. DROP existing policies to prevent "already exists" errors
DROP POLICY IF EXISTS "Public can view banners" ON banners;
DROP POLICY IF EXISTS "Admins can insert banners" ON banners;
DROP POLICY IF EXISTS "Admins can update banners" ON banners;
DROP POLICY IF EXISTS "Admins can delete banners" ON banners;
DROP POLICY IF EXISTS "Admins can manage banners" ON banners; -- In case you ran the refined version

-- 2. Re-create Policies
CREATE POLICY "Public can view banners" 
ON banners FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Admins can insert banners" 
ON banners FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Admins can update banners" 
ON banners FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Admins can delete banners" 
ON banners FOR DELETE 
TO authenticated 
USING (true);

-- 3. Grant permissions (idempotent)
GRANT ALL ON banners TO authenticated;
GRANT SELECT ON banners TO anon;
GRANT SELECT ON banners TO service_role;
