-- Add indexes to the 'projects' table to speed up filtering

-- Index for filtering by Location
CREATE INDEX IF NOT EXISTS idx_projects_location ON projects (location);

-- Index for filtering by Property Type (Residential, Commercial, Plot)
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects (type);

-- Index for filtering by Status (New Launch, Ready to Move, etc.)
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects (status);

-- Gin index for searching text descriptions (Optional but good for search bars)
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- CREATE INDEX IF NOT EXISTS idx_projects_description_search ON projects USING gin (description gin_trgm_ops);

-- Index for sorting by creation date (for "Newest First")
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects ("createdAt" DESC);
