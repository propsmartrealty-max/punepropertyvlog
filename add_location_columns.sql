-- Add latitude and longitude columns to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS lat float8;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS lng float8;
