
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

async function main() {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (!fs.existsSync(envPath)) {
            console.error(".env.local not found at", envPath);
            return;
        }
        const envContent = fs.readFileSync(envPath, 'utf-8');

        const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
        const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

        const url = urlMatch ? urlMatch[1].trim() : null;
        const key = keyMatch ? keyMatch[1].trim() : null;

        if (!url || !key) {
            console.error("Missing URL or Key in .env.local");
            return;
        }

        console.log(`Connecting to Supabase URL: ${url}`);
        const supabase = createClient(url, key);

        console.log("Checking Storage Buckets...");
        const { data: buckets, error } = await supabase.storage.listBuckets();

        if (error) {
            console.error("Error listing buckets:", error);
            return;
        }

        const expectedBuckets = ['website-assets', 'project-images'];
        const foundBuckets = buckets.map(b => b.name);

        console.log("Found buckets:", foundBuckets);

        let allGood = true;
        for (const expected of expectedBuckets) {
            if (foundBuckets.includes(expected)) {
                console.log(`✅ Bucket '${expected}' exists.`);
            } else {
                console.error(`❌ Bucket '${expected}' MISSING!`);
                allGood = false;
            }
        }

        if (allGood) {
            console.log("\nStorage configuration looks correct!");
        } else {
            console.log("\nPlease run 'setup_storage.sql' in your Supabase SQL Editor to fix missing buckets.");
        }

    } catch (err) {
        console.error("Script Error:", err);
    }
}

main();
