
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

const BASE_URL = 'https://punepropertyvlog.in';

const checkSite = async () => {
    console.log(`🌍 Checking ${BASE_URL}...`);
    try {
        const res = await fetch(BASE_URL);
        if (!res.ok) throw new Error(`Site returned ${res.status}`);

        const html = await res.text();
        const dom = new JSDOM(html);
        const images = dom.window.document.querySelectorAll('img');

        console.log(`📸 Found ${images.length} images.`);
        let brokenCount = 0;
        let checkedCount = 0;

        for (const img of images) {
            const src = img.src;
            if (!src) continue;

            // Handle relative URLs
            const fullUrl = src.startsWith('http') ? src : `${BASE_URL}${src.startsWith('/') ? '' : '/'}${src}`;

            try {
                const imgRes = await fetch(fullUrl, { method: 'HEAD' });
                if (imgRes.status >= 400) {
                    console.error(`❌ BROKEN: ${fullUrl} [${imgRes.status}]`);
                    brokenCount++;
                } else {
                    // console.log(`✅ OK: ${fullUrl}`);
                }
            } catch (e) {
                console.error(`❌ ERROR: ${fullUrl} - ${e.message}`);
                brokenCount++;
            }
            checkedCount++;
        }

        console.log('---------------------------------------------------');
        if (brokenCount === 0) {
            console.log(`✅ All ${checkedCount} images are healthy!`);
        } else {
            console.log(`⚠️ Found ${brokenCount} broken images out of ${checkedCount}.`);
        }

    } catch (error) {
        console.error('❌ Site Check Failed:', error.message);
    }
};

checkSite();
