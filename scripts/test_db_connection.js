
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('---------------------------------------------------');
console.log('🔌 CONNECTION DIAGNOSTIC TOOL');
console.log('---------------------------------------------------');

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Environment Variables!');
    console.log(`   URL: ${supabaseUrl ? 'Set' : 'MISSING'}`);
    console.log(`   KEY: ${supabaseKey ? 'Set' : 'MISSING'}`);
    process.exit(1);
}

console.log(`✅ Environment Variables Detected`);
console.log(`   URL: ${supabaseUrl}`);
console.log(`   KEY: ${supabaseKey.substring(0, 10)}... (Masked)`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('\n🔄 Attempting to fetch 1 record from "builders"...');
    try {
        const { data, error } = await supabase.from('builders').select('*').limit(1);

        if (error) {
            console.error('❌ Connection Failed with Error:');
            console.error(error.message);
            if (error.code === 'PGRST301') console.log('   (Hint: Check Row Level Security or Table Permissions)');
            process.exit(1);
        }

        console.log('✅ Connection Sucessful!');
        console.log(`   Fetched ${data.length} records.`);
    } catch (err) {
        console.error('❌ Unexpected Error:', err);
    }
}

testConnection();
