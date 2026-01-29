-- Create Banners Table for Home Page Hero
create table if not exists banners (
  id uuid default uuid_generate_v4() primary key,
  title text,
  "imageUrl" text not null,
  link text,
  "isActive" boolean default true,
  "sortOrder" integer default 0,
  "createdAt" timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Localities Table for Locality Strip
create table if not exists localities (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  "imageUrl" text not null,
  "averagePrice" text,
  "projectCount" integer default 0,
  "isFeatured" boolean default false,
  "createdAt" timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies for Banners
alter table banners enable row level security;
create policy "Public Read Banners" on banners for select using (true);
create policy "Auth Write Banners" on banners for all using (auth.role() = 'authenticated');

-- RLS Policies for Localities
alter table localities enable row level security;
create policy "Public Read Localities" on localities for select using (true);
create policy "Auth Write Localities" on localities for all using (auth.role() = 'authenticated');

-- Ensure storage bucket exists (idempotent-ish)
insert into storage.buckets (id, name, public) 
values ('website-assets', 'website-assets', true)
on conflict (id) do nothing;

-- Storage Policies for website-assets
create policy "Public Access Assets" on storage.objects for select using ( bucket_id = 'website-assets' );
create policy "Auth Upload Assets" on storage.objects for insert with check ( bucket_id = 'website-assets' and auth.role() = 'authenticated' );
create policy "Auth Delete Assets" on storage.objects for delete using ( bucket_id = 'website-assets' and auth.role() = 'authenticated' );
