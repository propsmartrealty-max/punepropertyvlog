
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

// Client with ANON key
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
    console.log("🕵️ testing RLS with Anon Key...");

    // Try to insert a dummy project
    const { data, error } = await supabase
        .from('projects')
        .insert([{
            title: "RLS Test Project",
            slug: "rls-test-project",
            builderId: "b1", // Assuming b1 exists or mocked
            location: "Test Loc",
            priceRange: "1Cr",
            configurations: ["2 BHK"],
            status: "New Launch",
            description: "RLS Test",
            type: "Residential"
        }])
        .select()
        .single();

    if (error) {
        console.error("❌ Projects Insert Failed (Secure!):", error.message);
    } else {
        console.log("⚠️ Projects Insert Succeeded! RLS is NOT enforcing authentication.");
        // Clean up
        await supabase.from('projects').delete().eq('id', data.id);
    }
}

testInsert();
