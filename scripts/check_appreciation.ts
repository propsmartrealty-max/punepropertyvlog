
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

async function checkColumn() {
    console.log("Checking for appreciation_rate column...");
    const { data, error } = await supabase
        .from('localities')
        .select('appreciation_rate')
        .limit(1);

    if (error) {
        console.log("Column likely missing or error:", error.message);
    } else {
        console.log("Column exists or at least select worked:", data);
    }
}

checkColumn();
