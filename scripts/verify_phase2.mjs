
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

async function verifyPhase2() {
    console.log("🔍 Checking Phase 2 Schema...");

    // 1. Check projects table for reraId and verificationStatus
    console.log("Checking 'projects' table columns...");
    const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, reraId, verificationStatus, verificationSource')
        .limit(1);

    if (projectsError) {
        if (projectsError.message.includes("does not exist") || projectsError.code === 'PGRST301') { // Generic error often implies column missing
            console.error("❌ Projects table columns missing:", projectsError.message);
        } else {
            console.error("❌ Error checking projects:", projectsError.message);
        }
    } else {
        console.log("✅ 'projects' table has RERA columns.");
    }

    // 2. Check project_configurations table
    console.log("Checking 'project_configurations' table...");
    const { data: configData, error: configError } = await supabase
        .from('project_configurations')
        .select('*')
        .limit(1);

    if (configError) {
        console.error("❌ 'project_configurations' verification failed:", configError.message);
    } else {
        console.log("✅ 'project_configurations' table exists.");
    }

    if (!projectsError && !configError) {
        console.log("🎉 Phase 2 Schema appears to be fully applied!");
    } else {
        console.log("⚠️ Schema incomplete. Please run 'phase2_schema.sql'.");
    }
}

verifyPhase2();
