
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log("🔍 Checking Schema for pricePerSqft and avgPriceSqft...");
    // Check Projects table for new columns
    const { data: projects, error: pError } = await supabase
        .from('projects')
        .select('id, title, pricePerSqft')
        .limit(1);

    if (pError) {
        console.error("❌ Projects Check Failed:", pError.message);
    } else {
        console.log("✅ Projects Table Accessible.");
        // Check if column exists (if it was selected successfully)
        // Supabase returns null for missing columns in select if permissive? No, it throws error usually if column invalid in strict mode.
        // Actually supabase js client just ignores it or returns error 'Could not find the column...'
        // Best way is to insert dummy or check validation.
        // But select should fail if column doesn't exist? 
        console.log("Sample Project Data:", projects);
    }

    // Check Localities table
    const { data: localities, error: lError } = await supabase
        .from('localities')
        .select('id, name, avgPriceSqft')
        .limit(1);

    if (lError) {
        console.error("❌ Localities Table/Column Check Failed:", lError.message);
    } else {
        console.log("✅ Localities Table & Column Accessible!");
        console.log("Sample Locality Data:", localities);
    }
}

checkSchema();
