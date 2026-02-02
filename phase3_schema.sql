-- Phase 3: Price Intelligence Engine Schema

-- 1. Add Numeric Price Column to Projects
-- logic: we have 'priceRange' (text) but need 'pricePerSqft' (numeric) for math.
alter table projects 
add column if not exists "pricePerSqft" integer;

-- 2. Create Localities Table (Missing)
create table if not exists localities (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  "imageUrl" text,
  "averagePrice" text,
  "projectCount" integer default 0,
  "isFeatured" boolean default false,
  "createdAt" timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Add Numeric Avg Price to Localities
-- logic: to compare project price vs market average.
alter table localities 
add column if not exists "avgPriceSqft" integer;
