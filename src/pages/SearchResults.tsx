
import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import PortalNavbar from '../components/Portal/Navbar';
import Footer from '../components/Portal/Footer';
import SEO from '../components/SEO';
import { Filter } from 'lucide-react';
import PropertyCard from '../components/Portal/PropertyCard';
import { PropertyCardSkeleton, ErrorState } from '../components/UI/LoadingSkeleton';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';


const SearchResults = () => {
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const filterLoc = queryParams.get('location') || '';
    const filterType = queryParams.get('type') || '';

    // Page state (we can add pagination UI later, currently just page 1 or load more)
    const [page, setPage] = React.useState(1);

    // Local State for filters (synced with URL initially if complex, but here we treat side filters as additional client-side or server-side params)
    // To keep it robust, let's treat selectedBudgets/Types as server filters.
    // However, API might need array support. Our simple API supports single strings. 
    // Let's simple it: If we check a box, we refetch.

    const [selectedBudgets, setSelectedBudgets] = React.useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = React.useState<string[]>([]); // "Apartment", "Villa", "Office"
    const [showFilters, setShowFilters] = React.useState(false);

    // Sync URL type to selectedTypes on mount
    React.useEffect(() => {
        if (filterType && !selectedTypes.includes(filterType)) {
            // Map "buy", "rent" etc if needed. 
            // If "type=commercial", we select "Commercial" or specific types?
            // The user request was "commercial properties should be under commercial section".
            // Currently type is used for Status (New Launch) in the old code?
            // "filterType === 'new-launch'". 
            // But we also have "Asset Type" = Apartment, Villa, Office.
            // Let's try to Map URL params to our server filters.
        }
    }, [filterType]);

    // Instead of complex syncing, let's construct the API filter object.

    // Calculate derived filters
    const typeFilter = selectedTypes.length > 0
        ? selectedTypes.join(',') // API needs to handle this, currently simple ilike
        : filterType === 'commercial' ? 'Commercial' // If URL is /search?type=commercial
            : filterType === 'new-launch' ? '' // 'new-launch' is a status, not type
                : '';

    const statusFilter = filterType === 'new-launch' ? 'New Launch' : '';


    // React Query for Server-Side Search
    // We use a key that includes all filter dependencies so it refetches automatically.

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['projects', 'search', page, filterLoc, typeFilter, statusFilter, selectedBudgets.join(',')],
        queryFn: () => api.projects.list(page, {
            location: filterLoc,
            type: typeFilter, // Passing "Apartment,Villa" or "Commercial"
            status: statusFilter
        }),
        placeholderData: (previousData) => previousData, // Keep previous data while fetching new
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
                title={`Properties in ${filterLoc || 'Pune'} - Search Results`}
                description="Browse verified real estate listings in Pune."
            />
            <PortalNavbar />

            <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
                {/* Mobile Filter Toggle */}
                <button
                    className="md:hidden w-full mb-4 flex items-center justify-center gap-2 bg-white p-3 rounded-lg shadow-sm font-semibold text-slate-700"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <Filter className="w-5 h-5" /> {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>

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
                    </aside>

                    {/* Results Grid */}
                    <div className="flex-1">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-slate-900">
                                {isLoading ? 'Searching Properties...' : `${data?.count || 0} Properties found ${filterLoc ? `in ${filterLoc}` : ''}`}
                            </h1>
                            {selectedBudgets.length > 0 && (
                                <p className="text-sm text-slate-500 mt-1">
                                    Filters: {selectedBudgets.join(', ')} {selectedTypes.length > 0 && `| ${selectedTypes.join(', ')}`}
                                </p>
                            )}
                        </div>

                        {isLoading ? (
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
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        <span className="px-4 py-2">Page {page} of {totalPages}</span>
                                        <button
                                            disabled={page === totalPages}
                                            onClick={() => setPage(p => p + 1)}
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
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};


export default SearchResults;
