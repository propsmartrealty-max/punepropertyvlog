import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials in environment.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(request: any, response: any) {
    // Vercel Cron Security Check
    const authHeader = request.headers['authorization'];
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return response.status(401).json({ error: 'Unauthorized' });
    }

    try {
        console.log('🔄 Starting Dynamic Data Synchronization for Localities via Cron...');

        const { data: localities, error: locError } = await supabase.from('localities').select('*');
        if (locError) throw locError;

        const { data: projects, error: projError } = await supabase.from('projects').select('id, location, price_per_sqft');
        if (projError) throw projError;

        let updatedCount = 0;

        for (const loc of localities || []) {
            const matchingProjects = (projects || []).filter((p: any) =>
                p.location && p.location.toLowerCase().includes(loc.name.toLowerCase())
            );

            const projectCount = matchingProjects.length;
            let avgPriceSqft = 0;
            const projectsWithPrice = matchingProjects.filter((p: any) => p.price_per_sqft && p.price_per_sqft > 0);

            if (projectsWithPrice.length > 0) {
                const total = projectsWithPrice.reduce((sum: number, p: any) => sum + (p.price_per_sqft || 0), 0);
                avgPriceSqft = Math.round(total / projectsWithPrice.length);
            }

            if (loc.avgPriceSqft !== avgPriceSqft || loc.projectCount !== projectCount) {
                console.log(`[Diff] ${loc.name}: avgPriceSqft (${loc.avgPriceSqft || 0} -> ${avgPriceSqft}), projectCount (${loc.projectCount || 0} -> ${projectCount})`);

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
            }
        }

        console.log(`✅ Synchronization complete. Updated ${updatedCount} localities.`);
        return response.status(200).json({ success: true, updatedCount });

    } catch (err: any) {
        console.error('Critical Sync Error:', err);
        return response.status(500).json({ error: err.message || 'Server error' });
    }
}
