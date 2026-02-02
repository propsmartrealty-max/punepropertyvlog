
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyPhase3() {
    console.log("🔍 Checking Phase 3 Schema...");

    // 1. Check projects table for pricePerSqft
    console.log("Checking 'projects' table for pricePerSqft...");
    const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, pricePerSqft')
        .limit(1);

    if (projectsError) {
        console.error("❌ Projects table check failed:", projectsError.message);
    } else {
        console.log("✅ 'projects' table has pricePerSqft.");
    }

    // 2. Check localities table
    console.log("Checking 'localities' table structure...");
    const { data: localitiesData, error: localitiesError } = await supabase
        .from('localities')
        .select('id, name, avgPriceSqft, appreciation_rate, last_updated')
        .limit(1);

    if (localitiesError) {
        if (localitiesError.message.includes("does not exist") || localitiesError.code === '42P01') {
            console.error("❌ 'localities' table missing.");
        } else if (localitiesError.message.includes("column") || localitiesError.code === 'PGRST301') {
            console.error("❌ 'localities' table exists but columns (avgPriceSqft, appreciation_rate) missing.");
        } else {
            console.error("❌ 'localities' error:", localitiesError.message);
        }
    } else {
        console.log("✅ 'localities' table exists with correctly named columns.");
    }

    if (!projectsError && !localitiesError) {
        console.log("🎉 Phase 3 Schema appears to be fully applied!");
    } else {
        console.log("⚠️ Schema incomplete. Please run 'phase3_schema.sql' and 'market_intelligence_schema.sql'.");
    }
}

verifyPhase3();
