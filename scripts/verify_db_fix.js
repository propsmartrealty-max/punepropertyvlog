
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

async function verifyFix() {
    console.log('🧪 Starting Post-Fix Verification...\n');

    // 1. Create a Test Builder (verifies TEXT ID + snake_case columns)
    const builderId = `b_verify_${Date.now()}`;
    console.log(`1️⃣  Creating Builder: ${builderId}...`);

    // Note: We use snake_case here because we verified the DB is now snake_case
    const builderPayload = {
        id: builderId,
        name: 'Verification Builder',
        slug: `verify-builder-${Date.now()}`,
        description: 'Created by verify_db_fix.js',
        is_verified: true,
        trust_score: 9.5,
        established_year: 2025
    };

    const { error: bError } = await supabase.from('builders').insert([builderPayload]);

    if (bError) {
        console.error('❌ Builder Creation Failed:', bError);
        process.exit(1);
    }
    console.log('✅ Builder Created!');

    // 2. Create a Test Project (verifies Foreign Key + snake_case columns)
    const projectId = `p_verify_${Date.now()}`;
    console.log(`2️⃣  Creating Project: ${projectId} linked to ${builderId}...`);

    const projectPayload = {
        id: projectId,
        title: 'Verification Heights',
        slug: `verify-heights-${Date.now()}`,
        builder_id: builderId, // The critical link
        location: 'Cyber City',
        price_range: '₹1Cr - ₹2Cr',
        status: 'New Launch',
        possession_date: 'Dec 2028',
        type: 'Residential',
        description: 'Auto-verified project',
        // Check new columns
        created_at: new Date(),
        seo_keywords: ['test', 'verify'],
        meta_description: 'SEO optimized description'
    };

    const { error: pError } = await supabase.from('projects').insert([projectPayload]);

    if (pError) {
        console.error('❌ Project Creation Failed:', pError);
        console.error('   Possible cause: builder_id column missing or FK mismatch.');
    } else {
        console.log('✅ Project Created!');

        // 3. Read it back (Verify JOIN)
        console.log('3️⃣  Reading back Project with Builder details...');
        const { data: readData, error: rError } = await supabase
            .from('projects')
            .select('*, builder:builders(*)')
            .eq('id', projectId)
            .single();

        if (rError) {
            console.error('❌ Read Failed:', rError);
        } else {
            console.log('🔍 Read Success:', {
                id: readData.id,
                title: readData.title,
                builderName: readData.builder?.name, // JOIN verification
                price_range: readData.price_range // snake_case verification
            });

            if (readData.builder?.name === 'Verification Builder') {
                console.log('\n🎉 SUCCESS: Full Stack Integrity Verified!');
                console.log('   - Schema is snake_case');
                console.log('   - IDs are TEXT');
                console.log('   - Foreign Keys are Working');
            } else {
                console.error('⚠️  Warning: Join returned unexpected data.');
            }
        }
    }

    // 4. Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await supabase.from('projects').delete().eq('id', projectId);
    await supabase.from('builders').delete().eq('id', builderId);
    console.log('✨ Done.');
}

verifyFix();
