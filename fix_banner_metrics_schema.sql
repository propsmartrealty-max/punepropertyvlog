-- Rename 'isActive' or 'isactive' to standard 'is_active'
DO $$
BEGIN
    -- Check for 'isActive' (quoted/case-sensitive)
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'banners' 
        AND column_name = 'isActive'
    ) THEN
        ALTER TABLE banners RENAME COLUMN "isActive" TO is_active;
    END IF;

    -- Check for 'isactive' (lowercase/unquoted creation)
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'banners' 
        AND column_name = 'isactive'
    ) THEN
        ALTER TABLE banners RENAME COLUMN isactive TO is_active;
    END IF;
END $$;
