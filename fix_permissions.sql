
-- Allow public (anon) users to insert data
-- This is needed because the "Seeder" runs in the browser without a real Supabase Auth session
create policy "Allow public insert on projects" on projects for insert with check (true);
create policy "Allow public insert on builders" on builders for insert with check (true);

-- Also allow updates if needed (e.g. for correcting data)
create policy "Allow public update on projects" on projects for update using (true);
create policy "Allow public update on builders" on builders for update using (true);
