-- FORCE CLEANUP DUPLICATES (Fixed Column Name)
-- The projects table uses "builderId" (camelCase), so we must quote it.

-- 1. Identify and Delete the "Seed Data" version (Imgur logo)
-- ID: 89d09850-aeed-4b57-adcc-1b2f0d65189a (Slug: godrej-properties-ltd)
DELETE FROM builders 
WHERE id = '89d09850-aeed-4b57-adcc-1b2f0d65189a';

-- 2. Ensure Projects linked to the deleted builder are moved to the "Kept" builder
-- Kept ID: 2321bf38-56d4-4971-ba3b-2796d1da5085 (Slug: godrej-properties)
UPDATE projects 
SET "builderId" = '2321bf38-56d4-4971-ba3b-2796d1da5085' 
WHERE "builderId" = '89d09850-aeed-4b57-adcc-1b2f0d65189a';

-- 3. Delete VTP Realty Duplicate if exists
-- Winner: 3116509b-b33c-4508-9eac-463a6a02dcba
DELETE FROM builders WHERE id = 'da8c4977-d422-42b2-9a57-79fbce42bbeb';

-- Move VTP Projects
UPDATE projects 
SET "builderId" = '3116509b-b33c-4508-9eac-463a6a02dcba' 
WHERE "builderId" = 'da8c4977-d422-42b2-9a57-79fbce42bbeb';
