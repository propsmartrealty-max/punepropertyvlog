-- Add Trust Score related columns to builders table
ALTER TABLE builders 
ADD COLUMN IF NOT EXISTS "experience" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "trustScore" NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS "isVerified" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "mobile" TEXT; -- Already present in some types, ensuring it's in DB

-- Comment on columns for clarity
COMMENT ON COLUMN builders.experience IS 'Years of experience in real estate';
COMMENT ON COLUMN builders."trustScore" IS 'Manual trust score from 0-10';
COMMENT ON COLUMN builders."isVerified" IS 'Whether the builder is verified by admin';
