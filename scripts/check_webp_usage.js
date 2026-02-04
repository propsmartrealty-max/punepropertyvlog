
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) { process.exit(1); }
const supabase = createClient(supabaseUrl, supabaseKey);

const checkWebP = async () => {
    // Check if ANY builder has a .webp image
    const { data, error } = await supabase
        .from('builders')
        .select('name, logo, hero_image')
        .or('logo.ilike.%.webp%,hero_image.ilike.%.webp%');

    if (error) {
        console.error('Error:', error);
        return;
    }

    if (data.length > 0) {
        console.log(`✅ Found ${data.length} builders with WebP images:`);
        data.forEach(b => console.log(`- ${b.name}`));
    } else {
        console.log('❌ No builders differ to .webp yet.');
    }
};

checkWebP();
