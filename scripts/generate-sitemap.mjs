
import { createClient } from '@supabase/supabase-js';
import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { resolve } from 'path';
import 'dotenv/config';

// Try loading .env.local if vars are missing (common in Vite/Next.js local dev)
import { config } from 'dotenv';
if (!process.env.VITE_SUPABASE_URL) {
    config({ path: '.env.local' });
}

// Load env vars
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn("⚠️  Supabase keys missing. Sitemap generation skipped.");
    // Exit successfully so build continues
    process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const BASE_URL = 'https://punepropertyvlog.in';

async function generateSitemap() {
    console.log("🗺️  Generating Sitemap...");

    const smStream = new SitemapStream({ hostname: BASE_URL });
    const writeStream = createWriteStream(resolve('./public/sitemap.xml'));

    smStream.pipe(writeStream);

    // 1. Static Routes
    smStream.write({ url: '/', changefreq: 'daily', priority: 1.0 });
    smStream.write({ url: '/search', changefreq: 'daily', priority: 0.8 });
    smStream.write({ url: '/directory', changefreq: 'weekly', priority: 0.7 });
    smStream.write({ url: '/post-property', changefreq: 'monthly', priority: 0.6 });

    try {
        // 2. Projects
        const { data: projects, error: pError } = await supabase
            .from('projects')
            .select('slug, updatedAt');

        if (pError) throw pError;

        projects?.forEach(project => {
            smStream.write({
                url: `/project/${project.slug}`,
                changefreq: 'weekly',
                priority: 0.9,
                lastmod: project.updatedAt
            });
        });

        // 3. Builders
        const { data: builders, error: bError } = await supabase
            .from('builders')
            .select('slug');

        if (bError) throw bError;

        builders?.forEach(builder => {
            smStream.write({
                url: `/builder/${builder.slug}`,
                changefreq: 'monthly',
                priority: 0.6
            });
        });

    } catch (err) {
        console.error("❌ Error fetching data for sitemap:", err);
    }

    smStream.end();
    await streamToPromise(smStream);
    console.log("✅ Sitemap generated at public/sitemap.xml");
}

// Execute only if run directly
if (process.argv[1] === import.meta.filename || process.argv[1].endsWith('generate-sitemap.mjs')) {
    generateSitemap();
} else {
    // Just call it anyway since it is a script
    generateSitemap();
}
