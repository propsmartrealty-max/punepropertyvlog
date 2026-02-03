
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Environment Variables!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
    console.log('\n🔍 Inspecting "builders" table...');
    const { data, error } = await supabase.from('builders').select('*');

    if (error) {
        console.error('❌ Error fetching builders:', error);
        return;
    }

    console.log(`✅ Found ${data.length} builders.`);
    data.forEach(b => {
        console.log(`--------------------------------------------------`);
        console.log(`ID: ${b.id}`);
        console.log(`Name: ${b.name}`);
        console.log(`Slug: ${b.slug}`); // Added Slug
        console.log(`Logo (DB):`, b.logo);
        console.log(`Hero Image (DB):`, b.hero_image || b.heroImage); // Check both casings
        console.log(`Trust Score:`, b.trust_score || b.trustScore);
    });
}

inspect();
