import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import https from 'https';
import http from 'http';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const checkUrl = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
        if (!url || !url.startsWith('http')) {
            resolve(false);
            return;
        }

        const client = url.startsWith('https') ? https : http;
        const req = client.get(url, (res) => {
            // Consider 2xx and 3xx as valid
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 400) {
                resolve(true);
            } else {
                resolve(false);
            }
        });

        req.on('error', () => resolve(false));
        req.setTimeout(5000, () => {
            req.destroy();
            resolve(false);
        });
    });
};

const runHealthCheck = async () => {
    console.log('🔄 Starting Database Asset Health Check...');

    try {
        const { data: projects, error } = await supabase
            .from('projects')
            .select('id, title, image, hero_image, master_layout, logo, floor_plans');

        if (error) throw error;

        let brokenMains = 0;
        let brokenGallery = 0;

        for (const project of projects || []) {
            // Check Main Image
            if (project.image) {
                const isValid = await checkUrl(project.image);
                if (!isValid) {
                    console.warn(`⚠️ Broken Main Image on Project: "${project.title}" (${project.id})`);
                    brokenMains++;
                }
            } else {
                console.warn(`⚠️ Missing Main Image entirely on Project: "${project.title}"`);
                brokenMains++;
            }

            const checkAdditionalImg = async (url: string, fieldName: string) => {
                if (!url) return;
                const isValid = await checkUrl(url);
                if (!isValid) {
                    console.warn(`⚠️ Broken ${fieldName} on Project: "${project.title}"`);
                    brokenGallery++;
                }
            };

            await checkAdditionalImg(project.hero_image, 'Hero Image');
            await checkAdditionalImg(project.master_layout, 'Master Layout');
            await checkAdditionalImg(project.logo, 'Logo');

            // Check floor plans
            if (project.floor_plans && Array.isArray(project.floor_plans)) {
                for (let i = 0; i < project.floor_plans.length; i++) {
                    const imgUrl = project.floor_plans[i];
                    await checkAdditionalImg(imgUrl, `Floor Plan [${i}]`);
                }
            }
        }

        console.log('\n--- Health Check Summary ---');
        console.log(`Total Projects Scanned: ${projects?.length || 0}`);
        console.log(`Broken/Missing Main Images: ${brokenMains}`);
        console.log(`Broken/Missing Gallery Images: ${brokenGallery}`);

        if (brokenMains === 0 && brokenGallery === 0) {
            console.log('✅ All assets are healthy!');
        } else {
            console.log('❌ Issues found. Please review the warnings above.');
        }

    } catch (err) {
        console.error('Critical Health Check Error:', err);
    }
};

runHealthCheck();
