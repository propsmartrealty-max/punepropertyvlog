import React, { useState } from 'react';
// Vercel Force Update
import AdminLayout from '../../components/Admin/AdminLayout';
import { useData } from '../../context/DataContext';
import { fetchProjectDetailsFromAI, fetchBuilderDetailsFromAI } from '../../services/aiService';
import { Loader2, CheckCircle2, AlertCircle, Database, Play } from 'lucide-react';

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
            { name: "VTP Altitude", type: "Commercial", location: "Wwakad" },
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
            // Adding Commercial
            { name: "Life Republic Sound Square", type: "Commercial", location: "Hinjewadi" },
            { name: "Kolte Patil 45 West", type: "Commercial", location: "Baner" },
            { name: "Kolte Patil Giga Space", type: "Commercial", location: "Viman Nagar" },
            { name: "Kolte Patil City Centre", type: "Commercial", location: "Hinjewadi" }
        ]
    },
    {
        name: "Panchshil Realty",
        projects: [
            { name: "Trump Towers Pune", type: "Residential", location: "Kalyani Nagar" },
            { name: "Yoo Pune", type: "Residential", location: "Hadapsar" },
            { name: "Panchshil Towers", type: "Residential", location: "Kharadi" },
            { name: "Eon Waterfront", type: "Residential", location: "Kharadi" },
            { name: "One North", type: "Residential", location: "Hadapsar" },
            { name: "SOHO", type: "Commercial", location: "Kharadi" },
            { name: "Eon Free Zone", type: "Commercial", location: "Kharadi" },
            { name: "Panchshil Business Park", type: "Commercial", location: "Viman Nagar" },
            { name: "World Trade Center Pune", type: "Commercial", location: "Kharadi" }
        ]
    },
    {
        name: "Amanora Park Town",
        projects: [
            { name: "Amanora Gateway Towers", type: "Residential", location: "Hadapsar" },
            { name: "Amanora Future Towers", type: "Residential", location: "Hadapsar" },
            { name: "Amanora Adreno Towers", type: "Residential", location: "Hadapsar" },
            { name: "Amanora Arbora", type: "Residential", location: "Hadapsar" },
            { name: "Amanora Sweet Water Villas", type: "Plot", location: "Hadapsar" }
        ]
    },
    {
        name: "Magarpatta City",
        projects: [
            { name: "Magarpatta City Jasminium", type: "Residential", location: "Hadapsar" },
            { name: "Magarpatta City Roystonea", type: "Residential", location: "Hadapsar" },
            { name: "Nanded City", type: "Residential", location: "Sinhagad Road" },
            { name: "Cybercity Magarpatta", type: "Commercial", location: "Hadapsar" }
        ]
    },
    {
        name: "BramhaCorp",
        projects: [
            { name: "The Collection", type: "Residential", location: "Kalyani Nagar" },
            { name: "F-Residences", type: "Residential", location: "Kalyani Nagar" },
            { name: "BramhaCorp Smart", type: "Residential", location: "Kalyani Nagar" },
            { name: "BramhaCorp Business Park", type: "Commercial", location: "Kalyani Nagar" },
            { name: "Boulevard Towers", type: "Commercial", location: "Pune Camp" }
        ]
    },
    {
        name: "Kasturi Housing",
        projects: [
            { name: "The Balmoral Riverside", type: "Residential", location: "Balewadi" },
            { name: "The Balmoral Hillside", type: "Residential", location: "Baner" },
            { name: "Eon Homes", type: "Residential", location: "Hinjewadi" },
            { name: "Apostrophe", type: "Residential", location: "Wakad" },
            { name: "Zero One", type: "Commercial", location: "Mundhwa" }
        ]
    },
    {
        name: "Rohan Builders",
        projects: [
            { name: "Rohan Abhilasha", type: "Residential", location: "Wagholi" },
            { name: "Rohan Madhuban", type: "Residential", location: "Bavdhan" },
            { name: "Rohan Viti", type: "Residential", location: "Wakad" },
            { name: "Rohan Ananta", type: "Residential", location: "Tathawade" },
            { name: "Rohan Nidita", type: "Residential", location: "Hinjewadi" }
        ]
    },
    {
        name: "Nyati Group",
        projects: [
            { name: "Nyati Elysis", type: "Residential", location: "Kharadi" },
            { name: "Nyati Evolve", type: "Residential", location: "Magarpatta" },
            { name: "Nyati Equatorial", type: "Residential", location: "Bavdhan" },
            { name: "Nyati Unitree", type: "Commercial", location: "Yerwada" },
            { name: "Nyati Empress", type: "Commercial", location: "Viman Nagar" }
        ]
    },
    {
        name: "Kohinoor Group",
        projects: [
            { name: "Kohinoor World Towers", type: "Commercial", location: "Pimpri" },
            { name: "Kohinoor Presidentia", type: "Residential", location: "Sopaan Baug" },
            { name: "Kohinoor Viva City", type: "Residential", location: "Dhanori" },
            { name: "Kohinoor Kaleido", type: "Residential", location: "Wagholi" },
            { name: "Kohinoor Shangrila", type: "Residential", location: "Pimpri" }
        ]
    },
    {
        name: "Solitaire",
        projects: [
            { name: "Solitaire Business Hub", type: "Commercial", location: "Baner" },
            { name: "Solitaire Business Hub", type: "Commercial", location: "Viman Nagar" },
            { name: "Solitaire World", type: "Residential", location: "Bibvewadi" },
            { name: "Solitaire Mudra", type: "Residential", location: "Bibvewadi" }
        ]
    },
    {
        name: "Amar Builders",
        projects: [
            { name: "Amar Landmark", type: "Commercial", location: "Baner" },
            { name: "Amar Business Park", type: "Commercial", location: "Baner" },
            { name: "Amar Renaissance", type: "Residential", location: "Sopaan Baug" }
        ]
    },
    {
        name: "Gera Developments",
        projects: [
            { name: "Gera World of Joy", type: "Residential", location: "Kharadi" },
            { name: "Gera Planet of Joy", type: "Residential", location: "Kharadi" },
            { name: "Gera Island of Joy", type: "Residential", location: "Kharadi" },
            { name: "Gera Imperium", type: "Commercial", location: "Viman Nagar" }
        ]
    },
    {
        name: "Goel Ganga Developments",
        projects: [
            { name: "Ganga Legend", type: "Residential", location: "Bavdhan" },
            { name: "Ganga Fernhill", type: "Residential", location: "Undri" },
            { name: "Ganga Asmi", type: "Residential", location: "Wakad" },
            { name: "Ganga Acropolis", type: "Residential", location: "Baner" }
        ]
    },
    {
        name: "Lodha Group",
        projects: [
            { name: "Lodha Belmondo", type: "Residential", location: "Gahunje" },
            { name: "Lodha Giardino", type: "Residential", location: "Kharadi" },
            { name: "Lodha Panache", type: "Residential", location: "Hinjewadi" }
        ]
    },
    {
        name: "Sobha Limited",
        projects: [
            { name: "Sobha Nesara", type: "Residential", location: "Chandani Chowk" },
            { name: "Sobha Orion", type: "Residential", location: "Kondhwa" }
        ]
    },
    {
        name: "Kalpataru",
        projects: [
            { name: "Kalpataru Jade Residences", type: "Residential", location: "Baner" },
            { name: "Kalpataru Serenity", type: "Residential", location: "Manjri" },
            { name: "Kalpataru Exquisite", type: "Residential", location: "Wakad" }
        ]
    },
    {
        name: "Prestige Group",
        projects: [
            { name: "Prestige Panorama", type: "Residential", location: "Keshavnagar" }
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
        logo: "https://www.koltepatil.com/assets/front/images/kp-logo.png",
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

const CURATED_PROJECT_IMAGES = [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000', // Modern High Rise
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000', // Luxury Interior
    'https://images.unsplash.com/photo-1600596542815-e32c8ec7f985?auto=format&fit=crop&q=80&w=1000', // Villa w/ Pool
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000', // Glass Skyscraper
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000', // Resort Style
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1000', // Modern Living Room
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1000'  // Luxury Manor
];

const getMockProject = (name: string, type: string, builder: string) => ({
    title: name,
    slug: name.toLowerCase().replace(/ /g, '-'),
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

const SeedData = () => {
    // const { addProject, addBuilder } = useData(); // Refactored to use direct supabase upsert check below
    const [logs, setLogs] = useState<string[]>([]);
    const [isSeeding, setIsSeeding] = useState(false);
    const [progress, setProgress] = useState(0);

    const log = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);

    const startSeeding = async () => {
        setIsSeeding(true);
        setLogs([]);
        setProgress(0);

        try {
            log("🚀 Starting Seeding Process...");

            // DIAGNOSTICS: Check if Env Vars are loaded
            const sbUrl = import.meta.env.VITE_SUPABASE_URL || '';
            const isPlaceholder = sbUrl.includes('placeholder') || sbUrl === '' || sbUrl === 'MISSING';

            log(`🔎 Connection Check: ${isPlaceholder ? '❌ FAILED (Missing Key)' : '✅ Using Real URL'}`);
            log(`🔎 URL Value: ${sbUrl ? sbUrl.substring(0, 15) + '...' : 'EMPTY'}`);

            const totalSteps = SEED_DATA.length + SEED_DATA.reduce((acc, b) => acc + b.projects.length, 0);
            let currentStep = 0;
            const updateProgress = () => setProgress(Math.round((++currentStep / totalSteps) * 100));

            for (let i = 0; i < SEED_DATA.length; i++) {
                const builderSeed = SEED_DATA[i];
                let builderId = '';

                // A. Process Builder
                log(`🏗️ Processing Builder: ${builderSeed.name}...`);
                let builderData: any = {};

                try {
                    builderData = await fetchBuilderDetailsFromAI(builderSeed.name);
                } catch (e: any) {
                    log(`⚠️ AI Limit/Error for ${builderSeed.name}. Using Mock Data.`);
                    const mock = MOCK_FALLBACK[builderSeed.name] || MOCK_FALLBACK["DEFAULT"];
                    builderData = {
                        name: builderSeed.name,
                        slug: builderSeed.name.toLowerCase().replace(/ /g, '-'),
                        ...mock,
                        totalProjects: 15,
                        ongoingProjects: 4
                    };
                }

                // Ensure logo is valid
                if (!builderData.logo || !builderData.logo.startsWith('http')) {
                    builderData.logo = `https://ui-avatars.com/api/?name=${builderSeed.name}&background=random`;
                }

                try {
                    // Use Upsert for Builder
                    const { supabase } = await import('../../services/supabase');
                    const { error } = await supabase
                        .from('builders')
                        .upsert({
                            name: builderData.name || builderSeed.name,
                            slug: builderData.slug || builderSeed.name.toLowerCase().replace(/ /g, '-'),
                            logo: builderData.logo,
                            hero_image: builderData.heroImage || '',
                            description: builderData.description,
                            total_projects: builderData.totalProjects || 10,
                            ongoing_projects: builderData.ongoingProjects || 2,
                            locations: ['Pune'],
                            // Map camelCase to snake_case for DB
                            established_year: builderData.establishedYear || 2000
                        }, { onConflict: 'slug' });

                    if (error) throw error;

                    builderId = builderData.name || builderSeed.name; // In real app, fetch ID. Here we use name/slug as reference if needed but better to query.

                    // Fetch the actual ID for connecting projects
                    const { data: bData } = await supabase.from('builders').select('id').eq('slug', builderData.slug || builderSeed.name.toLowerCase().replace(/ /g, '-')).single();
                    if (bData) builderId = bData.id;

                    log(`✅ Added/Updated Builder: ${builderSeed.name}`);
                } catch (e: any) {
                    log(`❌ DB Error ${builderSeed.name}: ${e.message}`);
                    builderId = ''; // Skip projects if builder failed
                }
                updateProgress();

                // B. Process Projects for this Builder
                if (builderId && builderSeed.projects && builderSeed.projects.length > 0) {
                    for (let j = 0; j < builderSeed.projects.length; j++) {
                        const projSeed = builderSeed.projects[j];
                        // Assert type safely if missing in seed data
                        const seedType = (projSeed as any).type || 'Residential';
                        const seedLocation = (projSeed as any).location || 'Pune';

                        log(`  -> Fetching Project: ${projSeed.name} (${seedType})...`);
                        let projData: any = {};

                        try {
                            projData = await fetchProjectDetailsFromAI(`Real estate project ${projSeed.name} ${seedLocation} Pune details`);
                        } catch (e) {
                            log(`  ⚠️ AI Limit for ${projSeed.name}. Using Mock.`);
                            projData = getMockProject(projSeed.name, seedType, builderSeed.name);
                        }

                        try {
                            // Upsert Logic for Projects
                            const { error: pError } = await supabase
                                .from('projects')
                                .upsert({
                                    title: projData.title || projSeed.name,
                                    slug: projData.slug || projSeed.name.toLowerCase().replace(/ /g, '-'),
                                    builder_id: builderId,
                                    location: seedLocation,
                                    price_range: projData.priceRange || 'Contact for Price',
                                    configurations: projData.configurations || ['2 BHK', '3 BHK'],
                                    status: (projData.status as any) || 'New Launch',
                                    type: (projData.type as any) || seedType,
                                    possession_date: projData.possessionDate || '2027',
                                    image: CURATED_PROJECT_IMAGES[Math.floor(Math.random() * CURATED_PROJECT_IMAGES.length)],
                                    description: projData.description || `${seedType} project by ${builderSeed.name}.`,
                                    features: projData.features || ['Security', 'Power Backup'],
                                    specs: [],
                                    rera_id: projData.reraId || 'Pending RERA',
                                    exact_price: projData.exactPrice || 0,
                                    price_type: 'L',
                                    seo_keywords: projData.seoKeywords || [`${projSeed.name} pune`, `${seedType} in ${seedLocation}`, 'luxury homes pune'],
                                    meta_description: projData.metaDescription || `Explore ${projSeed.name} in ${seedLocation}.`,
                                    configuration_details: projData.configurationDetails || []
                                }, { onConflict: 'slug' });

                            if (pError) throw pError;

                            log(`  ✅ Added/Updated Project: ${projSeed.name}`);
                        } catch (e: any) {
                            log(`  ❌ Failed Project ${projSeed.name}: ${e.message}`);
                        }
                        updateProgress();

                        // Fast mode since we handle errors gracefully now
                        await new Promise(r => setTimeout(r, 1000));
                    }
                }
            }
            log("✨ Seeding Complete!");
        } catch (err: any) {
            log(`💥 CRITICAL FAILURE: ${err.message}`);
        } finally {
            setIsSeeding(false);
            setProgress(100);
        }
    };

    return (
        <AdminLayout title="AI Data Seeder">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="bg-blue-100 p-3 rounded-xl">
                            <Database className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Populate Database with AI</h2>
                            <p className="text-slate-500 mt-1">
                                Automatically fetch and insert 20+ top builders and projects in Pune using Gemini AI.
                                Suitable for initial setup.
                            </p>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        <div className="text-sm text-amber-800">
                            <p className="font-bold">Diagnostics:</p>
                            <ul className="list-disc ml-4 mt-1 space-y-1">
                                <li>
                                    Supabase Connection: {import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('placeholder') ? '✅ Connected' : '❌ MISSING (Check Vercel Env Vars)'}
                                </li>
                                <li>
                                    Google Gemini AI: {import.meta.env.VITE_GEMINI_API_KEY ? '✅ Active' : '⚠️ Missing (Will use Mock Data)'}
                                </li>
                            </ul>
                            <p className="mt-2 text-xs opacity-75">
                                If Supabase is missing, data <strong>will not save</strong>. Go to Vercel Settings &gt; Environment Variables and add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={startSeeding}
                        disabled={isSeeding}
                        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${isSeeding
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/30'
                            }`}
                    >
                        {isSeeding ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" /> Seeding in Progress... {progress}%
                            </>
                        ) : (
                            <>
                                <Play className="w-6 h-6" /> Start Population
                            </>
                        )}
                    </button>
                </div>

                {logs.length > 0 && (
                    <div className="bg-slate-900 rounded-2xl p-6 shadow-xl overflow-hidden font-mono text-sm max-h-96 overflow-y-auto">
                        <h3 className="text-slate-400 font-bold mb-4 border-b border-slate-700 pb-2">Execution Logs</h3>
                        <div className="space-y-1">
                            {logs.map((line, i) => (
                                <p key={i} className={`${line.includes('❌') ? 'text-red-400' : line.includes('✅') ? 'text-green-400' : line.includes('⚠️') ? 'text-amber-400' : 'text-slate-300'}`}>
                                    {line}
                                </p>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default SeedData;
