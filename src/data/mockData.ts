
import { Builder, Project, Locality } from '../types';

export const LOCATIONS: Locality[] = [
    { id: '1', name: 'Baner', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800', projectCount: 45 },
    { id: '2', name: 'Hinjewadi', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800', projectCount: 62 },
    { id: '3', name: 'Wakad', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800', projectCount: 38 },
    { id: '4', name: 'Kharadi', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800', projectCount: 29 },
    { id: '5', name: 'Viman Nagar', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800', projectCount: 24 },
    { id: '6', name: 'Koregaon Park', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800', projectCount: 15 },
    { id: '7', name: 'Magarpatta City', image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=800', projectCount: 30 },
    { id: '8', name: 'Bavdhan', image: 'https://images.unsplash.com/photo-1605276378604-ef50ef5c9540?auto=format&fit=crop&q=80&w=800', projectCount: 20 },
    { id: '9', name: 'Balewadi', image: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&q=80&w=800', projectCount: 35 },
    { id: '10', name: 'Hadapsar', image: 'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&q=80&w=800', projectCount: 50 },
    { id: '11', name: 'Wagholi', image: 'https://images.unsplash.com/photo-1592595896551-1634062216da?auto=format&fit=crop&q=80&w=800', projectCount: 42 },
    { id: '12', name: 'Pimple Saudagar', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800', projectCount: 28 },
];

export const BUILDERS: Builder[] = [
    {
        id: 'b1',
        name: 'Godrej Properties',
        slug: 'godrej-properties-developer-pune',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Godrej_Properties_Logo.svg/2560px-Godrej_Properties_Logo.svg.png',
        heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
        description: 'Godrej Properties brings the Godrej Group philosophy of innovation, sustainability, and excellence to the real estate industry. Each Godrej Properties development combines a 122-year legacy of excellence and trust with a commitment to cutting-edge design and technology.',
        establishedYear: 1990,
        totalProjects: 85,
        ongoingProjects: 12,
        locations: ['Baner', 'Hinjewadi', 'Mamurdi', 'Manjari', 'Mahalunge']
    },
    {
        id: 'b2',
        name: 'Kolte Patil Developers',
        slug: 'kolte-patil-developers-pune',
        logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6s8R8q0Z7w2l6k1d5h4t7n0p2r5s8t0u2v4w6',
        heroImage: 'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&q=80&w=1200',
        description: 'Kolte-Patil Developers Ltd. is a leading real estate company with dominant presence in the Pune residential market. The company has developed and constructed over 50 projects including residential complexes, commercial complexes and IT Parks.',
        establishedYear: 1991,
        totalProjects: 50,
        ongoingProjects: 8,
        locations: ['Kharadi', 'Wakad', 'Hinjewadi', 'Baner']
    },
    {
        id: 'b3',
        name: 'Vilas Javdekar Developers',
        slug: 'vilas-javdekar-developers-pune',
        logo: 'https://vj.co.in/wp-content/uploads/2021/08/vj-logo.png',
        heroImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200',
        description: 'Vilas Javdekar Developers represents a philosophy of trust and transparency in the real estate domain. Known for their "Possession Guarantee" and quality construction.',
        establishedYear: 1981,
        totalProjects: 40,
        ongoingProjects: 6,
        locations: ['Sus', 'Baner', 'Wakad', 'Hinjewadi', 'Pirangut']
    },
    {
        id: 'b4',
        name: 'Panchshil Realty',
        slug: 'panchshil-realty-luxury-developers',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Panchshil_Realty_Logo.jpg',
        heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
        description: 'Panchshil Realty is Punes premier real estate developer having commenced hits operations in 2002. The company has successfully delivered over 21 million sq. ft. of prime real estate.',
        establishedYear: 2002,
        totalProjects: 25,
        ongoingProjects: 4,
        locations: ['Koregaon Park', 'Kalyani Nagar', 'Viman Nagar', 'Baner']
    },
    {
        id: 'b5',
        name: 'VTP Realty',
        slug: 'vtp-realty-pune',
        logo: 'https://vtprealty.in/wp-content/uploads/2018/12/VTP-Realty-Logo.png',
        heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
        description: 'VTP Realty is Pune’s #1 Real Estate Brand. They have a massive presence in Kharadi, Hinjawadi & NIBM.',
        establishedYear: 2011,
        totalProjects: 35,
        ongoingProjects: 15,
        locations: ['Kharadi', 'Hinjewadi', 'Pisoli', 'Mahalunge']
    }
];

export const PROJECTS: Project[] = [
    {
        id: 'p1',
        title: 'Godrej Woodsville',
        slug: 'godrej-woodsville-hinjewadi-phase-1-pune-2bhk-3bhk-apartments',
        builderId: 'b1',
        location: 'Hinjewadi',
        priceRange: '₹65L - ₹95L',
        configurations: ['2 BHK', '3 BHK'],
        status: 'Under Construction',
        possessionDate: 'Dec 2026',
        image: 'https://images.unsplash.com/photo-1605276378604-ef50ef5c9540?auto=format&fit=crop&q=80&w=800',
        description: 'Godrej Woodsville in Hinjewadi Phase 1 offers premium homes nestled in nature with world-class amenities. A perfect blend of urban living and green tranquility.',
        features: ['Clubhouse with Pool', 'Organic Garden', 'Work from Home Zone', 'Smart Home Automation'],
        type: 'Residential',
        specs: [
            { label: 'Acres', value: '4.5 Acres' },
            { label: 'Floors', value: '32 Storeys' },
            { label: 'Units', value: '850+' }
        ]
    },
    {
        id: 'p2',
        title: 'Kolte Patil Life Republic',
        slug: 'kolte-patil-life-republic-hinjewadi-township-project',
        builderId: 'b2',
        location: 'Hinjewadi',
        priceRange: '₹45L - ₹1.2Cr',
        configurations: ['1 BHK', '2 BHK', '3 BHK'],
        status: 'Ready to Move',
        possessionDate: 'Ready',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
        description: 'Life Republic is a 400-acre integrated township with 150 acres of open space. It offers a holistic lifestyle with schools, hospitals, and high-street retail within the township.',
        features: ['400 Acre Township', 'International School', 'Sports City', 'High Street Retail'],
        type: 'Residential',
        specs: [
            { label: 'Area', value: '400 Acres' },
            { label: 'Type', value: 'Mega Township' },
            { label: 'Community', value: '10000+ Families' }
        ]
    },
    {
        id: 'p3',
        title: 'VJ Yashwin Enchante',
        slug: 'vj-yashwin-enchante-upper-kharadi-new-launch-project',
        builderId: 'b3',
        location: 'Upper Kharadi',
        priceRange: '₹60L - ₹85L',
        configurations: ['2 BHK', '3 BHK'],
        status: 'New Launch',
        possessionDate: 'Mar 2027',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
        description: 'Yashwin Enchante offers thoughtfully designed homes with community workspaces and easy connectivity to EON IT Park.',
        features: ['Co-working Space', 'Library & Cafe', 'Rooftop Lounge', 'Yoga Deck'],
        type: 'Residential',
        specs: [
            { label: 'Land', value: '5 Acres' },
            { label: 'Towers', value: '4 High Rise' },
            { label: 'Density', value: 'Low Density' }
        ]
    },
    {
        id: 'p4',
        title: 'Godrej Hillside',
        slug: 'godrej-hillside-baner-annex-luxury-residences',
        builderId: 'b1',
        location: 'Baner',
        priceRange: '₹75L - ₹1.15Cr',
        configurations: ['2 BHK', '3 BHK'],
        status: 'Under Construction',
        possessionDate: 'Jun 2025',
        image: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&q=80&w=800',
        description: 'Experience hillside living with Godrej Hillside. Homes that offer breathtaking views of the hills along with premium amenities and great connectivity to the highway.',
        features: ['Hill View Apartments', 'Infinity Edge Pool', 'Nature Trails', '3-Tier Security'],
        type: 'Residential',
        specs: [
            { label: 'Area', value: '8 Acres' },
            { label: 'Elevation', value: 'Hill Top' },
            { label: 'Units', value: '900 approx' }
        ]
    },
    {
        id: 'p5',
        title: 'Kolte Patil 24K Opula',
        slug: 'kolte-patil-24k-opula-pimple-nilakh-luxury-apartments',
        builderId: 'b2',
        location: 'Pimple Nilakh',
        priceRange: '₹1.8Cr - ₹3.5Cr',
        configurations: ['3 BHK', '4 BHK'],
        status: 'Ready to Move',
        possessionDate: 'Ready',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
        description: 'Ultra-luxury riverfront residences for the elite. 24K Opula redefines luxury with its expansive decks, Italian marble flooring, and smart home features.',
        features: ['River View Decks', 'Concierge Service', 'Luxury Spa', 'Home Automation'],
        type: 'Residential',
        specs: [
            { label: 'Area', value: '7 Acres' },
            { label: 'Privacy', value: '2 Units/Floor' },
            { label: 'Club', value: '20,000 sq.ft' }
        ]
    },
    {
        id: 'p6',
        title: 'Panchshil Towers',
        slug: 'panchshil-towers-wagholi-kharadi-annex-ultra-luxury',
        builderId: 'b4',
        location: 'Kharadi Annex',
        priceRange: '₹2.5Cr - ₹5.5Cr',
        configurations: ['3.5 BHK', '4.5 BHK'],
        status: 'Ready to Move',
        possessionDate: 'Ready',
        image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800',
        description: 'Panchshil Towers offers contemporary urban living with close proximity to EON Free Zone. Spread over 14 acres with 9 towers.',
        features: ['Podium Garden', 'Infinity Pool', 'Concierge', 'Business Center'],
        type: 'Residential',
        specs: [
            { label: 'Area', value: '14 Acres' },
            { label: 'Height', value: '35 Floors' },
            { label: 'Luxury', value: 'High End' }
        ]
    },
    {
        id: 'p7',
        title: 'VTP Blue Waters',
        slug: 'vtp-blue-waters-mahalunge-township-river-view',
        builderId: 'b5',
        location: 'Mahalunge',
        priceRange: '₹50L - ₹1.5Cr',
        configurations: ['1 BHK', '2 BHK', '3 BHK'],
        status: 'Under Construction',
        possessionDate: 'Dec 2025',
        image: 'https://images.unsplash.com/photo-1592595896551-1634062216da?auto=format&fit=crop&q=80&w=800',
        description: 'VTP Blue Waters is a mega township project in Mahalunge, offering river-view apartments and a host of sports amenities.',
        features: ['Riverside Promenade', 'Cricket Stadium', 'Equestrian Club', 'Wellness Center'],
        type: 'Residential',
        specs: [
            { label: 'Township', value: '200 Acres' },
            { label: 'Sports', value: 'Professional' },
            { label: 'Views', value: 'River/Hill' }
        ]
    },
    {
        id: 'p8',
        title: 'VTP Altair',
        slug: 'vtp-altair-kharadi-premium-apartments',
        builderId: 'b5',
        location: 'Kharadi',
        priceRange: '₹80L - ₹1.3Cr',
        configurations: ['2 BHK', '3 BHK'],
        status: 'New Launch',
        possessionDate: 'Dec 2027',
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&q=80&w=800',
        description: 'VTP Altair in Kharadi offers glass-facade towers with premium 2 & 3 BHK homes right next to Panchshil Towers.',
        features: ['Glass Facade', 'Rooftop Amenities', 'Smart Homes', 'Electric Charging'],
        type: 'Residential',
        specs: [
            { label: 'Towers', value: '3 Towers' },
            { label: 'Height', value: '30 Floors' },
            { label: 'Design', value: 'Modern' }
        ]
    }
];
