
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const inspectBuilder = async () => {
    // Select all columns to avoid guessing names
    const { data, error } = await supabase
        .from('builders')
        .select('*')
        .ilike('name', '%Krisala%')
        .limit(1);

    if (error) {
        console.error('❌ Error fetching:', error);
        return;
    }
    const builder = data[0];
    console.log('Builder:', builder.name);
    console.log('Logo:', builder.logo);
    console.log('Hero (raw):', builder.hero_image || builder.heroImage);

    // Check URLs
    if (builder.logo) {
        console.log('Checking Logo URL:', builder.logo);
        try {
            const res = await fetch(builder.logo, { method: 'HEAD' });
            console.log(`Logo Status: ${res.status}`);
            console.log(`Logo Content-Type: ${res.headers.get('content-type')}`);
        } catch (e) { console.error('Logo Fetch Error:', e.message); }
    }

    // Check Hero
    const hero = builder.hero_image || builder.heroImage;
    if (hero) {
        console.log('Checking Hero URL:', hero);
        try {
            const res = await fetch(hero, { method: 'HEAD' });
            console.log(`Hero Status: ${res.status}`);
            console.log(`Hero Content-Type: ${res.headers.get('content-type')}`);
        } catch (e) { console.error('Hero Fetch Error:', e.message); }
    }
};

inspectBuilder();
