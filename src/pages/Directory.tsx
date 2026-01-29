
import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
// import { LOCATIONS } from '../data/mockData';
import PortalNavbar from '../components/Portal/Navbar';
import Footer from '../components/Portal/Footer';
import SEO from '../components/SEO';

const Directory = () => {
    const { projects } = useData();

    // Derive locations dynamically
    const locations = React.useMemo(() => {
        const locs: Record<string, number> = {};
        projects.forEach(p => {
            if (p.location) {
                const l = p.location.trim();
                locs[l] = (locs[l] || 0) + 1;
            }
        });
        return Object.entries(locs).map(([name, count]) => ({ name, count, id: name }));
    }, [projects]);

    return (
        <div className="min-h-screen bg-white">
            <SEO
                title="All Property Projects in Pune - Directory"
                description="Browse our complete directory of real estate projects, builders, and locations in Pune. Find verified listings in Baner, Hinjewadi, Wakad, and more."
            />
            <PortalNavbar />

            <div className="max-w-7xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8">Pune Real Estate Directory</h1>

                {/* Locations */}
                <section className="mb-12">
                    <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-100">Browse by Location</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {locations.map(loc => (
                            <Link key={loc.id} to={`/search?location=${encodeURIComponent(loc.name)}`} className="text-blue-600 hover:underline">
                                Projects in {loc.name} ({loc.count})
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Projects */}
                <section>
                    <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-100">All Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {projects.map(project => (
                            <Link key={project.id} to={`/project/${project.slug}`} className="block p-4 border border-gray-100 rounded hover:shadow-md transition-shadow">
                                <h3 className="font-bold text-slate-800">{project.title}</h3>
                                <p className="text-sm text-gray-500">{project.location}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
};

export default Directory;
