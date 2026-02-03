
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

async function testStorage() {
    console.log('📦 Testing Storage Upload (website-assets)...');

    // Create a dummy file buffer
    const buffer = Buffer.from('Testing upload from script ' + new Date().toISOString());
    const fileName = `test_upload_${Date.now()}.txt`;

    console.log(`Uploading ${fileName}...`);

    const { data, error } = await supabase.storage
        .from('website-assets')
        .upload(fileName, buffer);

    if (error) {
        console.error('❌ Upload Failed:', error);
        console.error('   Hint: Check Bucket Policies (Start fix_storage_buckets.sql if needed)');
    } else {
        console.log('✅ Upload Successful!');
        console.log('   Path:', data.path);

        // Cleanup
        console.log('🧹 Cleaning up test file...');
        const { error: delError } = await supabase.storage.from('website-assets').remove([fileName]);
        if (delError) console.error('   Warning: Delete failed:', delError.message);
        else console.log('   Test file deleted.');
    }
}

testStorage();
