-- Create Leads Table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  type TEXT NOT NULL, -- 'Site Visit', 'Brochure', 'Contact', 'Offer'
  project_id TEXT, -- Can be linked to a project ID or slug
  status TEXT DEFAULT 'New', -- 'New', 'Contacted', 'Closed', 'Invalid'
  metadata JSONB DEFAULT '{}', -- Store extra info like budget, source, specific query
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Public can INSERT leads (capturing inquiries)
CREATE POLICY "Public can insert leads" 
ON leads FOR INSERT 
TO public 
WITH CHECK (true);

-- 2. Authenticated users (Admins) can READ all leads
CREATE POLICY "Admins can view all leads" 
ON leads FOR SELECT 
TO authenticated 
USING (true);

-- 3. Authenticated users (Admins) can UPDATE leads (changing status)
CREATE POLICY "Admins can update leads" 
ON leads FOR UPDATE 
TO authenticated 
USING (true);

-- Realtime subscription for Admin Dashboard
ALTER PUBLICATION supabase_realtime ADD TABLE leads;
