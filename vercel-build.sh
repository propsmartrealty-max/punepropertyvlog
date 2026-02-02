#!/bin/bash
echo "🚀 Starting Custom Build Script..."

# Explicitly export variables
export VITE_SUPABASE_URL=$VITE_SUPABASE_URL
export VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
export VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

echo "Environment Variables Exported:"
echo "VITE_SUPABASE_URL: ${VITE_SUPABASE_URL:0:10}..."

# Run the standard build
# Note: We skip sitemap gen here to ensure success
vite build
