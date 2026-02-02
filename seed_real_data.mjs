
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
});

console.log('🌱 Seeding Real Pune Data (SEO Slugs)...');

// Hybrid Schema: keys matching actual DB columns as found by inspection
const BUILDERS = [
    {
        name: 'VTP Realty',
        slug: 'vtp-realty',
        description: 'VTP Realty is Pune\'s #1 Real Estate Brand, delivering high-quality residential and commercial projects.',
        establishedYear: 1985,
        totalProjects: 35,
        ongoingProjects: 12,
        locations: ['Kharadi', 'Baner', 'Hinjewadi'],
        trust_score: 9.3,
        logo: 'https://bit.ly/3uE2QnZ',
        heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000'
    },
    {
        name: 'Godrej Properties',
        slug: 'godrej-properties',
        description: 'Godrej Properties brings the Godrej Group philosophy of innovation, sustainability, and excellence to the real estate industry.',
        establishedYear: 1990,
        totalProjects: 80,
        ongoingProjects: 15,
        locations: ['Mahalunge', 'Mamurdi', 'Manjari'],
        trust_score: 9.8,
        logo: 'https://bit.ly/42vO0lS',
        heroImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=2000'
    },
    {
        name: 'Lodha Group',
        slug: 'lodha-group',
        description: 'India\'s No.1 real estate developer, building world\'s finest developments.',
        establishedYear: 1980,
        totalProjects: 100,
        ongoingProjects: 20,
        locations: ['NIBM', 'Kharadi'],
        trust_score: 9.5,
        logo: 'https://bit.ly/3SEr1Jm',
        heroImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=2000'
    },
    {
        name: 'Kolte Patil',
        slug: 'kolte-patil',
        description: 'Creation, not construction. Kolte Patil is a dominant player in the Pune real estate market.',
        establishedYear: 1991,
        totalProjects: 50,
        ongoingProjects: 10,
        locations: ['Life Republic', 'Kharadi'],
        trust_score: 8.8,
        logo: 'https://ui-avatars.com/api/?name=Kolte+Patil&background=random',
        heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000'
    }
];

