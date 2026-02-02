
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
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyLeadsTable() {
    console.log("🔍 Checking Leads Tables...");

    // Attempt to select from leads table
    const { data, error } = await supabase
        .from('leads')
        .select('*')
        .limit(1);

    if (error) {
        console.error("❌ Leads Table verification failed:", error.message);
        console.log("👉 Please running 'setup_leads.sql' in your Supabase SQL Editor.");
    } else {
        console.log("✅ Leads Table exists and is accessible.");
        console.log("Count:", data.length);
    }
}

verifyLeadsTable();
