-- Create a table for leads/property submissions
create table if not exists leads (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  mobile text not null,
  email text,
  type text not null, -- 'Sell Property', 'Rent Out', 'Inquiry'
  property_type text, -- 'Apartment', 'Villa', etc.
  location text,
  price text,
  message text,
  status text default 'New', -- 'New', 'Contacted', 'Closed'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table leads enable row level security;

-- 0. DROP existing policies to prevent "already exists" errors
DROP POLICY IF EXISTS "Enable insert for everyone" ON leads;
DROP POLICY IF EXISTS "Enable read for everyone" ON leads;
DROP POLICY IF EXISTS "Enable update for everyone" ON leads;
DROP POLICY IF EXISTS "Enable delete for everyone" ON leads;

-- Policy: Allow public to insert (Post Property form)
create policy "Enable insert for everyone" on leads for insert with check (true);

-- Policy: Allow admins/authenticated users to view (Admin Panel)
-- For simplicity in this dev mode allowing public read (or anon key read) but realistically should be stricter.
-- However, since we use anon key for everything in this setup:
create policy "Enable read for everyone" on leads for select using (true);

-- Policy: Allow delete/update for everyone (Active Admin management)
create policy "Enable update for everyone" on leads for update using (true);
create policy "Enable delete for everyone" on leads for delete using (true);
