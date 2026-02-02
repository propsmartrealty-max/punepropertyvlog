-- Add appreciation_rate for Price Trend Graphs
ALTER TABLE localities 
ADD COLUMN IF NOT EXISTS appreciation_rate NUMERIC DEFAULT 7.5;

-- Add last_updated to track when data was modified
ALTER TABLE localities 
ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create a function to automatically update last_updated
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to call the function before update
DROP TRIGGER IF EXISTS update_localities_modtime ON localities;
CREATE TRIGGER update_localities_modtime
    BEFORE UPDATE ON localities
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
