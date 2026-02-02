
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function inspect(table) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
        console.error(`Error selecting from ${table}:`, error.message);
    } else if (data && data.length > 0) {
        console.log(`Columns in ${table}:`, Object.keys(data[0]));
    } else {
        console.log(`${table} is empty, cannot infer columns from data.`);
        // Try invalid select to trigger error with column suggestions if possible, or just proceed
    }
}

async function main() {
    await inspect('builders');
    await inspect('projects');
}

main();
