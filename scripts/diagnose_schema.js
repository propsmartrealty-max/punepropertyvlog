
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load env
const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabaseUrl = envConfig.VITE_SUPABASE_URL;
const supabaseKey = envConfig.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
    console.log('🔍 Starting Schema Diagnosis...\n');

    // 1. Inspect Builders Table
    console.log('--- Table: builders ---');
    // We can't query information_schema easily via JS client without strict permissions, 
    // but we can try inserting a dummy to see errors, OR just select one row to see structure.
    // Better: Select one row.
    const { data: builders, error: bError } = await supabase.from('builders').select('*').limit(1);

    if (bError) {
        console.error('❌ Error assessing builders:', bError.message);
    } else if (builders.length === 0) {
        console.log('⚠️  Table is empty. Columns unknown from data.');
        // Try to insert a dummy with specific fields to probe
    } else {
        const sample = builders[0];
        console.log('✅ Columns found:', Object.keys(sample).join(', '));
        console.log('   Sample ID Type:', typeof sample.id);
        console.log('   Sample ID Value:', sample.id);
    }

    // 2. Inspect Projects Table
    console.log('\n--- Table: projects ---');
    const { data: projects, error: pError } = await supabase.from('projects').select('*').limit(1);

    if (pError) {
        console.error('❌ Error assessing projects:', pError.message);
    } else if (projects.length === 0) {
        console.log('⚠️  Table is empty.');
    } else {
        const sample = projects[0];
        console.log('✅ Columns found:', Object.keys(sample).join(', '));
        console.log('   Sample Builder Field:', sample.builder_id ? 'builder_id' : sample.builderId ? 'builderId' : 'UNKNOWN');
        console.log('   Sample ID Value:', sample.id);
    }

    // 3. Check for Orphans
    console.log('\n--- Orphan Check ---');
    // We try to fetch projects where builder is missing.
    // This is hard via JS client without complex joins or multiple queries.
    // We'll just fetch all unique builder_ids from projects and check if they exist in builders.

    const { data: allProjects } = await supabase.from('projects').select('builder_id, builderId');
    const { data: allBuilders } = await supabase.from('builders').select('id');

    if (allProjects && allBuilders) {
        const builderIds = new Set(allBuilders.map(b => b.id));
        const missing = new Set();

        allProjects.forEach(p => {
            const bId = p.builder_id || p.builderId;
            if (bId && !builderIds.has(bId)) {
                missing.add(bId);
            }
        });

        if (missing.size > 0) {
            console.error('❌ Found ORPHAN projects pointing to these missing builders:');
            console.error(Array.from(missing));
        } else {
            console.log('✅ No orphans found. All projects point to valid builders.');
        }
    }

    console.log('\n🏁 Diagnosis Complete.');
}

diagnose();
