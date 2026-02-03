
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
// Note: Using ANON key. If RLS requires Auth, this might fail unless we sign in or use Service Role.
// But we want to simulate the Frontend which uses Anon Key + Auth Session.
// Simulating Auth Session in script is hard without password.
// SO: We will output if we can't update.
// Actually, I'll use the ANON key first. If it fails, we know RLS is active. 
// But "Admin Update" requires 'authenticated'. So Update via Anon Key SHOULD fail with 401/403.
// Wait, if it fails with 401, that confirms RLS is working. 
// But the User IS logged in on the frontend.
// The question is: Why does the Frontend (Authenticated) fail?

// I'll try to fetch first (Public Read).

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpdate() {
    // 1. Fetch Godrej
    const { data: builders } = await supabase.from('builders').select('*').ilike('name', '%Godrej%').limit(1);
    if (!builders || builders.length === 0) {
        console.log("No Godrej found.");
        return;
    }
    const builder = builders[0];
    console.log(`Targeting Builder: ${builder.name} (${builder.id})`);

    // 2. Try Update (Expect Failure if RLS works and we are anon)
    console.log("Attempting Update via ANON Key (Should fail if RLS is on)...");
    const { error } = await supabase.from('builders').update({ logo: 'https://test-logo.com/img.png' }).eq('id', builder.id);

    if (error) {
        console.log("Update Result: FAILED (Expected if RLS is on)");
        console.log("Error:", error.message);
    } else {
        console.log("Update Result: SUCCESS (RLS might be open or allowed)");
    }
}

testUpdate();
