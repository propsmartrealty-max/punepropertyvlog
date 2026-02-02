#!/bin/bash

echo "🚀 Starting Custom Build Script..."

# Explicitly export known variables to ensure they are available
# (Vercel exposes these as $NAME, but sometimes Vite needs help)
export VITE_SUPABASE_URL=$VITE_SUPABASE_URL
export VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
export VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

echo "Environment Variables Exported:"
echo "VITE_SUPABASE_URL: ${VITE_SUPABASE_URL:0:10}..."

# Run the standard build
npm run build
