
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyStorage() {
    console.log('🔍 Verifying Supabase Storage System...');
    const bucketName = 'website-assets';
    const testFileName = `test-upload-${Date.now()}.txt`;
    const testFileContent = 'This is a test file to verify storage permissions.';

    try {
        // 1. Check if bucket exists (publicly usually can't list buckets, but we can try to upload)
        console.log(`\n📂 Target Bucket: '${bucketName}'`);

        // 2. Upload File
        console.log(`\n⬆️  Attempting Upload: ${testFileName}`);
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(testFileName, testFileContent, {
                contentType: 'text/plain',
                upsert: true
            });

        if (uploadError) {
            console.error('❌ Upload Failed:', uploadError.message);
            console.error('   Hint: Check RLS Policies for INSERT permissions on storage.objects');
            return;
        }
        console.log('✅ Upload Successful!', uploadData);

        // 3. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(testFileName);

        console.log(`\n🔗 Public URL: ${publicUrl}`);

        // 4. Verify Access (Optional fetch)
        console.log('   (You can open this URL in browser to verify read access)');

        // 5. Delete File
        console.log(`\n🗑️  Attempting Delete: ${testFileName}`);
        const { error: deleteError } = await supabase.storage
            .from(bucketName)
            .remove([testFileName]);

        if (deleteError) {
            console.error('❌ Delete Failed:', deleteError.message);
            console.error('   Hint: Check RLS Policies for DELETE permissions');
        } else {
            console.log('✅ Delete Successful!');
        }

        console.log('\n🎉 Image Management System (Infrastructure) appears HEALTHY.');

    } catch (err) {
        console.error('❌ Unexpected Error:', err);
    }
}

verifyStorage();
