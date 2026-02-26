import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const inspectSchema = async () => {
    try {
        // Query a single project to dump its keys
        const { data, error } = await supabase.from('projects').select('*').limit(1);
        if (error) throw error;

        if (data && data.length > 0) {
            console.log('--- Columns on projects table ---');
            console.log(Object.keys(data[0]).join(', '));
            console.log('---------------------------------');
        } else {
            console.log('No projects found to inspect.');
        }

    } catch (err) {
        console.error('Error inspecting schema:', err);
    }
};

inspectSchema();
