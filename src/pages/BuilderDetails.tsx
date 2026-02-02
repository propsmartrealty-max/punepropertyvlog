
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import PortalNavbar from '../components/Portal/Navbar';
import Footer from '../components/Portal/Footer';
import SEO from '../components/SEO';
import { Building2, MapPin, Trophy } from 'lucide-react';
import TrustScore from '../components/Portal/TrustScore';

const BuilderDetails = () => {
    const { slug } = useParams<{ slug: string }>();
    const { builders, projects } = useData();
    const builder = builders.find(b => b.slug === slug);

    if (!builder) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Builder Not Found</h2>
                    <Link to="/" className="text-blue-600 hover:underline">Return Home</Link>
                </div>
            </div>
        );
    }

    // Robust filtering logic: check builderId against id OR name (for seeded data)
    const builderProjects = projects.filter(p => p.builderId === builder.id || p.builderId === builder.name);

    return (
        <div className="min-h-screen bg-gray-50">
            <SEO
                title={`${builder.name} - Projects in Pune`}
                description={builder.description}
                canonical={`https://punepropertyvlog.in/builder/${builder.slug}`}
                openGraph={{
                    type: 'profile',
                    image: builder.logo
                }}
                jsonLd={{
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "name": builder.name,
                    "url": `https://punepropertyvlog.in/builder/${builder.slug}`,
                    "logo": builder.logo,
                    "description": builder.description,
                    "foundingDate": builder.establishedYear.toString(),
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Pune",
                        "addressRegion": "Maharashtra",
                        "addressCountry": "IN"
                    },
                    "contactPoint": {
                        "@type": "ContactPoint",
                        "telephone": "+91-7744009295",
                        "contactType": "sales",
                        "areaServed": "Pune"
                    },
                    "sameAs": [
                        // Add social links if available in future
                    ]
                }}
            />
            <PortalNavbar />

            {/* Hero */}
            <div className="h-[300px] w-full relative">
                <img
                    src={builder.heroImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000'}
                    alt={builder.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/70" />
                <div className="absolute bottom-0 left-0 w-full p-8">
                    <div className="max-w-7xl mx-auto flex items-end gap-6">
                        <div className="w-32 h-32 bg-white rounded-xl p-2 shadow-lg -mb-12 relative z-10 flex items-center justify-center">
                            <img
                                src={builder.logo || 'https://ui-avatars.com/api/?name=' + builder.name + '&background=random'}
                                alt={builder.name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="text-white pb-2">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl font-bold">{builder.name}</h1>
                                {builder.isVerified && (
                                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                                        <Trophy className="w-3 h-3 text-yellow-300" /> Verified
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-300 max-w-2xl">{builder.description}</p>
                            {builder.mobile && (
                                <a href={`tel:${builder.mobile}`} className="inline-block mt-4 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-4 py-2 rounded-lg transition-colors border border-white/20">
                                    Contact: {builder.mobile}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pt-20 pb-12">

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-2 md:col-span-1 transform hover:scale-105 transition-transform duration-300">
                        <p className="text-gray-500 text-sm mb-1 font-bold uppercase tracking-wide">Trust Score</p>
                        <TrustScore score={builder.trustScore || 8.5} showLabel={false} size="lg" />
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-sm mb-1 font-bold uppercase tracking-wide">Experience</p>
                        <p className="text-2xl font-bold text-slate-800">{builder.experience || (new Date().getFullYear() - builder.establishedYear)} Years</p>
                        <p className="text-xs text-slate-400">Since {builder.establishedYear}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-sm mb-1">Total Projects</p>
                        <p className="text-2xl font-bold text-slate-800">{builder.totalProjects}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-sm mb-1">Active Projects</p>
                        <p className="text-2xl font-bold text-slate-800">{builder.ongoingProjects}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-sm mb-1">Cities</p>
                        <p className="text-2xl font-bold text-slate-800">{builder.locations.length}+</p>
                    </div>
                </div>

                {/* Projects List */}
                <h2 className="text-2xl font-bold mb-6">Projects by {builder.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {builderProjects.map(project => (
                        <Link
                            to={`/project/${project.slug}`}
                            key={project.id}
                            className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800';
                                    }}
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded text-slate-800 uppercase">
                                        {project.status}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                                    {project.title}
                                </h3>
                                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                                    <MapPin className="w-4 h-4" />
                                    {project.location}
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Starting</p>
                                        <p className="font-bold text-slate-900">{project.priceRange}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Configuration</p>
                                        <p className="font-medium text-slate-700">{project.configurations[0]}+</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>

            <Footer />
        </div>
    );
};

export default BuilderDetails;
