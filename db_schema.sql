
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Migration: Add 'type' column if it doesn't exist
-- do $$ 
-- begin 
--     alter table projects add column type text check (type in ('Residential', 'Commercial', 'Plot')); 
-- exception 
--     when duplicate_column then null; 
-- end $$;

-- Projects Table
create table projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  "builderId" text, -- Storing as text for now to match current mock data ID style, or change to uuid if migrating builders too
  location text,
  "priceRange" text,
  configurations text[], -- Array of strings
  status text check (status in ('Ready to Move', 'Under Construction', 'New Launch')),
  type text check (type in ('Residential', 'Commercial', 'Plot')),
  "possessionDate" text,
  image text, -- URL
  "heroImage" text,
  "masterLayout" text,
  "floorPlans" text[],
  description text,
  features text[],
  specs jsonb, -- Storing specs as JSONB
  "connectionDetails" jsonb, -- For any extra connection info
  "createdAt" timestamp with time zone default timezone('utc'::text, now()) not null,
  "updatedAt" timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Builders Table
create table builders (
  id uuid default uuid_generate_v4() primary key, -- If you want to keep string IDs like 'b1', change type to text
  name text not null,
  slug text not null unique,
  logo text,
  "heroImage" text,
  description text,
  "establishedYear" integer,
  "totalProjects" integer,
  "ongoingProjects" integer,
  locations text[],
  "createdAt" timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table projects enable row level security;
alter table builders enable row level security;

-- Policies (Public Read, Authenticated Write)
create policy "Allow public read access on projects" on projects for select using (true);
create policy "Allow authenticated insert on projects" on projects for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated update on projects" on projects for update using (auth.role() = 'authenticated');
create policy "Allow authenticated delete on projects" on projects for delete using (auth.role() = 'authenticated');

create policy "Allow public read access on builders" on builders for select using (true);
create policy "Allow authenticated insert on builders" on builders for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated update on builders" on builders for update using (auth.role() = 'authenticated');
create policy "Allow authenticated delete on builders" on builders for delete using (auth.role() = 'authenticated');

-- Storage Buckets
insert into storage.buckets (id, name, public) values ('project-images', 'project-images', true);


-- Storage Policies
create policy "Public Access" on storage.objects for select using ( bucket_id = 'project-images' );
create policy "Auth Upload" on storage.objects for insert with check ( bucket_id = 'project-images' and auth.role() = 'authenticated' );

-- MIGRATION: Run this in Supabase SQL Editor to add SEO fields
-- alter table projects add column if not exists "reraId" text;
-- alter table projects add column if not exists "exactPrice" text;
-- alter table projects add column if not exists "seoKeywords" text[];
-- alter table projects add column if not exists "metaDescription" text;
