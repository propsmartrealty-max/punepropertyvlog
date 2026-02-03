-- Rename 'imageurl' (created by unquoted CamelCase) to standard 'image_url'
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'banners' 
        AND column_name = 'imageurl'
    ) THEN
        ALTER TABLE banners RENAME COLUMN imageurl TO image_url;
    END IF;
END $$;

-- If for any reason it was created as "imageUrl" (quoted), rename that too
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'banners' 
        AND column_name = 'imageUrl'
    ) THEN
        ALTER TABLE banners RENAME COLUMN "imageUrl" TO image_url;
    END IF;
END $$;
