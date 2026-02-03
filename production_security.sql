-- Enable RLS on all tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE builders ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE localities ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 1. PROPERTIES POLICIES
-- Public Read Access
CREATE POLICY "Public Properties Read" ON properties
FOR SELECT USING (true);

-- Admin Full Access
CREATE POLICY "Admin Properties Full" ON properties
FOR ALL USING (auth.role() = 'authenticated');

-- 2. BANNERS POLICIES
-- Public Read Access
CREATE POLICY "Public Banners Read" ON banners
FOR SELECT USING (true);

-- Admin Full Access
CREATE POLICY "Admin Banners Full" ON banners
FOR ALL USING (auth.role() = 'authenticated');

-- 3. BUILDERS POLICIES
-- Public Read Access
CREATE POLICY "Public Builders Read" ON builders
FOR SELECT USING (true);

-- Admin Full Access
CREATE POLICY "Admin Builders Full" ON builders
FOR ALL USING (auth.role() = 'authenticated');

-- 4. PROJECTS POLICIES
-- Public Read Access
CREATE POLICY "Public Projects Read" ON projects
FOR SELECT USING (true);

-- Admin Full Access
CREATE POLICY "Admin Projects Full" ON projects
FOR ALL USING (auth.role() = 'authenticated');

-- 5. LOCALITIES POLICIES
-- Public Read Access
CREATE POLICY "Public Localities Read" ON localities
FOR SELECT USING (true);

-- Admin Full Access
CREATE POLICY "Admin Localities Full" ON localities
FOR ALL USING (auth.role() = 'authenticated');

-- 6. LEADS POLICIES
-- Public can INSERT (Contact Form)
CREATE POLICY "Public Insert Leads" ON leads
FOR INSERT WITH CHECK (true);

-- Admin can VIEW leads
CREATE POLICY "Admin View Leads" ON leads
FOR SELECT USING (auth.role() = 'authenticated');

-- Admin can DELETE leads (optional)
CREATE POLICY "Admin Delete Leads" ON leads
FOR DELETE USING (auth.role() = 'authenticated');
