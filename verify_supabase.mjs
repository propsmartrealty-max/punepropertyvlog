
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

async function main() {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf-8');

        const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
        const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

        const url = urlMatch ? urlMatch[1].trim() : null;
        const key = keyMatch ? keyMatch[1].trim() : null;

        if (!url || !key) {
            console.error("Missing URL or Key in .env.local");
            return;
        }

        console.log(`Connecting to: ${url}`);
        console.log(`Using Key: ${key.slice(0, 5)}...`);

        const supabase = createClient(url, key);

        // Try to select from projects (even if empty, it verifies auth/connection)
        const { data, error } = await supabase.from('projects').select('*').limit(1);

        if (error) {
            console.error("Supabase Error:", error);
            if (error.code === 'PGRST301') {
                console.log("Tip: PGRST301 usually means Row Level Security (RLS) is blocking access. Or the table doesn't exist.");
            }
        } else {
            console.log("Connection SUCCESSFUL!");
            console.log("Data retrieved:", data);
        }

    } catch (err) {
        console.error("Script Error:", err);
    }
}

main();
