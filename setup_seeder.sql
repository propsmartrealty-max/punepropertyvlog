
-- 1. Add the 'type' column for Residential/Commercial distinction
-- We use a DO block to safely add it even if it might already exist (idempotent)
do $$ 
begin 
    alter table projects add column type text check (type in ('Residential', 'Commercial', 'Plot')); 
exception 
    when duplicate_column then null; 
end $$;

-- 2. Allow the Seeder to insert data (Permissions)
-- Drop existing policies to avoid conflicts if you ran them before
drop policy if exists "Allow public insert on projects" on projects;
drop policy if exists "Allow public insert on builders" on builders;
drop policy if exists "Allow public update on projects" on projects;
drop policy if exists "Allow public update on builders" on builders;

-- Re-create policies
create policy "Allow public insert on projects" on projects for insert with check (true);
create policy "Allow public insert on builders" on builders for insert with check (true);
create policy "Allow public update on projects" on projects for update using (true);
create policy "Allow public update on builders" on builders for update using (true);
