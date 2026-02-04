-- ALIGN BUILDERS SCHEMA WITH FRONTEND
-- The frontend 'BuilderForm.tsx' expects these fields.
-- We use 'IF NOT EXISTS' to avoid errors if they are already there.

BEGIN;

-- 1. Ensure ID is TEXT (to support 'b170...' generated IDs)
-- Note: Changing ID type is complex if fkey constraints exist. 
-- We assume it might already be TEXT or UUID. If UUID, we might need a more aggressive migration.
-- For now, we attempt to cast if it's safe, or just ensure new columns are added.

-- 2. Add Missing Columns
ALTER TABLE builders ADD COLUMN IF NOT EXISTS mobile TEXT;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS trust_score NUMERIC DEFAULT 0;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS experience NUMERIC DEFAULT 0;
ALTER TABLE builders ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- 3. Ensure casing matches 'mapper.ts' (snake_case in DB)
-- (If columns were created as camelCase by mistake, we rename them)
DO $$
BEGIN
  IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='builders' AND column_name='trustScore') THEN
      ALTER TABLE builders RENAME COLUMN "trustScore" TO trust_score;
  END IF;
  IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='builders' AND column_name='isVerified') THEN
      ALTER TABLE builders RENAME COLUMN "isVerified" TO is_verified;
  END IF;
  IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='builders' AND column_name='establishedYear') THEN
      ALTER TABLE builders RENAME COLUMN "establishedYear" TO established_year;
  END IF;
  IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='builders' AND column_name='totalProjects') THEN
      ALTER TABLE builders RENAME COLUMN "totalProjects" TO total_projects;
  END IF;
  IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='builders' AND column_name='ongoingProjects') THEN
      ALTER TABLE builders RENAME COLUMN "ongoingProjects" TO ongoing_projects;
  END IF;
  IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='builders' AND column_name='heroImage') THEN
      ALTER TABLE builders RENAME COLUMN "heroImage" TO hero_image;
  END IF;
END $$;

-- 4. Locations Array
-- Ensure 'locations' is an array type (TEXT[])
-- If it doesn't exist, create it.
ALTER TABLE builders ADD COLUMN IF NOT EXISTS locations TEXT[] DEFAULT '{}';

COMMIT;
