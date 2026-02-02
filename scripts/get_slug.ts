
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function getSlug() {
    const { data } = await supabase.from('projects').select('slug, location').limit(1);
    if (data && data.length > 0) {
        console.log("Slug:", data[0].slug);
        console.log("Location:", data[0].location);
    } else {
        console.log("No projects found.");
    }
}
getSlug();
