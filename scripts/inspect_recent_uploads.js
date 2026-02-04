
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const inspectUploads = async () => {
    console.log('🔍 Inspecting Recent Uploads in "website-assets"...');

    const { data: files, error } = await supabase.storage
        .from('website-assets')
        .list('', {
            limit: 5,
            offset: 0,
            sortBy: { column: 'created_at', order: 'desc' }
        });

    if (error) {
        console.error('❌ Error listing files:', error);
        return;
    }

    if (!files || files.length === 0) {
        console.log('⚠️ No files found.');
        return;
    }

    console.log(`✅ Found ${files.length} recent files.`);

    for (const file of files) {
        console.log('---------------------------------------------------');
        console.log(`📂 Name: ${file.name}`);
        console.log(`📏 Size: ${file.metadata ? file.metadata.size : 'Unknown'} bytes`);
        console.log(`📅 Created: ${file.created_at}`);
        console.log(`📄 Type: ${file.metadata ? file.metadata.mimetype : 'Unknown'}`);

        const { data: { publicUrl } } = supabase.storage
            .from('website-assets')
            .getPublicUrl(file.name);

        console.log(`🔗 URL: ${publicUrl}`);

        try {
            const response = await fetch(publicUrl, { method: 'HEAD' });
            console.log(`HTTP Status: ${response.status} ${response.statusText}`);
            console.log(`Content-Type: ${response.headers.get('content-type')}`);
            console.log(`Content-Length: ${response.headers.get('content-length')}`);
        } catch (fetchErr) {
            console.error(`❌ Failed to fetch URL: ${fetchErr.message}`);
        }
    }
};

inspectUploads();
