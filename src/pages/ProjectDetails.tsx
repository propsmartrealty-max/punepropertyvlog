import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import PortalNavbar from '../components/Portal/Navbar';
import Breadcrumbs from '../components/Portal/Breadcrumbs';
import Footer from '../components/Portal/Footer';
import SEO from '../components/SEO';
import { MapPin, Building2, CheckCircle2, ArrowRight, Phone, Download, Share2, Heart, Star } from 'lucide-react';
import EMICalculator from '../components/Portal/EMICalculator';
import { DetailSkeleton, ErrorState } from '../components/UI/LoadingSkeleton';

const ProjectDetails = () => {
    const { slug } = useParams<{ slug: string }>();
    const { projects, builders, isLoading, error, refreshData } = useData();
    const project = projects.find(p => p.slug === slug);
    const [activeSection, setActiveSection] = useState('overview');

    // Lead Form State
    const [leadName, setLeadName] = useState('');
    const [leadMobile, setLeadMobile] = useState('');
    const [leadEmail, setLeadEmail] = useState('');

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 font-sans">
                <PortalNavbar />
                <DetailSkeleton />
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
                <PortalNavbar />
                <div className="flex-1 flex items-center justify-center p-4">
                    <ErrorState message={error} onRetry={refreshData} />
                </div>
                <Footer />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50">
                <PortalNavbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
                        <Link to="/" className="text-blue-600 hover:underline">Return Home</Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // Improved Builder Lookup (Handles UUID vs Name mismatch from seeding)
    const builder = builders.find(b => b.id === project.builderId || b.name === project.builderId);

    // Sticky Nav Logic
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            // Offset: 80px (Navbar) + 60px (Tabs) + 20px (Buffer) = 160px
            const y = element.getBoundingClientRect().top + window.scrollY - 160;
            window.scrollTo({ top: y, behavior: 'smooth' });
            setActiveSection(id);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, {
            rootMargin: '-160px 0px -50% 0px', // Adjusted for new offset
            threshold: 0.1
        });

        const sections = ['overview', 'master-layout', 'floor-plans', 'configurations', 'amenities', 'location', 'builder'];
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [project]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <SEO
                title={`${project.title} by ${builder?.name || 'Top Builder'} - ${project.location}`}
                description={`${project.title} in ${project.location}. ${project.metaDescription || `Premium ${project.type} project starting at ${project.priceRange}.`}`}
                keywords={project.seoKeywords || [`${project.title}`, `${project.location} flats`, `New projects in ${project.location}`]}
                canonical={`https://punepropertyvlog.in/project/${project.slug}`}
                openGraph={{
                    type: 'website',
                    image: project.heroImage || project.image
                }}
                jsonLd={{
                    "@context": "https://schema.org",
                    "@type": "SingleFamilyResidence", // Or "RealEstateListing" but SingleFamilyResidence/ApartmentComplex is more specific
                    "name": project.title,
                    "image": [project.image, project.heroImage, ...(project.floorPlans || [])].filter(Boolean),
                    "description": project.description,
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": project.location,
                        "addressRegion": "Maharashtra",
                        "addressCountry": "IN"
                    },
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": "18.5204", // Placeholder, ideally fetch from lat/lng if available
                        "longitude": "73.8567"
                    },
                    "url": `https://punepropertyvlog.in/project/${project.slug}`,
                    "priceRange": project.priceRange,
                    "numberOfRooms": project.configurations.length,
                    "floorSize": {
                        "@type": "QuantitativeValue",
                        "value": project.configurationDetails?.[0]?.carpetArea || "0",
                        "unitCode": "FTK"
                    },
                    "amenityFeature": project.features.map(f => ({
                        "@type": "LocationFeatureSpecification",
                        "name": f,
                        "value": true
                    })),
                    "provider": {
                        "@type": "Organization",
                        "name": builder?.name || project.builderId,
                        "url": builder ? `https://punepropertyvlog.in/builder/${builder.slug}` : undefined
                    }
                }}
            />
            <PortalNavbar />

            {/* Breadcrumbs Area */}
            <div className="bg-white border-b border-gray-100 pt-20"> {/* Added pt-20 to account for Fixed Navbar */}
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <Breadcrumbs items={[
                        { label: 'Pune', path: '/' },
                        { label: project.location, path: `/search?q=${project.location}` },
                        { label: project.title }
                    ]} />
                </div>
            </div>

            {/* Hero Image & Header */}
            <div className="relative h-[450px] md:h-[550px] w-full group">
                <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90" />

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex gap-2 mb-4">
                                <span className="bg-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    {project.status}
                                </span>
                                <span className="bg-white/20 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    RERA: {project.reraId || 'Pending'}
                                </span>
                                <span className="bg-emerald-500/80 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    {project.type}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2">{project.title}</h1>
                            <div className="flex items-center gap-2 text-gray-200 text-lg">
                                <MapPin className="w-5 h-5" />
                                <span>{project.location}, Pune</span>
                            </div>
                        </div>
                        <div className="flex flex-col md:items-end gap-2">
                            <p className="text-sm text-gray-300 uppercase tracking-widest font-semibold">Starting Price</p>
                            <p className="text-4xl font-bold text-white mb-2">{project.exactPrice || project.priceRange}</p>
                            <div className="flex gap-3">
                                <button className="bg-white/10 hover:bg-white/20 backdrop-blur p-2 rounded-full transition-colors">
                                    <Share2 className="w-5 h-5" />
                                </button>
                                <button className="bg-white/10 hover:bg-white/20 backdrop-blur p-2 rounded-full transition-colors">
                                    <Heart className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Navigation (Adjusted top to not hide behind Fixed Navbar) */}
            <div className="sticky top-[72px] z-40 bg-white/95 backdrop-blur shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex gap-8 overflow-x-auto no-scrollbar">
                        <div className="flex gap-8 overflow-x-auto no-scrollbar">
                            {[
                                'overview',
                                ...(project.masterLayout ? ['master-layout'] : []),
                                ...(project.floorPlans && project.floorPlans.length > 0 ? ['floor-plans'] : []),
                                'configurations',
                                'amenities',
                                'location',
                                'builder'
                            ].map((section) => (
                                <button
                                    key={section}
                                    onClick={() => scrollToSection(section)}
                                    className={`py-4 px-2 font-semibold text-sm uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${activeSection === section ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-slate-800'
                                        }`}
                                >
                                    {section.replace('-', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12 relative">

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-16">

                    {/* Overview */}
                    <section id="overview" className="scroll-mt-40">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">About {project.title}</h2>
                        <div className="prose max-w-none text-slate-600 leading-relaxed mb-8">
                            <p>{project.description}</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm gap-y-6">
                            {project.specs.map((spec, index) => (
                                <div key={index} className="border-r last:border-0 border-gray-100 px-4">
                                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{spec.label}</p>
                                    <p className="font-semibold text-slate-800">{spec.value}</p>
                                </div>
                            ))}
                            <div className="px-4">
                                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Status</p>
                                <p className="font-semibold text-slate-800">{project.status}</p>
                            </div>
                        </div>
                    </section>

                    {/* Master Layout */}
                    {project.masterLayout && (
                        <section id="master-layout" className="scroll-mt-40">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Master Layout</h2>
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                <img
                                    src={project.masterLayout}
                                    alt={`${project.title} Master Plan`}
                                    className="w-full h-auto rounded-xl hover:scale-[1.02] transition-transform cursor-zoom-in"
                                />
                            </div>
                        </section>
                    )}

                    {/* Floor Plans */}
                    {project.floorPlans && project.floorPlans.length > 0 && (
                        <section id="floor-plans" className="scroll-mt-40">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Floor Plans</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {project.floorPlans.map((plan, i) => (
                                    <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm group">
                                        <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 mb-3 relative">
                                            <img
                                                src={plan}
                                                alt={`Floor Plan ${i + 1}`}
                                                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                                        </div>
                                        <p className="text-center font-medium text-slate-700">Type {i + 1}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Configurations (Pricing) */}
                    <section id="configurations" className="scroll-mt-40">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Unit Configurations</h2>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="grid grid-cols-4 bg-slate-50 p-4 font-semibold text-slate-700 text-sm">
                                <div>Unit Type</div>
                                <div>Carpet Area</div>
                                <div>Price</div>
                                <div></div>
                            </div>
                            {/* Logic: Prefer rich configurationDetails; fallback to basic configurations list */}
                            {(project.configurationDetails?.length ? project.configurationDetails : project.configurations.map(c => ({
                                type: c,
                                carpetArea: 'Request Info',
                                priceRange: 'Request Price'
                            }))).map((config: any, i: number) => (
                                <div key={i} className="grid grid-cols-4 p-4 items-center border-t border-gray-100 hover:bg-blue-50/50 transition-colors">
                                    <div className="font-bold text-slate-800">{config.type || config}</div>
                                    <div className="text-slate-600 font-medium">{config.carpetArea || '--'}</div>
                                    <div className="font-bold text-slate-900">
                                        {/* Show Exact price if available for specific config, else project range */}
                                        {config.priceRange && config.priceRange !== 'Request Price'
                                            ? config.priceRange
                                            : (i === 0 && project.exactPrice ? project.exactPrice : 'Request Price')}
                                    </div>
                                    <div className="text-right">
                                        <button
                                            onClick={() => window.open('https://wa.me/917744009295?text=Hi, sending breakdown for ' + (config.type || config) + ' in ' + project.title, '_blank')}
                                            className="text-blue-600 font-semibold text-sm hover:underline"
                                        >
                                            Price Breakup
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Amenities */}
                    <section id="amenities" className="scroll-mt-40">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Amenities</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {project.features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    <span className="font-medium text-slate-700">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Location */}
                    <section id="location" className="scroll-mt-40">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Location</h2>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                            <div className="flex items-center gap-2 text-slate-700 mb-2">
                                <MapPin className="w-5 h-5 text-blue-600" />
                                <span className="font-semibold text-lg">{project.location}, Pune</span>
                            </div>

                            {/* LIVE GOOGLE MAP */}
                            <div className="w-full h-80 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative group">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    scrolling="no"
                                    marginHeight={0}
                                    marginWidth={0}
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(project.title + ' ' + project.location + ' Pune')}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                                    className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                                ></iframe>
                            </div>

                            <p className="text-slate-600">
                                Located strategically in {project.location}, offering excellent connectivity to IT hubs, schools, and hospitals.
                            </p>
                        </div>
                    </section>

                    {/* Builder Info - Main Section (Improved Fallback) */}
                    <section id="builder" className="scroll-mt-32">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">About Developer</h2>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <img
                                    src={builder?.logo || 'https://ui-avatars.com/api/?name=Developer&background=random'}
                                    alt={builder?.name || 'Developer'}
                                    className="w-32 h-32 object-contain p-4 bg-white rounded-xl border border-slate-100 shadow-sm"
                                />
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">{builder?.name || project.builderId || 'Reputed Developer'}</h3>
                                        <p className="text-slate-500 text-sm">Established {builder?.establishedYear || '2000'}</p>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed">
                                        {builder?.description || `A leading real estate developer known for quality construction and timely delivery of projects like ${project.title}.`}
                                    </p>
                                    <div className="flex gap-6 mt-4">
                                        <div>
                                            <p className="text-2xl font-bold text-blue-600">{builder?.totalProjects || '10+'}</p>
                                            <p className="text-xs text-slate-500 uppercase font-semibold">Total Projects</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-green-600">{builder?.ongoingProjects || '2+'}</p>
                                            <p className="text-xs text-slate-500 uppercase font-bold">Ongoing</p>
                                        </div>
                                    </div>
                                    {builder && (
                                        <Link to={`/builder/${builder.slug}`} className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline mt-2">
                                            View Builder Profile <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Similar Projects Section */}
                    <section className="pt-8 border-t border-gray-200">
                        <h2 className="text-2xl font-bold text-slate-800 mb-8">Similar Properties in {project.location}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {projects
                                .filter(p => p.location === project.location && p.id !== project.id)
                                .slice(0, 2)
                                .map(p => (
                                    <Link key={p.id} to={`/project/${p.slug}`} className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col">
                                        <div className="h-48 overflow-hidden relative">
                                            <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                                                {p.priceRange}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{p.title}</h3>
                                            <p className="text-sm text-slate-500">{p.location}</p>
                                        </div>
                                    </Link>
                                ))}
                            {projects.filter(p => p.location === project.location && p.id !== project.id).length === 0 && (
                                <p className="text-slate-500 text-sm italic">More properties coming soon to {project.location}...</p>
                            )}
                        </div>
                    </section>
                </div>

                {/* Sidebar Sticky */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">

                        {/* Highlights Card */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-xl overflow-hidden text-white">
                            <div className="p-6">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-400" /> Why this Project?
                                </h3>
                                <ul className="space-y-3">
                                    {(project.highlights || [
                                        `Premium ${project.type} in ${project.location}`,
                                        `Starting at ${project.priceRange}`,
                                        "Excellent Connectivity"
                                    ]).map((point, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-slate-200">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Lead Form Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="bg-blue-600 p-4 text-white text-center">
                                <p className="font-bold text-lg">Interested in this property?</p>
                                <p className="text-blue-100 text-sm">Get Best Deal Guaranteed!</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    value={leadName}
                                    onChange={(e) => setLeadName(e.target.value)}
                                />
                                <input
                                    type="tel"
                                    placeholder="+91 Phone Number"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    value={leadMobile}
                                    onChange={(e) => setLeadMobile(e.target.value)}
                                />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    value={leadEmail}
                                    onChange={(e) => setLeadEmail(e.target.value)}
                                />

                                <button
                                    onClick={() => {
                                        const text = `Hi, I am interested in ${project.title}. Please share details.\n\nName: ${leadName}\nMobile: ${leadMobile}`;
                                        window.open(`https://wa.me/917744009295?text=${encodeURIComponent(text)}`, '_blank');
                                    }}
                                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                >
                                    WhatsApp Enquiry <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-5 h-5 filter invert brightness-0" alt="WA" />
                                </button>
                                <a
                                    href="tel:+917744009295"
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                >
                                    Call Now <Phone className="w-4 h-4" />
                                </a>
                            </div>
                            <div className="bg-slate-50 p-4 text-center text-xs text-gray-500 border-t border-gray-100">
                                By submitting, you agree to our Terms & Privacy Policy
                            </div>
                        </div>

                        {/* EMI Calculator Widget */}
                        <EMICalculator priceRange={project.priceRange} />

                        {/* Builder Mini Card */}
                        {builder && (
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <img src={builder.logo} alt={builder.name} className="w-16 h-16 object-contain p-2 bg-white rounded-lg border border-gray-100" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Developer</p>
                                    <h4 className="font-bold text-slate-900">{builder.name}</h4>
                                    <Link to={`/builder/${builder.slug}`} className="text-blue-600 text-sm font-semibold hover:underline">View Profile</Link>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

            </div>

            <Footer />
        </div>
    );
};

export default ProjectDetails;
