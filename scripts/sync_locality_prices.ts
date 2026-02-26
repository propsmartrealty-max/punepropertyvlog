import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
// To save to the database, we might need a service role key if RLS is enabled for mutations on 'localities'
// But if ANON_KEY is allowed via RLS to update localities for the admin (if using auth), it works.
// Given this is a script, using ANON_KEY is fine if RLS policies allow it, otherwise warn.
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const runSync = async () => {
    console.log('🔄 Starting Dynamic Data Synchronization for Localities...');

    // Check if dry run
    const isDryRun = process.argv.includes('--dry-run');
    if (isDryRun) {
        console.log('⚠️ Running in DRY-RUN mode. No changes will be saved to the database.');
    }

    try {
        // Fetch all localities
        const { data: localities, error: locError } = await supabase
            .from('localities')
            .select('*');

        if (locError) {
            console.error('Failed to fetch localities:', locError);
            return;
        }

        // Fetch all projects with pricePerSqft
        const { data: projects, error: projError } = await supabase
            .from('projects')
            .select('id, location, price_per_sqft');

        if (projError) {
            console.error('Failed to fetch projects:', projError);
            return;
        }

        console.log(`Found ${localities?.length || 0} localities and ${projects?.length || 0} projects. Processing...`);

        let updatedCount = 0;

        for (const loc of localities || []) {
            // Find projects for this locality
            // A simple match: check if the project's location string includes the locality name
            const matchingProjects = (projects || []).filter(p =>
                p.location && p.location.toLowerCase().includes(loc.name.toLowerCase())
            );

            const projectCount = matchingProjects.length;

            let avgPriceSqft = 0;
            const projectsWithPrice = matchingProjects.filter(p => p.price_per_sqft && p.price_per_sqft > 0);

            if (projectsWithPrice.length > 0) {
                const total = projectsWithPrice.reduce((sum, p) => sum + (p.price_per_sqft || 0), 0);
                avgPriceSqft = Math.round(total / projectsWithPrice.length);
            }

            // Update locality if there's a difference to avoid unnecessary writes
            if (loc.avgPriceSqft !== avgPriceSqft || loc.projectCount !== projectCount) {
                console.log(`[Diff] ${loc.name}: avgPriceSqft (${loc.avgPriceSqft || 0} -> ${avgPriceSqft}), projectCount (${loc.projectCount || 0} -> ${projectCount})`);

                if (!isDryRun) {
                    const { error: updateError } = await supabase
                        .from('localities')
                        .update({
                            avgPriceSqft: avgPriceSqft > 0 ? avgPriceSqft : null,
                            projectCount,
                            last_updated: new Date().toISOString()
                        })
                        .eq('id', loc.id);

                    if (updateError) {
                        console.error(`Error updating locality ${loc.name}:`, updateError);
                    } else {
                        updatedCount++;
                    }
                } else {
                    updatedCount++; // Count as "would have updated"
                }
            }
        }

        if (isDryRun) {
            console.log(`✅ [Dry-Run] Synchronization complete. Would have updated ${updatedCount} localities.`);
        } else {
            console.log(`✅ Synchronization complete. Updated ${updatedCount} localities.`);
        }

    } catch (err) {
        console.error('Critical Sync Error:', err);
    }
};

runSync();
