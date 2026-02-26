import { createClient } from '@supabase/supabase-js';
import https from 'https';
import http from 'http';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials in environment.');
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

export default async function handler(request: any, response: any) {
    // Vercel Cron Security Check
    const authHeader = request.headers['authorization'];
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return response.status(401).json({ error: 'Unauthorized' });
    }

    try {
        console.log('🔄 Starting Database Asset Health Check via Cron...');

        const { data: projects, error } = await supabase.from('projects').select('id, title, image, hero_image, master_layout, floor_plans');
        if (error) throw error;

        let brokenMains = 0;
        let brokenGallery = 0;
        const brokenDetails = [];

        for (const project of projects || []) {
            // Check Main Image
            if (project.image) {
                const isValid = await checkUrl(project.image);
                if (!isValid) {
                    brokenMains++;
                    brokenDetails.push(`Broken Main Image on Project: "${project.title}" (${project.id})`);
                }
            } else {
                brokenMains++;
                brokenDetails.push(`Missing Main Image entirely on Project: "${project.title}"`);
            }

            // Helper to check other image fields
            const checkAdditionalImg = async (url: string, fieldName: string) => {
                if (!url) return;
                const isValid = await checkUrl(url);
                if (!isValid) {
                    brokenGallery++;
                    brokenDetails.push(`Broken ${fieldName} on Project: "${project.title}"`);
                }
            };

            await checkAdditionalImg(project.hero_image, 'Hero Image');
            await checkAdditionalImg(project.master_layout, 'Master Layout');

            // Check floor plans
            if (project.floor_plans && Array.isArray(project.floor_plans)) {
                for (let i = 0; i < project.floor_plans.length; i++) {
                    const imgUrl = project.floor_plans[i];
                    await checkAdditionalImg(imgUrl, `Floor Plan [${i}]`);
                }
            }
        }

        const summary = {
            totalProjects: projects?.length || 0,
            brokenMains,
            brokenGallery,
            issues: brokenDetails
        };

        if (brokenMains > 0 || brokenGallery > 0) {
            console.log('❌ Issues found.', summary);
        } else {
            console.log('✅ All assets are healthy!');
        }

        return response.status(200).json({ success: true, summary });

    } catch (err: any) {
        console.error('Critical Health Check Error:', err);
        return response.status(500).json({ error: err.message || 'Server error' });
    }
}
