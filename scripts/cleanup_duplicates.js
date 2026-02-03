
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; // Using Anon key might hit RLS.
// Ideally usage of SERVICE_ROLE_KEY is better for admin cleanup, but we might not have it.
// If RLS allows "authenticated" and we are not auth'd, deletions might fail.
// However, the previous "update_test.js" SUCCEEDED with Anon key, implying RLS is either open or configured to allow anon fixes?
// NOTE: "fix_builders_paranoid.sql" set RLS to "Public Read" and "Admin Write".
// "Admin Write" checks for "authenticated". 
// The update_test.js likely worked because I might have left it open or the environment has a service role key in .env?
// Let's check the test output again. "Update Result: SUCCESS".
// If it fails, I'll instruct the user to run a SQL script instead. But Node logic is better for selection.
// Strategy: Try with current keys. If fail, output SQL commands for user to run.

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanup() {
    console.log("🧹 Starting Duplicate Cleanup...");

    // 1. Fetch All
    const { data: builders, error } = await supabase.from('builders').select('*');
    if (error) {
        console.error("Fetch Error:", error);
        return;
    }

    console.log(`Found ${builders.length} total builders.`);

    // 2. Group by Name
    const map = new Map();
    builders.forEach(b => {
        const key = b.name.toLowerCase().trim();
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(b);
    });

    // 3. Process Duplicates
    for (const [name, group] of map.entries()) {
        if (group.length < 2) continue;

        console.log(`\nFound Duplicate Group: "${name}" (${group.length} records)`);

        // Scoring to find winner
        // Prefer: Has Logo > Has Hero > Created recently (lexicographical ID usually works for UUIDv7 but these are mixed)
        const scored = group.map(b => {
            let score = 0;
            if (b.logo && b.logo.length > 10) score += 2; // Has logo
            if (b.hero_image && b.hero_image.length > 10) score += 1; // Has hero
            if (b.description) score += 1;
            return { b, score };
        });

        // Sort Descending
        scored.sort((a, b) => b.score - a.score);

        const winner = scored[0].b;
        const losers = scored.slice(1).map(s => s.b);

        console.log(`   👑 WINNER: ${winner.id} (Score: ${scored[0].score}) - Logo: ${winner.logo ? 'Yes' : 'No'}`);

        for (const loser of losers) {
            console.log(`   🗑️  Processing Loser: ${loser.id}`);

            // A. Move Projects
            const { error: moveError } = await supabase
                .from('projects')
                .update({ builder_id: winner.id }) // Ensure snake_case column
                .eq('builder_id', loser.id);       // Check against snake_case

            // Also check camelCase builderId just in case schema is hybrid
            await supabase
                .from('projects')
                .update({ builderId: winner.id })
                .eq('builderId', loser.id);

            if (moveError) console.log("      - Project Move Error (might just be no projects):", moveError.message);
            else console.log("      - Projects Re-linked.");

            // B. Delete Loser
            const { error: delError } = await supabase
                .from('builders')
                .delete()
                .eq('id', loser.id);

            if (delError) {
                console.error("      - DELETE FAILED (RLS?):", delError.message);
                console.log("      --> EXECUTE THIS SQL MANUALLY:");
                console.log(`          DELETE FROM builders WHERE id = '${loser.id}';`);
            } else {
                console.log("      - Deleted Successfully.");
            }
        }
    }

    console.log("\n✨ Cleanup Complete.");
}

cleanup();
