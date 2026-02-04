
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
// import { LOCATIONS } from '../data/mockData';
import PortalNavbar from '../components/Portal/Navbar';
import Footer from '../components/Portal/Footer';
import SEO from '../components/SEO';
import { CheckCircle2 } from 'lucide-react';

import PropertyCard from '../components/Portal/PropertyCard';

const BuildersGrid = ({ builders }: { builders: any[] }) => {
    const [erroredImages, setErroredImages] = React.useState<Record<string, boolean>>({});

    const handleImageError = (builderId: string) => {
        setErroredImages(prev => ({ ...prev, [builderId]: true }));
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {builders.map((builder) => {
                const showFallback = !builder.logo || erroredImages[builder.id];
                return (
                    <Link to={`/builder/${builder.slug}`} key={builder.id} className="group relative bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center gap-4 hover:border-brand-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center p-3 overflow-hidden border border-slate-100 group-hover:scale-105 transition-transform relative">
                            {showFallback ? (
                                <div className="w-full h-full flex items-center justify-center bg-slate-100 rounded-full">
                                    <span className="text-xl font-bold text-slate-400">{getInitials(builder.name)}</span>
                                </div>
                            ) : (
                                <img
                                    src={builder.logo}
                                    alt={builder.name}
                                    className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all"
                                    onError={() => handleImageError(builder.id)}
                                />
                            )}

                            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full border-2 border-white">
                                <CheckCircle2 className="w-3 h-3" />
                            </div>
                        </div>
                        <div className="text-center">
                            <h4 className="font-bold text-sm md:text-base text-slate-800 group-hover:text-brand-600 transition-colors line-clamp-2">{builder.name}</h4>
                            <p className="text-xs text-slate-400 mt-1">{builder.totalProjects || 0} Projects</p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

const Directory = () => {
    const { projects, builders } = useData();
    const [searchParams] = useSearchParams();
    const view = searchParams.get('view') || 'projects'; // 'projects' | 'builders'

    // Filter out test data and invalid entries
    const validProjects = React.useMemo(() => {
        return projects.filter(p =>
            p.title &&
            !p.title.toLowerCase().includes('test') &&
            !p.location.toLowerCase().includes('test')
        );
    }, [projects]);

    // Derive locations dynamically from valid projects
    const locations = React.useMemo(() => {
        const locs: Record<string, number> = {};
        validProjects.forEach(p => {
            if (p.location) {
                const l = p.location.trim();
                locs[l] = (locs[l] || 0) + 1;
            }
        });
        return Object.entries(locs).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count, id: name }));
    }, [validProjects]);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };


    return (
        <div className="min-h-screen bg-slate-50">
            <SEO
                title={view === 'builders' ? "Top Builders in Pune" : "All Property Projects in Pune - Directory"}
                description="Browse our complete directory of real estate projects, builders, and locations in Pune."
            />
            <PortalNavbar />

            <div className="max-w-7xl mx-auto px-4 pt-28 pb-12">
                <div className="flex flex-col md:flex-row items-baseline justify-between mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">
                        {view === 'builders' ? 'Pune Real Estate Developers' : 'Pune Real Estate Directory'}
                    </h1>

                    {/* View Switcher/Tabs */}
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <Link
                            to="/directory?view=projects"
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${view !== 'builders' ? 'bg-brand-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                        >
                            Projects ({validProjects.length})
                        </Link>
                        <Link
                            to="/directory?view=builders"
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${view === 'builders' ? 'bg-brand-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                        >
                            Builders ({builders.length})
                        </Link>
                    </div>
                </div>

                {view === 'builders' ? (
                    <BuildersGrid builders={builders} />
                ) : (
                    /* Projects View */
                    <>
                        {/* Locations Pills */}
                        <section className="mb-10">
                            <div className="flex flex-wrap gap-2">
                                {locations.map(loc => (
                                    <Link
                                        key={loc.id}
                                        to={`/search?location=${encodeURIComponent(loc.name)}`}
                                        className="px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-brand-600 hover:border-brand-200 hover:shadow-sm transition-all text-sm font-medium"
                                    >
                                        {loc.name} <span className="text-slate-400 text-xs ml-1">{loc.count}</span>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {/* Projects Grid */}
                        <section>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {validProjects.map(project => (
                                    <PropertyCard key={project.id} project={project} variant="grid" />
                                ))}
                            </div>
                        </section>
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Directory;
