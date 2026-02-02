
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const SEED_DATA = [
    {
        name: "Godrej Properties",
        projects: [
            { name: "Godrej Rivergreens (Township)", type: "Residential", location: "Manjari" },
            { name: "Godrej Horizon", type: "Residential", location: "Undri" },
            { name: "Godrej Woodsville", type: "Residential", location: "Hinjewadi" },
            { name: "Godrej Park World (Township)", type: "Residential", location: "Hinjewadi" },
            { name: "Godrej The Greenfront", type: "Residential", location: "Hinjewadi" },
            { name: "Godrej The Gale", type: "Residential", location: "Hinjewadi" },
            { name: "Godrej Aqua Retreat", type: "Residential", location: "Mahalunge" },
            { name: "Godrej Green Vistas", type: "Residential", location: "Mahalunge" },
            { name: "Godrej Green Cove", type: "Residential", location: "Mahalunge" },
            { name: "Godrej Carnival", type: "Commercial", location: "Mamurdi" },
            { name: "Godrej Greens", type: "Residential", location: "Undri" },
            { name: "Godrej Park Springs", type: "Residential", location: "Manjari" },
            { name: "Godrej Evergreen Square", type: "Residential", location: "Hinjewadi" },
            { name: "Godrej Megapolis", type: "Residential", location: "Hinjewadi" },
            { name: "Godrej Skyline", type: "Residential", location: "Koregaon Park" },
            { name: "Godrej River Crest", type: "Residential", location: "Manjari" },
            { name: "Godrej River Royale", type: "Residential", location: "Mahalunge" },
            { name: "Godrej Eden Estate (Plots)", type: "Plot", location: "Hinjewadi" },
            { name: "Godrej Emerald Waters", type: "Residential", location: "Pimpri" },
            { name: "Godrej Forest Grove", type: "Residential", location: "Mamurdi" },
            { name: "Godrej Hillside", type: "Residential", location: "Mahalunge" },
            { name: "Godrej Infinity", type: "Residential", location: "Keshavnagar" },
            { name: "Godrej Meadows", type: "Residential", location: "Mahalunge" },
            { name: "Godrej Park Greens", type: "Residential", location: "Mamurdi" },
            { name: "Godrej Serene", type: "Residential", location: "Mamurdi" },
            { name: "Godrej Sky Avenue", type: "Residential", location: "Mahalunge" },
            { name: "Godrej Urban Retreat", type: "Residential", location: "Kharadi" },
            { name: "Godrej Aqua Vista", type: "Residential", location: "Keshavnagar" },
            { name: "Godrej Elaris", type: "Residential", location: "Mundhwa" },
            { name: "Godrej Sky Greens", type: "Residential", location: "Kharadi" },
            { name: "Godrej Genesis Pune", type: "Commercial", location: "Hinjewadi" },
            { name: "Godrej Yerwada Commercial", type: "Commercial", location: "Yerwada" }
        ]
    },
    {
        name: "VTP Realty",
        projects: [
            { name: "VTP Bellissimo", type: "Residential", location: "Hinjewadi" },
            { name: "VTP Blue Waters (Township)", type: "Residential", location: "Mahalunge" },
            { name: "VTP Altair", type: "Residential", location: "Kharadi" },
            { name: "VTP Pegasus (Township)", type: "Residential", location: "Kharadi" },
            { name: "VTP Leonara", type: "Residential", location: "Mahalunge" },
            { name: "VTP Bel Air", type: "Residential", location: "Mahalunge" },
            { name: "VTP Alpine", type: "Residential", location: "Kharadi" },
            { name: "VTP Aethereus", type: "Residential", location: "Mahalunge" },
            { name: "VTP Sierra", type: "Residential", location: "Baner" },
            { name: "VTP Verve", type: "Residential", location: "Sus" },
            { name: "VTP Flamante", type: "Residential", location: "Kharadi" },
            { name: "VTP Velvet Villas", type: "Residential", location: "Kharadi" },
            { name: "VTP Cynara", type: "Residential", location: "Wagholi" },
            { name: "VTP Hilife", type: "Residential", location: "Wakad" },
            { name: "VTP Solitaire", type: "Residential", location: "Baner" },
            { name: "VTP Celesta", type: "Residential", location: "NIBM" },
            { name: "VTP Urban Nest", type: "Residential", location: "Undri" },
            { name: "VTP Dolce Vita", type: "Residential", location: "Kharadi" },
            { name: "VTP Luxe", type: "Residential", location: "Mahalunge" },
            { name: "Codename Never Before", type: "Residential", location: "Kharadi" },
            { name: "VTP Trade Park", type: "Commercial", location: "Undri" },
            { name: "VTP Altitude", type: "Commercial", location: "Wakad" },
            { name: "VTP Marketplace", type: "Commercial", location: "Hinjewadi" }
        ]
    },
    {
        name: "Kolte Patil Developers",
        projects: [
            { name: "Life Republic (Township)", type: "Residential", location: "Hinjewadi" },
            { name: "Life Republic Arezo", type: "Residential", location: "Hinjewadi" },
            { name: "Life Republic Atmos", type: "Residential", location: "Hinjewadi" },
            { name: "Life Republic Chil (24K)", type: "Residential", location: "Hinjewadi" },
            { name: "Life Republic 24K Espada", type: "Residential", location: "Hinjewadi" },
            { name: "Kolte Patil 24K Altura", type: "Residential", location: "Baner" },
            { name: "Kolte Patil 24K Sereno", type: "Residential", location: "Baner" },
            { name: "Kolte Patil 24K Opula", type: "Residential", location: "Pimple Nilakh" },
            { name: "Kolte Patil 24K Stargaze", type: "Residential", location: "Bavdhan" },
            { name: "Kolte Patil Stargaze", type: "Residential", location: "Bavdhan" },
            { name: "Kolte Patil Ivy Nia", type: "Residential", location: "Wagholi" },
            { name: "Kolte Patil Equa", type: "Residential", location: "Wagholi" },
            { name: "Kolte Patil Little Earth", type: "Residential", location: "Mamurdi" },
            { name: "Kolte Patil Green Olive", type: "Residential", location: "Hinjewadi" },
            { name: "Kolte Patil Western Avenue", type: "Residential", location: "Wakad" },
            { name: "Kolte Patil Three Jewels", type: "Residential", location: "Katraj" },
            { name: "Kolte Patil Mount Castle", type: "Residential", location: "Wagholi" },
            { name: "Life Republic Sound Square", type: "Commercial", location: "Hinjewadi" },
            { name: "Kolte Patil 45 West", type: "Commercial", location: "Baner" },
            { name: "Kolte Patil Giga Space", type: "Commercial", location: "Viman Nagar" },
            { name: "Kolte Patil City Centre", type: "Commercial", location: "Hinjewadi" }
        ]
    },
    {
        name: "Sobha Limited",
        projects: [
            { name: "Sobha Nesara", type: "Residential", location: "Chandani Chowk" },
            { name: "Sobha Garnet", type: "Residential", location: "Kondhwa" },
            { name: "Sobha Orion", type: "Residential", location: "Kondhwa" }
        ]
    },
    {
        name: "Panchshil Realty",
        projects: [
            { name: "Panchshil Towers", type: "Residential", location: "Kharadi" },
            { name: "Eon Free Zone", type: "Commercial", location: "Kharadi" },
            { name: "Yoo Pune", type: "Residential", location: "Hadapsar" },
            { name: "Trump Towers Pune", type: "Residential", location: "Kalyani Nagar" },
            { name: "Panchshil Business Park", type: "Commercial", location: "Viman Nagar" }
        ]
    },
    {
        name: "Nyati Group",
        projects: [
            { name: "Nyati Unitree", type: "Commercial", location: "Yerwada" },
            { name: "Nyati Elysia", type: "Residential", location: "Kharadi" },
            { name: "Nyati Equinox", type: "Residential", location: "Bavdhan" },
            { name: "Nyati Exuberance", type: "Residential", location: "Undri" }
        ]
    },
    {
        name: "Lodha Developers",
        projects: [
            { name: "Lodha Belmondo", type: "Residential", location: "Mumbai-Pune Expressway" },
            { name: "Lodha Giardino", type: "Residential", location: "Kharadi" },
            { name: "Lodha Panache", type: "Residential", location: "Hinjewadi" }
        ]
    },
    {
        name: "Rohan Builders",
        projects: [
            { name: "Rohan Abhilasha", type: "Residential", location: "Wagholi" },
            { name: "Rohan Ananta", type: "Residential", location: "Tathawade" },
            { name: "Rohan Madhuban", type: "Residential", location: "Bavdhan" },
            { name: "Rohan Viti", type: "Residential", location: "Wakad" }
        ]
    },
    {
        name: "Mittal Brothers",
        projects: [
            { name: "Mittal Brothers High Mont", type: "Residential", location: "Hinjewadi" },
            { name: "Mittal Brothers Petals", type: "Residential", location: "Wakad" }
        ]
    },
    {
        name: "Naiknavare Developers",
        projects: [
            { name: "Naiknavare Dwarka Township", type: "Residential", location: "Chakan" },
            { name: "Naiknavare Avon Vista", type: "Residential", location: "Balewadi" },
            { name: "Naiknavare 7 Plumeria Drive", type: "Residential", location: "Tathawade" }
        ]
    },
    {
        name: "BramhaCorp",
        projects: [
            { name: "BramhaCorp The Collection", type: "Residential", location: "Kalyani Nagar" },
            { name: "BramhaCorp Business Park", type: "Commercial", location: "Kalyani Nagar" },
            { name: "BramhaCorp F-Residences", type: "Residential", location: "Kalyani Nagar" },
            { name: "BramhaCorp August Towers", type: "Residential", location: "Wadgaon Sheri" }
        ]
    },
    {
        name: "Pharande Spaces",
        projects: [
            { name: "Puneville", type: "Residential", location: "Punawale" },
            { name: "Woodsville", type: "Residential", location: "Moshi" },
            { name: "Pharande L-Axis", type: "Residential", location: "Pimpri" }
        ]
    },
    {
        name: "Kasturi Housing",
        projects: [
            { name: "The Balmoral Hillside", type: "Residential", location: "Baner" },
            { name: "The Balmoral Riverside", type: "Residential", location: "Balewadi" },
            { name: "The Balmoral Towers", type: "Residential", location: "Balewadi" },
            { name: "Kasturi Eon Homes", type: "Residential", location: "Hinjewadi" },
            { name: "Kasturi Apostrophe", type: "Residential", location: "Hinjewadi" },
            { name: "Kasturi Epitome", type: "Residential", location: "Wakad" },
            { name: "Kasturi The Legacy", type: "Commercial", location: "Shivajinagar" }
        ]
    },
    {
        name: "Kalpataru Builders",
        projects: [
            { name: "Kalpataru Jade Residences", type: "Residential", location: "Baner" },
            { name: "Kalpataru Vishrambag", type: "Residential", location: "Vishrambag" },
            { name: "Kalpataru Serenity", type: "Residential", location: "Manjri" }
        ]
    },
    {
        name: "Saheel Developers",
        projects: [
            { name: "Saheel ITrend Life", type: "Residential", location: "Wakad" },
            { name: "Saheel ITrend City", type: "Residential", location: "Wakad" },
            { name: "Saheel ITrend Futura", type: "Residential", location: "Baner" }
        ]
    },
    {
        name: "K Raheja Corp",
        projects: [
            { name: "K Raheja Viva", type: "Residential", location: "Pirangut" },
            { name: "Raheja Vistas Premiere", type: "Residential", location: "NIBM" },
            { name: "Raheja Reserve", type: "Residential", location: "NIBM" }
        ]
    },
    {
        name: "Paranjape Schemes",
        projects: [
            { name: "Blue Ridge", type: "Residential", location: "Hinjewadi" },
            { name: "Forest Trails", type: "Residential", location: "Bhugaon" },
            { name: "Paranjape Broadway", type: "Residential", location: "Wakad" }
        ]
    },
    {
        name: "Shapoorji Pallonji",
        projects: [
            { name: "Shapoorji Joyville", type: "Residential", location: "Hinjewadi" },
            { name: "Shapoorji Vanaha", type: "Residential", location: "Bavdhan" },
            { name: "Shapoorji Sensorium", type: "Residential", location: "Hinjewadi" }
        ]
    },
    {
        name: "Goel Ganga Developments",
        projects: [
            { name: "Ganga Legend", type: "Residential", location: "Bavdhan" },
            { name: "Ganga Fernhill", type: "Residential", location: "Undri" },
            { name: "Ganga Asmi", type: "Residential", location: "Wakad" }
        ]
    },
    {
        name: "Mahindra Lifespaces",
        projects: [
            { name: "Mahindra Happinest", type: "Residential", location: "Tathawade" },
            { name: "Mahindra Antheia", type: "Residential", location: "Pimpri" },
            { name: "Mahindra Citadel", type: "Residential", location: "Pimpri" }
        ]
    },
    {
        name: "Kumar Properties",
        projects: [
            { name: "Kumar 47 East", type: "Residential", location: "Mundhwa" },
            { name: "Kumar Bradbury", type: "Residential", location: "Hadapsar" },
            { name: "Kumar Princeville", type: "Residential", location: "Moshi" }
        ]
    },
    {
        name: "Vilas Javdekar Developers",
        projects: [
            { name: "Yashwin Orizzonte", type: "Residential", location: "Kharadi" },
            { name: "Yashwin Encore", type: "Residential", location: "Wakad" },
            { name: "Yashwin Supernova", type: "Residential", location: "Wakad" }
        ]
    },
    {
        name: "Gera Developments",
        projects: [
            { name: "Gera World of Joy", type: "Residential", location: "Kharadi" },
            { name: "Gera Planet of Joy", type: "Residential", location: "Kharadi" },
            { name: "Gera Island of Joy", type: "Residential", location: "Kharadi" }
        ]
    }
];

