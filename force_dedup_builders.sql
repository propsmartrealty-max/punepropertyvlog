-- FORCE CLEANUP DUPLICATES
-- The previous JS script failed to delete the duplicate (likely RLS).
-- We will delete by ID directly using SQL (Admin).

-- 1. Identify and Delete the "Seed Data" version (Imgur logo)
-- ID: 89d09850-aeed-4b57-adcc-1b2f0d65189a (Slug: godrej-properties-ltd)
DELETE FROM builders 
WHERE id = '89d09850-aeed-4b57-adcc-1b2f0d65189a';

-- 2. Ensure Projects linked to the deleted builder are moved to the "Kept" builder
-- Kept ID: 2321bf38-56d4-4971-ba3b-2796d1da5085 (Slug: godrej-properties)
UPDATE projects 
SET builder_id = '2321bf38-56d4-4971-ba3b-2796d1da5085' 
WHERE builder_id = '89d09850-aeed-4b57-adcc-1b2f0d65189a';

-- 3. Also check camelCase builderId column
UPDATE projects 
SET "builderId" = '2321bf38-56d4-4971-ba3b-2796d1da5085' 
WHERE "builderId" = '89d09850-aeed-4b57-adcc-1b2f0d65189a';


-- 4. Delete VTP Realty Duplicate if exists
-- Winner: 3116509b-b33c-4508-9eac-463a6a02dcba
-- Loser: da8c4977-d422-42b2-9a57-79fbce42bbeb
DELETE FROM builders WHERE id = 'da8c4977-d422-42b2-9a57-79fbce42bbeb';

-- Move VTP Projects
UPDATE projects 
SET builder_id = '3116509b-b33c-4508-9eac-463a6a02dcba' 
WHERE builder_id = 'da8c4977-d422-42b2-9a57-79fbce42bbeb';

UPDATE projects 
SET "builderId" = '3116509b-b33c-4508-9eac-463a6a02dcba' 
WHERE "builderId" = 'da8c4977-d422-42b2-9a57-79fbce42bbeb';
