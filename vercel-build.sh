#!/bin/bash
echo "🚀 Starting Debug Build Script..."

echo "---------------------------------------------------"
echo "🔍 ENV VAR DIAGNOSTICS (Shell Layer)"
echo "---------------------------------------------------"
# List all keys starting with VITE or SUPABASE (values masked)
printenv | grep -E '^(VITE|SUPABASE)' | sed 's/=.*/=******/'
echo "---------------------------------------------------"

# Explicit check for specific expected keys
if [ -z "$VITE_SUPABASE_URL" ]; then
  echo "❌ VITE_SUPABASE_URL is EMPTY in shell!"
else
  echo "✅ VITE_SUPABASE_URL found (length: ${#VITE_SUPABASE_URL})"
fi

if [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
  echo "❌ VITE_SUPABASE_ANON_KEY is EMPTY in shell!"
else
  echo "✅ VITE_SUPABASE_ANON_KEY found (length: ${#VITE_SUPABASE_ANON_KEY})"
fi
echo "---------------------------------------------------"

# Explicitly export just in case
export VITE_SUPABASE_URL=$VITE_SUPABASE_URL
export VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
export VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

# Run the build
echo "🏃 Running Vite Build..."
vite build
