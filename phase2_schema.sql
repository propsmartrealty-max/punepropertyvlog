-- Phase 2 Migration: Advanced Data & Pricing

-- 1. Create a table for specific Unit Configurations (1 BHK, 2 BHK, etc.)
-- This replaces the simple 'configurations' text array in the main projects table for better precision.
create table if not exists project_configurations (
  id uuid default uuid_generate_v4() primary key,
  "projectId" uuid references projects(id) on delete cascade not null,
  name text not null, -- e.g., "2 BHK Luxury", "3 BHK Premium"
  "carpetArea" integer not null, -- in sq ft
  "balconyArea" integer default 0, -- in sq ft
  "bathrooms" integer default 1,
  
  -- Pricing Engine Components
  "basePrice" numeric not null, -- Base agreement cost or rate (decide logic: usually total agreement value or rate/sqft)
  -- Let's stick to Total Base Agreement Value for simplicity, or Rate per sqft. 
  -- Given "Real Time", usually Rate per sqft is better + Floor Rise. 
  -- Let's go with "Base Agreement Value" for a standard floor (e.g. 1st floor) for now, 
  -- or "Price Per Sqft" if user wants dynamic. 
  -- Strategy Plan said: Base Rate + Floor Rise.
  "pricePerSqft" numeric, 
  
  -- Fixed Extras
  "infraCharges" numeric default 0, -- Development charges, etc.
  "clubhouseCharges" numeric default 0,
  
  -- Taxes (Can be calculated, but good to override)
  "gstRate" numeric default 5.0, -- Percent
  "stampDutyRate" numeric default 7.0, -- Percent
  "registrationCharges" numeric default 30000, -- Fixed usually
  
  "layoutImage" text, -- Specific floor plan for this unit
  "createdAt" timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Add RERA and Verification fields to Main Projects Table
alter table projects 
add column if not exists "reraId" text,
add column if not exists "verificationStatus" text default 'Pending' check ("verificationStatus" in ('Pending', 'Verified', 'Rejected')),
add column if not exists "verificationSource" text; -- Link to MahaRERA PDF if available

-- 3. Enable RLS for new table
alter table project_configurations enable row level security;

create policy "Allow public read access on configurations" on project_configurations for select using (true);
create policy "Allow authenticated insert on configurations" on project_configurations for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated update on configurations" on project_configurations for update using (auth.role() = 'authenticated');
create policy "Allow authenticated delete on configurations" on project_configurations for delete using (auth.role() = 'authenticated');
