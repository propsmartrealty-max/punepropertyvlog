import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || ''; // Use service role key in actual production for bypass RLS

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// We use dynamic import for the AI service since it depends on the environment
const runEnrichment = async () => {
    try {
        // Find projects missing critical SEO data
        const { data: projects, error } = await supabase
            .from('projects')
            .select('id, title, location')
            .or('meta_description.is.null,seo_keywords.is.null,description.is.null')
            .limit(10); // Batch limit

        if (error) throw error;
        if (!projects || projects.length === 0) {
            console.log('✅ All projects are fully enriched!');
            return;
        }

        console.log(`🔍 Found ${projects.length} projects needing enrichment. Processing...`);

        // Dynamically import aiService to avoid running browser-specific code if any
        // Assuming AI service uses global fetch
        const { fetchProjectDetailsFromAI } = await import('../src/services/aiService.js');

        for (const project of projects) {
            console.log(`\n⏳ Enriching: ${project.title} (${project.location})`);
            try {
                const aiData = await fetchProjectDetailsFromAI(`${project.title} in ${project.location}`);

                // We only want to update the missing fields
                const updatePayload: any = {};
                if (aiData.metaDescription) updatePayload.meta_description = aiData.metaDescription;
                if (aiData.seoKeywords) updatePayload.seo_keywords = aiData.seoKeywords;
                if (aiData.description) updatePayload.description = aiData.description;

                if (Object.keys(updatePayload).length > 0) {
                    const { error: updateError } = await supabase
                        .from('projects')
                        .update(updatePayload)
                        .eq('id', project.id);

                    if (updateError) throw updateError;
                    console.log(`✅ Successfully enriched ${project.title}`);
                } else {
                    console.log(`⚠️ AI returned no new data for ${project.title}`);
                }

                // Rate limit wait
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (err: any) {
                console.error(`❌ Failed to enrich ${project.title}:`, err.message);
            }
        }
    } catch (err) {
        console.error('Critical Script Error:', err);
    }
};

runEnrichment();
