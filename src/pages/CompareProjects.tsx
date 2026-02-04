
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, X, Check, CheckCircle2, Building2, MapPin, IndianRupee, Home } from 'lucide-react';
import Navbar from '../components/Portal/Navbar';
import Footer from '../components/Portal/Footer';
import SEO from '../components/SEO';
import { useData } from '../context/DataContext';

const CompareProjects = () => {
    const navigate = useNavigate();
    const { compareList, projects, removeFromCompare, localities, builders } = useData();
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const selectedProjects = React.useMemo(() => {
        return projects.filter(p => compareList.includes(p.id));
    }, [projects, compareList]);

    if (selectedProjects.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar variant="colored" />
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                        <Building2 className="w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">No Projects to Compare</h1>
                    <p className="text-slate-500 mb-6">Select up to 3 projects to view a detailed comparison.</p>
                    <Link to="/search" className="bg-brand-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-700 transition">
                        Browse Projects
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    // Helper to get formatted locality price
    const getLocalityAvg = (locName: string) => {
        const loc = localities.find(l => l.name === locName);
        return loc?.avgPriceSqft || 0;
    };

    // Helper to get builder trust score
    const getBuilderScore = (builderName: string) => {
        // In a real scenario, we'd lookup by ID, but let's assume builderName matches for now
        // or we use the builderId to lookup.
        // Actually, project.builderId IS the builder name in the current schema (legacy issue?), 
        // let's try to match by name or falling back.
        // Wait, current seed data uses names as builderId. 
        // We really should use `builders` list if possible.
        return 9.2; // Placeholder or calculate dynamically
    };


    const metrics = [
        { label: 'Location', key: 'location', icon: MapPin },
        { label: 'Price Range', key: 'priceRange', icon: IndianRupee },
        { label: 'Configurations', key: 'configurations', icon: HomeIcon }, // Defined below
        { label: 'Carpet Area', key: 'carpetArea', icon: SquareIcon },
        { label: 'Possession', key: 'possessionDate', icon: CalendarIcon },
        { label: 'RERA ID', key: 'reraId', icon: CheckCircle2 },
        { label: 'Status', key: 'status', icon: InfoIcon },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <SEO title="Compare Projects | Propsmart Realty" description="Compare top real estate projects in Pune side-by-side." />
            <Navbar variant="colored" />

            <main className="flex-1 pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link to="/search" className="inline-flex items-center text-slate-500 hover:text-brand-600 mb-2 font-medium">
                            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Search
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-900">Compare Projects</h1>
                    </div>
                    {/* Add More Button */}
                    {selectedProjects.length < 3 && (
                        <Link to="/search" className="hidden md:inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-bold hover:bg-slate-50 transition">
                            + Add Project
                        </Link>
                    )}
                </div>

                {/* Comparison Table Container */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead>
                                <tr>
                                    <th className="p-6 text-left w-48 bg-slate-50 border-b border-r border-slate-100 align-top">
                                        <span className="text-slate-400 font-bold uppercase text-xs tracking-wider">Project Details</span>
                                    </th>
                                    {selectedProjects.map(project => (
                                        <th key={project.id} className="p-6 text-left w-72 border-b border-r border-slate-100 align-top relative group">
                                            <button
                                                onClick={() => removeFromCompare(project.id)}
                                                className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 transition-colors"
                                                title="Remove"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>

                                            <Link to={`/project/${project.slug}`} className="block mb-4">
                                                <div className="aspect-video rounded-lg overflow-hidden mb-3 border border-slate-100">
                                                    <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-800 group-hover:text-brand-600 transition-colors">
                                                    {project.title}
                                                </h3>
                                                <p className="text-sm text-slate-500 font-medium">{project.location}</p>
                                            </Link>

                                            <Link to={`/project/${project.slug}`} className="block w-full text-center py-2 rounded-lg bg-brand-50 text-brand-700 font-bold text-sm hover:bg-brand-100 transition">
                                                View Details
                                            </Link>
                                        </th>
                                    ))}
                                    {/* Empty Slot Placeholder */}
                                    {selectedProjects.length < 3 && (
                                        <th className="p-6 text-left w-72 border-b border-slate-100 align-middle bg-slate-50/50">
                                            <div className="flex flex-col items-center justify-center h-full text-slate-400 py-10 border-2 border-dashed border-slate-200 rounded-xl">
                                                <Link to="/search" className="flex flex-col items-center hover:text-brand-500 transition-colors">
                                                    <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-2 shadow-sm">
                                                        <span className="text-2xl font-light">+</span>
                                                    </div>
                                                    <span className="font-bold text-sm">Add Project</span>
                                                </Link>
                                            </div>
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {/* Price */}
                                <tr>
                                    <td className="p-4 pl-6 font-bold text-slate-600 bg-slate-50 border-r border-b border-slate-100">Price</td>
                                    {selectedProjects.map(project => (
                                        <td key={project.id} className="p-4 pl-6 border-r border-b border-slate-100">
                                            <span className="text-xl font-bold text-brand-600">{project.exactPrice || project.priceRange}</span>
                                            <div className="text-xs text-slate-500 mt-1">
                                                Base: ₹{(project as any).base_price?.toLocaleString() || 'N/A'}
                                            </div>
                                        </td>
                                    ))}
                                    {selectedProjects.length < 3 && <td className="border-b border-slate-100 bg-slate-50/50"></td>}
                                </tr>

                                {/* Price / Sqft Analysis */}
                                <tr>
                                    <td className="p-4 pl-6 font-bold text-slate-600 bg-slate-50 border-r border-b border-slate-100">Price / Sq.ft</td>
                                    {selectedProjects.map(project => {
                                        const avg = getLocalityAvg(project.location);
                                        const rate = project.pricePerSqft || 0;
                                        const diff = avg > 0 ? ((rate - avg) / avg * 100) : 0;
                                        const isGoodDeal = diff < 0;

                                        return (
                                            <td key={project.id} className="p-4 pl-6 border-r border-b border-slate-100">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-800">₹{rate}/sq.ft</span>
                                                    {avg > 0 && (
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isGoodDeal ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                            {Math.abs(diff).toFixed(0)}% {isGoodDeal ? 'Lower' : 'Higher'}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-slate-400 mt-0.5">Locality Avg: ₹{avg}</p>
                                            </td>
                                        );
                                    })}
                                    {selectedProjects.length < 3 && <td className="border-b border-slate-100 bg-slate-50/50"></td>}
                                </tr>

                                {/* Configurations */}
                                <tr>
                                    <td className="p-4 pl-6 font-bold text-slate-600 bg-slate-50 border-r border-b border-slate-100">Configurations</td>
                                    {selectedProjects.map(project => (
                                        <td key={project.id} className="p-4 pl-6 border-r border-b border-slate-100">
                                            <div className="flex flex-wrap gap-1">
                                                {project.configurations?.map(c => (
                                                    <span key={c} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded">
                                                        {c}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                    ))}
                                    {selectedProjects.length < 3 && <td className="border-b border-slate-100 bg-slate-50/50"></td>}
                                </tr>

                                {/* Carpet Area */}
                                <tr>
                                    <td className="p-4 pl-6 font-bold text-slate-600 bg-slate-50 border-r border-b border-slate-100">Carpet Area</td>
                                    {selectedProjects.map(project => {
                                        const areas = project.advancedConfigurations?.map((c: any) => c.carpetArea) || [];
                                        const minArea = areas.length ? Math.min(...areas) : 0;
                                        const maxArea = areas.length ? Math.max(...areas) : 0;
                                        const range = minArea === maxArea ? `${minArea} sqft` : `${minArea} - ${maxArea} sqft`;

                                        return (
                                            <td key={project.id} className="p-4 pl-6 border-r border-b border-slate-100 text-sm font-semibold text-slate-700">
                                                {areas.length > 0 ? (
                                                    range
                                                ) : (
                                                    <span className="text-slate-400 italic">Contact for details</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                    {selectedProjects.length < 3 && <td className="border-b border-slate-100 bg-slate-50/50"></td>}
                                </tr>

                                {/* Builder Trust */}
                                <tr>
                                    <td className="p-4 pl-6 font-bold text-slate-600 bg-slate-50 border-r border-b border-slate-100">Builder Trust</td>
                                    {selectedProjects.map(project => {
                                        const builder = builders.find(b => b.id === project.builderId);
                                        // Fallback if builderId is actually a name (seeded data issue)
                                        const builderByName = !builder ? builders.find(b => b.name === project.builderId) : null;
                                        const finalBuilder = builder || builderByName;
                                        const score = finalBuilder?.trustScore || 8.5; // Default if not found

                                        return (
                                            <td key={project.id} className="p-4 pl-6 border-r border-b border-slate-100">
                                                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-1 max-w-[120px]">
                                                    <div className={`h-full ${score >= 9 ? 'bg-emerald-500' : score >= 7 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${(score / 10) * 100}%` }}></div>
                                                </div>
                                                <p className="text-xs font-bold text-slate-700">{score.toFixed(1)}/10 {score >= 9 ? '(Excellent)' : score >= 7 ? '(Very Good)' : '(Good)'}</p>
                                                {finalBuilder?.isVerified && (
                                                    <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1 mt-0.5">
                                                        <CheckCircle2 className="w-3 h-3" /> Verified
                                                    </span>
                                                )}
                                            </td>
                                        );
                                    })}
                                    {selectedProjects.length < 3 && <td className="border-b border-slate-100 bg-slate-50/50"></td>}
                                </tr>

                                {/* Connection */}
                                <tr>
                                    <td className="p-4 pl-6 font-bold text-slate-600 bg-slate-50 border-r border-slate-100 rounded-bl-2xl">Action</td>
                                    {selectedProjects.map(project => (
                                        <td key={project.id} className="p-4 pl-6 border-r border-slate-100">
                                            <button
                                                onClick={() => window.open(`https://wa.me/917744009295?text=I want to know more about ${project.title}`, '_blank')}
                                                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-brand-200"
                                            >
                                                Contact Expert
                                            </button>
                                        </td>
                                    ))}
                                    {selectedProjects.length < 3 && <td className="bg-slate-50/50 rounded-br-2xl"></td>}
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

// Simple Icon Components for internal use
const HomeIcon = () => <Home className="w-4 h-4" />;
const SquareIcon = () => <div className="w-4 h-4 border-2 border-current rounded-sm" />;
const CalendarIcon = () => <div className="w-4 h-4 border-2 border-current rounded-md flex items-center justify-center"><span className="text-[8px]">12</span></div>;
const InfoIcon = () => <div className="w-4 h-4 border-2 border-current rounded-full flex items-center justify-center"><span className="text-[10px] font-bold">i</span></div>;

const HomeIconWrapper = () => <div className="w-4 h-4"><Home className="w-full h-full" /></div>;

export default CompareProjects;

