
import React, { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import PortalNavbar from '../components/Portal/Navbar';
import Footer from '../components/Portal/Footer';
import SEO from '../components/SEO';
import { Filter } from 'lucide-react';
import PropertyCard from '../components/Portal/PropertyCard';
import { PropertyCardSkeleton, ErrorState } from '../components/UI/LoadingSkeleton';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import PriceTrendChart from '../components/Portal/MarketIntelligence/PriceTrendChart';


const SearchResults = () => {
    const { search } = useLocation();
    const { locationSlug } = useParams<{ locationSlug: string }>();
    const queryParams = new URLSearchParams(search);

    // Parse location from slug (e.g. 'baner-annex' -> 'Baner Annex') or param
    const derivedLocation = locationSlug
        ? locationSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        : (queryParams.get('location') || '');

    const filterLoc = derivedLocation;
    const filterType = queryParams.get('type') || '';

    // Phase 5: Get Locality Data for Market Intelligence
    const { localities } = useData();
    const currentLocality = localities.find(l => l.name === filterLoc);

    // Page state (we can add pagination UI later, currently just page 1 or load more)
    const [page, setPage] = React.useState(1);

    // Local State for filters (synced with URL initially if complex, but here we treat side filters as additional client-side or server-side params)
    // To keep it robust, let's treat selectedBudgets/Types as server filters.
    // However, API might need array support. Our simple API supports single strings. 
    // Let's simple it: If we check a box, we refetch.

    // Local State for filters
    const [selectedBudgets, setSelectedBudgets] = React.useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = React.useState<string[]>([]); // "Apartment", "Villa", "Office"
    const [selectedConfigs, setSelectedConfigs] = React.useState<string[]>([]); // "1 BHK", "2 BHK"
    const [showFilters, setShowFilters] = React.useState(false);
    const [viewMode, setViewMode] = React.useState<'list' | 'map'>('list');

    // Lazy load map
    const ProjectMap = React.useMemo(() => React.lazy(() => import('../components/Map/ProjectMap')), []);

    // Sync URL type to selectedTypes on mount
    React.useEffect(() => {
        if (filterType && !selectedTypes.includes(filterType)) {
            // Logic to map URL type to state can be added here if needed
        }
    }, [filterType]);

    // Calculate derived filters
    const typeFilter = selectedTypes.length > 0
        ? selectedTypes.join(',')
        : filterType === 'commercial' ? 'Commercial'
            : filterType === 'plots' ? 'Plot'
                : (filterType === 'buy' || filterType === 'rent') ? 'Residential'
                    : '';

    const statusFilter = filterType === 'new-launch' ? 'New Launch' : '';


    // React Query for Server-Side Search
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['projects', 'search', page, filterLoc, typeFilter, statusFilter, selectedBudgets.join(','), selectedConfigs.join(',')],
        queryFn: () => api.projects.list(page, {
            location: filterLoc,
            type: typeFilter,
            status: statusFilter,
            // Passing budget and configs
            budget: selectedBudgets,
            configurations: selectedConfigs
        }),
        placeholderData: (previousData) => previousData,
    });

    const projects = data?.data || [];
    const totalPages = data?.totalPages || 0;

    const toggleFilter = (item: string, current: string[], setter: (val: string[]) => void) => {
        if (current.includes(item)) {
            setter(current.filter(i => i !== item));
        } else {
            setter([...current, item]);
        }
        setPage(1); // Reset to page 1 on filter change
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <PortalNavbar />
                <div className="flex-1 flex items-center justify-center p-4">
                    <ErrorState message={(error as Error).message} onRetry={() => refetch()} />
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <SEO
                title={locationSlug ? `Flats in ${filterLoc} Pune | New Projects & Prices` : `Properties in ${filterLoc || 'Pune'} - Search Results`}
                description={locationSlug
                    ? `Looking for flats in ${filterLoc}? Explore top verified new launch projects, pricing, and floor plans in ${filterLoc}, Pune.`
                    : "Browse verified real estate listings in Pune."}
                canonical={locationSlug ? `https://punepropertyvlog.in/flats-in-${locationSlug}` : undefined}
            />
            <PortalNavbar variant="colored" />

            <div className="max-w-7xl mx-auto px-4 pt-28 pb-12 flex-1 w-full">
                {/* View Toggles & Filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <button
                        className="md:hidden w-full flex items-center justify-center gap-2 bg-white p-3 rounded-lg shadow-sm font-semibold text-slate-700 border border-slate-200"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="w-5 h-5" /> {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>

                    <div className="hidden md:flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm ml-auto">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            List View
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'map' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            Map View
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className={`w-full md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                            <div className="flex items-center gap-2 mb-6 text-slate-800">
                                <Filter className="w-5 h-5" />
                                <h3 className="font-bold text-lg">Filters</h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-3">Configuration</label>
                                    <div className="space-y-2">
                                        {['1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Row House'].map(c => (
                                            <label key={c} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-blue-600 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 border-gray-300"
                                                    checked={selectedConfigs.includes(c)}
                                                    onChange={() => toggleFilter(c, selectedConfigs, setSelectedConfigs)}
                                                />
                                                {c}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 my-4"></div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-3">Budget</label>
                                    <div className="space-y-2">
                                        {['50L', '1Cr', '1.5Cr', '2Cr+'].map(b => (
                                            <label key={b} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-blue-600 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 border-gray-300"
                                                    checked={selectedBudgets.includes(b)}
                                                    onChange={() => toggleFilter(b, selectedBudgets, setSelectedBudgets)}
                                                />
                                                {b === '50L' ? 'Under 50 Lacs' :
                                                    b === '1Cr' ? '50L - 1 Cr' :
                                                        b === '1.5Cr' ? '1 Cr - 1.5 Cr' : 'Above 2 Cr'}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 my-4"></div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-3">Asset Type</label>
                                    <div className="space-y-2">
                                        {['Apartment', 'Villa', 'Plot', 'Office'].map(t => (
                                            <label key={t} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-blue-600 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 border-gray-300"
                                                    checked={selectedTypes.includes(t)}
                                                    onChange={() => toggleFilter(t, selectedTypes, setSelectedTypes)}
                                                />
                                                {t}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Phase 5: Market Intelligence Chart (Sidebar) */}
                        {currentLocality && currentLocality.avgPriceSqft ? (
                            <div className="mt-6">
                                <PriceTrendChart
                                    locationName={currentLocality.name}
                                    currentPrice={currentLocality.avgPriceSqft}
                                    appreciationRate={currentLocality.appreciation_rate}
                                />
                            </div>
                        ) : null}

                    </aside>

                    {/* Results Grid */}
                    <div className="flex-1">
                        <div className="mb-6 flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-slate-900">
                                {isLoading ? 'Searching...' : `${data?.count || 0} Properties found ${filterLoc ? `in ${filterLoc}` : ''}`}
                            </h1>
                        </div>

                        {viewMode === 'map' ? (
                            <div className="w-full h-full min-h-[500px]">
                                <React.Suspense fallback={<div className="h-96 bg-slate-100 rounded-2xl animate-pulse"></div>}>
                                    <ProjectMap projects={projects} />
                                </React.Suspense>
                            </div>
                        ) : (
                            isLoading ? (
                                <div className="grid grid-cols-1 gap-6">
                                    {Array(3).fill(0).map((_, i) => (
                                        <div key={i} className="h-full">
                                            <PropertyCardSkeleton />
                                        </div>
                                    ))}
                                </div>
                            ) : projects.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 gap-6">
                                        {projects.map(project => (
                                            <div key={project.id} className="h-full">
                                                <PropertyCard project={project} />
                                            </div>
                                        ))}
                                    </div>
                                    {/* Simple Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-center gap-2 mt-8">
                                            <button
                                                disabled={page === 1}
                                                onClick={() => {
                                                    setPage(p => Math.max(1, p - 1));
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50"
                                            >
                                                Previous
                                            </button>
                                            <span className="px-4 py-2">Page {page} of {totalPages}</span>
                                            <button
                                                disabled={page === totalPages}
                                                onClick={() => {
                                                    setPage(p => p + 1);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-sm">
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">No properties found</h3>
                                    <p className="text-slate-500">Try adjusting your filters or search criteria.</p>
                                    <button
                                        onClick={() => {
                                            setSelectedBudgets([]);
                                            setSelectedTypes([]);
                                        }}
                                        className="mt-4 text-blue-600 font-semibold hover:underline"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div >
            <Footer />
        </div >
    );
};


export default SearchResults;