const MOCK_FALLBACK: any = {
    "Godrej Properties": {
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aec/Godrej_Logo.svg/2560px-Godrej_Logo.svg.png",
        description: "Godrej Properties brings the Godrej Group philosophy of innovation, sustainability, and excellence to the real estate industry.",
        establishedYear: 1990
    },
    "VTP Realty": {
        logo: "https://www.vtprealty.in/wp-content/uploads/2020/08/VTP-Realty-Logo.png",
        description: "VTP Realty is Pune's #1 Real Estate Brand, known for its MLA (Maximum Livable Area) philosophy.",
        establishedYear: 2011
    },
    "Panchshil Realty": {
        logo: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Panchshil_Realty_Logo.jpg",
        description: "Panchshil Realty is one of India's finest luxury real estate developers.",
        establishedYear: 2002
    },
    "Kolte Patil Developers": {
        logo: "https://g.foap.com/static_assets/kolte_patil_new_logo.png",
        description: "Kolte-Patil Developers Ltd. is a leading real estate company with dominant presence in the Pune residential market.",
        establishedYear: 1991
    },
    "Rohan Builders": {
        logo: "https://rohanbuilders.com/static/images/logo.png",
        description: "Rohan Builders is a name synonymous with quality, innovation, and ethical business practices in the real estate industry.",
        establishedYear: 1993
    },
    "Gera Developments": {
        logo: "https://www.gera.in/assets/images/logo.png",
        description: "Gera Developments is known for its ChildCentric® Homes and innovative real estate solutions in Pune.",
        establishedYear: 1970
    },
    "Kasturi Housing": {
        logo: "https://kasturi.com/wp-content/themes/kasturi/assets/images/logo.svg",
        description: "Kasturi Housing is an award-winning luxury real estate developer in Pune, known for its architectural excellence.",
        establishedYear: 1999
    },
    "BramhaCorp": {
        logo: "https://www.bramhacorp.in/assets/images/logo.png",
        description: "BramhaCorp is a pioneering real estate company in Pune, known for introducing luxury hospitality and premium residences.",
        establishedYear: 1982
    },
    "DEFAULT": {
        logo: "https://ui-avatars.com/api/?background=0D8ABC&color=fff&size=512",
        description: "A leading name in Pune real estate sector known for quality and delivery.",
        establishedYear: 2005
    }
};

