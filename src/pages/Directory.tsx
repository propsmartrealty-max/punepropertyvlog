
import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
// import { LOCATIONS } from '../data/mockData';
import PortalNavbar from '../components/Portal/Navbar';
import Footer from '../components/Portal/Footer';
import SEO from '../components/SEO';

import PropertyCard from '../components/Portal/PropertyCard';

const Directory = () => {
    const { projects } = useData();

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

    return (
        <div className="min-h-screen bg-slate-50">
            <SEO
                title="All Property Projects in Pune - Directory"
                description="Browse our complete directory of real estate projects, builders, and locations in Pune. Find verified listings in Baner, Hinjewadi, Wakad, and more."
            />
            <PortalNavbar />

            <div className="max-w-7xl mx-auto px-4 pt-28 pb-12">
                <div className="flex flex-col md:flex-row items-baseline justify-between mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Pune Real Estate Directory</h1>
                    <p className="text-slate-500">Showing {validProjects.length} Verified Projects</p>
                </div>

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
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200">
                        <h2 className="text-xl font-bold text-slate-800">All Projects</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {validProjects.map(project => (
                            <PropertyCard key={project.id} project={project} variant="grid" />
                        ))}
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
};

export default Directory;
