
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load env vars
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
    console.log('Testing upload to "project-images" bucket...');

    // Create a dummy file buffer
    const buffer = Buffer.from('test image content');
    const fileName = `debug_test_${Date.now()}.txt`;

    try {
        const { data, error } = await supabase.storage
            .from('project-images')
            .upload(fileName, buffer, {
                contentType: 'text/plain',
                upsert: true
            });

        if (error) {
            console.error('❌ Upload Failed!');
            console.error('Error:', error);
            if (error.statusCode === '403') {
                console.error('-> Authorization Error. Check RLS Policies.');
            }
        } else {
            console.log('✅ Upload Success!');
            console.log('Path:', data.path);

            // Clean up
            await supabase.storage.from('project-images').remove([fileName]);
            console.log('Cleaned up test file.');
        }

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testUpload();