const getMockProject = (name: string, type: string, builder: string) => ({
    title: name,
    slug: name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''),
    location: "Pune, Maharashtra",
    priceRange: "₹85 Lac - ₹1.5 Cr",
    configurations: ["2 BHK", "3 BHK"],
    status: "New Launch",
    type: type || "Residential",
    possessionDate: "Dec 2027",
    description: `Experience luxury living at ${name} by ${builder}. Designed for modern lifestyles with premium amenities.`,
    features: ["Swimming Pool", "Gymnasium", "Clubhouse", "24x7 Security"],
    logo: `https://ui-avatars.com/api/?name=${name[0]}&background=random`
});

async function main() {
    console.log("🚀 Starting Automation Seeding...");

    for (const builderSeed of SEED_DATA) {
        let builderId = '';
        console.log(`🏗️ Processing Builder: ${builderSeed.name}...`);

        // 1. Prepare Builder Data (Mock Only for Speed/Stability in Automation)
        const mock = MOCK_FALLBACK[builderSeed.name] || MOCK_FALLBACK["DEFAULT"];
        const builderData = {
            name: builderSeed.name,
            slug: builderSeed.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''),
            ...mock,
            totalProjects: Math.floor(Math.random() * 20) + 5,
            ongoingProjects: Math.floor(Math.random() * 5) + 1,
            locations: ['Pune']
        };

        if (!builderData.logo || !builderData.logo.startsWith('http')) {
            builderData.logo = `https://ui-avatars.com/api/?name=${builderSeed.name}&background=random`;
        }

        // 2. Insert/Upsert Builder
        const { data: bData, error: bError } = await supabase
            .from('builders')
            .upsert(
                {
                    slug: builderData.slug,
                    name: builderData.name,
                    logo: builderData.logo,
                    description: builderData.description,
                    establishedYear: builderData.establishedYear,
                    totalProjects: builderData.totalProjects,
                    ongoingProjects: builderData.ongoingProjects,
                    locations: builderData.locations
                },
                { onConflict: 'slug' }
            )
            .select()
            .single();

        if (bError) {
            console.error(`❌ Error inserting builder ${builderSeed.name}:`, bError.message);
            // Try to fetch existing to proceed with projects
            const { data: existing } = await supabase.from('builders').select('id').eq('slug', builderData.slug).single();
            if (existing) builderId = existing.id;
        } else {
            builderId = bData.id;
            console.log(`✅ Upserted Builder: ${builderSeed.name}`);
        }

        if (!builderId) continue;

        // 3. Insert Projects
        if (builderSeed.projects && builderSeed.projects.length > 0) {
            for (const projSeed of builderSeed.projects) {
                const seedType = (projSeed as any).type || 'Residential';
                const seedLocation = (projSeed as any).location || 'Pune';
                const projData = getMockProject(projSeed.name, seedType, builderSeed.name);

                const { error: pError } = await supabase
                    .from('projects')
                    .upsert(
                        {
                            slug: projData.slug,
                            title: projData.title,
                            builderId: builderId,
                            location: seedLocation,
                            priceRange: projData.priceRange,
                            configurations: projData.configurations,
                            status: projData.status,
                            type: projData.type,
                            possessionDate: projData.possessionDate,
                            image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
                            description: projData.description,
                            features: projData.features,
                            specs: [],
                            reraId: 'Pending RERA',
                            seoKeywords: [`${projSeed.name} pune`, `${seedType} in ${seedLocation}`],
                            metaDescription: projData.description
                        },
                        { onConflict: 'slug' }
                    );

                if (pError) {
                    console.error(`  ❌ Error inserting project ${projSeed.name}:`, pError.message);
                } else {
                    console.log(`  ✅ Upserted Project: ${projSeed.name}`);
                }
            }
        }
    }
    console.log("✨ Seeding Complete!");
}

main();
