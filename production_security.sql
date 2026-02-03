-- Enable RLS on all tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE builders ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE localities ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 1. PROPERTIES POLICIES
DROP POLICY IF EXISTS "Public Properties Read" ON properties;
CREATE POLICY "Public Properties Read" ON properties FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Properties Full" ON properties;
CREATE POLICY "Admin Properties Full" ON properties FOR ALL USING (auth.role() = 'authenticated');

-- 2. BANNERS POLICIES
DROP POLICY IF EXISTS "Public Banners Read" ON banners;
CREATE POLICY "Public Banners Read" ON banners FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Banners Full" ON banners;
CREATE POLICY "Admin Banners Full" ON banners FOR ALL USING (auth.role() = 'authenticated');

-- 3. BUILDERS POLICIES
DROP POLICY IF EXISTS "Public Builders Read" ON builders;
CREATE POLICY "Public Builders Read" ON builders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Builders Full" ON builders;
CREATE POLICY "Admin Builders Full" ON builders FOR ALL USING (auth.role() = 'authenticated');

-- 4. PROJECTS POLICIES
DROP POLICY IF EXISTS "Public Projects Read" ON projects;
CREATE POLICY "Public Projects Read" ON projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Projects Full" ON projects;
CREATE POLICY "Admin Projects Full" ON projects FOR ALL USING (auth.role() = 'authenticated');

-- 5. LOCALITIES POLICIES
DROP POLICY IF EXISTS "Public Localities Read" ON localities;
CREATE POLICY "Public Localities Read" ON localities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Localities Full" ON localities;
CREATE POLICY "Admin Localities Full" ON localities FOR ALL USING (auth.role() = 'authenticated');

-- 6. LEADS POLICIES
DROP POLICY IF EXISTS "Public Insert Leads" ON leads;
CREATE POLICY "Public Insert Leads" ON leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin View Leads" ON leads;
CREATE POLICY "Admin View Leads" ON leads FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin Delete Leads" ON leads;
CREATE POLICY "Admin Delete Leads" ON leads FOR DELETE USING (auth.role() = 'authenticated');