const PROJECTS = [
    // VTP
    {
        title: 'VTP Blue Waters',
        slug: 'vtp-blue-waters-mahalunge-pune',
        location: 'Mahalunge',
        priceRange: '₹45L - ₹1.2Cr',
        base_price: 4500000,
        pricePerSqft: 6800,
        configurations: ['1 BHK', '2 BHK', '3 BHK'],
        status: 'Under Construction',
        possessionDate: 'Dec 2026',
        amenities: ['River View', 'Tennis Court', 'Clubhouse'],
        type: 'Residential',
        builder_slug: 'vtp-realty',
        description: 'A 100+ acre township nestled in nature with easy connectivity to Hinjewadi.',
        heroImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200',
        lat: 18.5684,
        lng: 73.7601
    },
    {
        title: 'VTP Pegasus',
        slug: 'vtp-pegasus-kharadi-pune',
        location: 'Kharadi',
        priceRange: '₹60L - ₹1.5Cr',
        base_price: 6000000,
        pricePerSqft: 7500,
        configurations: ['2 BHK', '3 BHK'],
        status: 'New Launch',
        possessionDate: 'Jun 2027',
        amenities: ['Sky Lounge', 'Gym', 'Pool'],
        type: 'Residential',
        builder_slug: 'vtp-realty',
        description: 'New launch in New Kharadi, offering premium lifestyle apartments.',
        heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
        lat: 18.5630,
        lng: 73.9500
    },
    // Godrej
    {
        title: 'Godrej Hill Retreat',
        slug: 'godrej-hill-retreat-mahalunge-pune',
        location: 'Mahalunge',
        priceRange: '₹55L - ₹1.1Cr',
        base_price: 5500000,
        pricePerSqft: 7200,
        configurations: ['2 BHK', '3 BHK'],
        status: 'Under Construction',
        possessionDate: 'Mar 2026',
        amenities: ['Resort Theme', 'Spa', 'Nature Walk'],
        type: 'Residential',
        builder_slug: 'godrej-properties',
        description: 'Experience resort-style living every day at Godrej Hill Retreat.',
        heroImage: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=1200',
        lat: 18.5700,
        lng: 73.7650
    },
    {
        title: 'Godrej Parkridge',
        slug: 'godrej-parkridge-manjari-pune',
        location: 'Manjari',
        priceRange: '₹48L - ₹90L',
        base_price: 4800000,
        pricePerSqft: 6500,
        configurations: ['1 BHK', '2 BHK', '3 BHK'],
        status: 'Ready to Move',
        possessionDate: 'Ready',
        amenities: ['Green Park', 'Jogging Track', 'Medi-Centre'],
        type: 'Residential',
        builder_slug: 'godrej-properties',
        description: '80% Open spaces with 1000+ trees. Breathe fresh at Parkridge.',
        heroImage: 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&q=80&w=1200',
        lat: 18.5280,
        lng: 74.0040
    },
    // Lodha
    {
        title: 'Lodha Giardino',
        slug: 'lodha-giardino-kharadi-pune',
        location: 'Kharadi',
        priceRange: '₹1.8Cr - ₹4Cr',
        base_price: 18000000,
        pricePerSqft: 11000,
        configurations: ['3 BHK', '4 BHK'],
        status: 'Under Construction',
        possessionDate: 'Dec 2026',
        amenities: ['Concierge', 'Italian Marble', 'Private Elevator'],
        type: 'Residential',
        builder_slug: 'lodha-group',
        description: 'Ultra-luxury residences for the elite. The finest address in East Pune.',
        heroImage: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1200',
        lat: 18.5520,
        lng: 73.9480
    },
    // Kolte Patil
    {
        title: 'Life Republic',
        slug: 'life-republic-hinjewadi-pune',
        location: 'Hinjewadi',
        priceRange: '₹40L - ₹1.2Cr',
        base_price: 4000000,
        pricePerSqft: 6200,
        configurations: ['1 BHK', '2 BHK', '3 BHK'],
        status: 'Under Construction',
        possessionDate: '2025 onwards',
        amenities: ['School', 'Fire Station', 'Sports City'],
        type: 'Residential',
        builder_slug: 'kolte-patil',
        description: 'A 400-acre integrated township. A city within a city.',
        heroImage: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=1200',
        lat: 18.6010,
        lng: 73.7200
    },
    {
        title: '24K Altura',
        slug: '24k-altura-baner-pune',
        location: 'Baner',
        priceRange: '₹1.5Cr - ₹2.5Cr',
        base_price: 15000000,
        pricePerSqft: 9500,
        configurations: ['3 BHK', '4 BHK'],
        status: 'Under Construction',
        possessionDate: '2027',
        amenities: ['Infinity Pool', 'Smart Home', 'Valet'],
        type: 'Residential',
        builder_slug: 'kolte-patil',
        description: 'Premium living at Baner Hills. 24K Standard of Luxury.',
        heroImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200',
        lat: 18.5590,
        lng: 73.7860
    }
];

async function seedType(table, data) {
    for (const item of data) {
        const { error } = await supabase.from(table).upsert(item, { onConflict: 'slug' });
        if (error) console.error(`Error Upserting ${table}:`, error.message);
        else console.log(`Processed ${item.title || item.name}`);
    }
}

async function main() {
    await seedType('builders', BUILDERS);

    // builderId check: Inspection showed 'builderId' (camelCase) column exists in projects
    const { data: buildersDB } = await supabase.from('builders').select('id, slug, name');

    const finalProjects = PROJECTS.map(p => {
        const builder = buildersDB.find(b => b.slug === p.builder_slug);
        const { builder_slug, ...projectArgs } = p;
        return {
            ...projectArgs,
            builderId: builder ? builder.id : null,
        };
    });

    await seedType('projects', finalProjects);

    console.log('✅ Real Data Seeding Complete (SEO Updated)!');
    process.exit(0);
}

main();
