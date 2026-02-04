
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

async function verifyBuilderFlow() {
    console.log('🚀 Starting Builder Image Verification...');

    // 1. Create a dummy image
    const testImageName = `verify_builder_logo_${Date.now()}.txt`;
    const fileBuffer = Buffer.from('Fake Image Content');

    // 2. Upload to Storage
    console.log(`📤 Uploading test logo: ${testImageName}...`);
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('website-assets')
        .upload(testImageName, fileBuffer);

    if (uploadError) {
        console.error('❌ Upload Failed:', uploadError);
        console.error('   Hint: Did you run fix_storage_security.sql?');
        process.exit(1);
    }
    console.log('✅ Upload Success!');

    const { data: { publicUrl } } = supabase.storage
        .from('website-assets')
        .getPublicUrl(testImageName);

    console.log(`🔗 Public URL: ${publicUrl}`);

    // 3. Insert Builder with this Logo
    const builderId = `b_test_${Date.now()}`;
    const builderData = {
        id: builderId,
        name: 'Test Builder Verifier',
        slug: `test-builder-${Date.now()}`,
        logo: publicUrl,
        hero_image: publicUrl, // Use same for hero
        description: 'Automated Test Builder',
        established_year: 2024,
        total_projects: 1,
        ongoing_projects: 0,
        trust_score: 9.9,
        is_verified: true,
        locations: ['Test City']
    };

    console.log(`💾 Saving Builder to Database...`);
    // Note: mapper.ts handles camel->snake, but here we insert manually so we use snake_case directly
    // to verify the DB schema accepts the columns.
    const { error: dbError } = await supabase
        .from('builders')
        .insert([builderData]);

    if (dbError) {
        console.error('❌ DB Save Failed:', dbError);
        console.error('   Hint: Did you run fix_builder_schema_conflict.sql?');
    } else {
        console.log('✅ Builder Saved Successfully!');

        // 4. Read it back
        const { data: readData, error: readError } = await supabase
            .from('builders')
            .select('*')
            .eq('id', builderId)
            .single();

        if (readError) {
            console.error('❌ Could not read back builder:', readError);
        } else {
            console.log('🔍 Verified Saved Data:', {
                logo: readData.logo,
                hero_image: readData.hero_image,
                trust_score: readData.trust_score
            });

            if (readData.logo === publicUrl) {
                console.log('🎉 SUCCESS: Logo URL persisted correctly!');
            } else {
                console.error('⚠️ MISMATCH: Saved URL does not match input URL.');
            }
        }
    }

    // 5. Cleanup
    console.log('🧹 Cleaning up...');
    await supabase.from('builders').delete().eq('id', builderId);
    await supabase.storage.from('website-assets').remove([testImageName]);
    console.log('✨ Cleanup Done.');
}

verifyBuilderFlow();
