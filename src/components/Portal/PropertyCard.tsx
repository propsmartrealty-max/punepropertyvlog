import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Home, CheckCircle2, Building2 } from 'lucide-react';
import { Project } from '../../types';
import { useData } from '../../context/DataContext';
import DealBadge from './DealBadge';
import LeadForm from './LeadForm';

interface PropertyCardProps {
    project: Project;
    variant?: 'grid' | 'list';
}

const PropertyCard: React.FC<PropertyCardProps> = ({ project, variant = 'list' }) => {
    if (!project) return null;

    const isGrid = variant === 'grid';
    // Phase 3: Deal Calculation
    // We assume PropertyCard is wrapped in DataProvider. If not (e.g. some isolated test), this might fail or we should optional chain.
    let localityAvgPrice = 0;

    // Hooks
    const { localities, compareList, addToCompare, removeFromCompare } = useData();
    const isInCompare = compareList?.includes(project.id);

    try {
        const loc = localities.find(l => l.name === project.location);
        localityAvgPrice = loc?.avgPriceSqft || 0;
    } catch (e) {
        // Fallback if useData is not available
    }
    // Use first image or fallback
    const displayImage = project.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800';

    const [showLeadForm, setShowLeadForm] = useState(false);

    return (
        <div className={`group bg-white rounded-[1.5rem] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-2xl hover:shadow-brand-900/10 transition-all duration-500 border border-slate-100 flex ${isGrid ? 'flex-col h-full' : 'flex-col md:flex-row h-auto md:h-[260px]'}`}>

            {/* Image Section */}
            <div className={`relative overflow-hidden shrink-0 ${isGrid ? 'h-52 w-full' : 'h-52 md:h-full md:w-[40%]'} bg-slate-100`}>
                <Link to={`/project/${project.slug}`} className="block h-full w-full">
                    <img
                        src={displayImage}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800';
                        }}
                    />
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 md:bg-none transition-opacity duration-300 ${isGrid ? 'bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90' : 'bg-gradient-to-t from-black/80 md:from-transparent opacity-80'}`} />
                </Link>

                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10 max-w-[85%]">
                    {project.status && (
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider backdrop-blur-md border ${project.status === 'New Launch'
                            ? 'bg-accent-500 text-white border-accent-400'
                            : 'bg-white/95 text-brand-900 border-white/20'
                            }`}>
                            {project.status}
                        </span>
                    )}
                    {project.reraId && (
                        <span className="bg-emerald-500/90 backdrop-blur-md text-[10px] font-bold px-2 py-1 rounded-full shadow-sm text-white uppercase tracking-wider flex items-center gap-1 border border-emerald-400">
                            <CheckCircle2 className="w-3 h-3" /> <span className="hidden sm:inline">RERA</span>
                        </span>
                    )}
                    <DealBadge
                        pricePerSqft={project.pricePerSqft || 0}
                        localityAvg={localityAvgPrice}
                        className="shadow-sm backdrop-blur-md"
                    />
                </div>

                {/* Compare Checkbox */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (isInCompare) {
                            removeFromCompare(project.id);
                        } else {
                            addToCompare(project.id);
                        }
                    }}
                    className={`absolute top-3 right-3 z-20 px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md border transition-all flex items-center gap-1.5 ${isInCompare
                        ? 'bg-brand-600 text-white border-brand-500 hover:bg-brand-700'
                        : 'bg-white/90 text-slate-600 border-white/40 hover:bg-white hover:text-brand-600'
                        }`}
                >
                    {isInCompare ? (
                        <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> <span>Added</span>
                        </>
                    ) : (
                        <>
                            <Building2 className="w-3.5 h-3.5" /> <span>Compare</span>
                        </>
                    )}
                </button>


                {/* Mobile/Grid Price Overlay */}
                <div className={`absolute bottom-3 left-3 text-white z-10 ${isGrid ? 'block' : 'md:hidden'}`}>
                    <p className="text-xl font-extrabold tracking-tight">{project.exactPrice || project.priceRange}</p>
                    {isGrid && <p className="text-[10px] text-gray-300 uppercase tracking-widest font-bold">Starting Price</p>}
                </div>
            </div>

            {/* Content Section */}
            <div className={`flex-1 flex flex-col justify-between relative ${isGrid ? 'p-4' : 'md:p-6 p-4'}`}>

                {/* Decoration: Subtle background builder logo or pattern could go here */}

                <div>
                    <Link to={`/project/${project.slug}`} className="block group/title">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 min-w-0 pr-2">
                                <h3 className={`font-bold text-slate-800 leading-snug group-hover/title:text-brand-600 transition-colors mb-1 truncate ${isGrid ? 'text-lg' : 'text-lg md:text-2xl'}`}>
                                    {project.title}
                                </h3>
                                <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                                    <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                                    <span className="truncate text-xs md:text-sm">{project.location}</span>
                                </div>
                            </div>

                            {/* Desktop Price (List View) */}
                            {!isGrid && (
                                <div className="hidden md:block text-right shrink-0">
                                    <p className="text-2xl font-bold text-brand-600">{project.exactPrice || project.priceRange}</p>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Starting From</p>
                                </div>
                            )}
                        </div>
                    </Link>

                    {/* Configurations / Details */}
                    <div className="mt-3 md:mt-4 flex flex-wrap gap-2">
                        {(project.configurations || []).slice(0, isGrid ? 2 : 4).map((conf, i) => (
                            <span key={i} className="inline-flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-slate-50 border border-slate-200/60 text-[10px] md:text-xs font-bold text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-700 group-hover:border-brand-100 transition-colors">
                                <Home className="w-3 h-3 text-slate-400 group-hover:text-brand-400" /> {conf}
                            </span>
                        ))}
                    </div>

                    {!isGrid && (
                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-600 border-t border-slate-100 pt-3">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                <span className="text-slate-400 text-xs uppercase font-bold">Possession:</span>
                                <span className="font-semibold text-slate-700 text-xs md:text-sm">{project.possessionDate || 'Soon'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                <span className="text-slate-400 text-xs uppercase font-bold">Builder:</span>
                                <span className="font-semibold text-slate-700 truncate text-xs md:text-sm">{project.builderId || 'Premium Developer'}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions Footer */}
                <div className={`mt-4 md:mt-5 pt-0 flex gap-2 md:gap-3 ${isGrid ? 'flex-col' : 'justify-end items-center'}`}>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setShowLeadForm(true);
                        }}
                        className={`flex-1 px-3 md:px-4 py-2 md:py-2.5 rounded-xl border border-brand-200 text-brand-600 font-bold text-xs md:text-sm hover:bg-brand-50 hover:border-brand-300 transition-all uppercase tracking-wide text-center shadow-sm hover:shadow-md ${isGrid ? 'w-full' : 'max-w-[140px]'}`}
                    >
                        Contact
                    </button>
                    <Link
                        to={`/project/${project.slug}`}
                        className={`flex-1 px-3 md:px-4 py-2 md:py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs md:text-sm hover:bg-brand-700 transition-all uppercase tracking-wide text-center shadow-lg shadow-brand-200 hover:shadow-brand-300 hover:-translate-y-0.5 ${isGrid ? 'w-full' : 'max-w-[140px]'}`}
                    >
                        Details
                    </Link>
                </div>
            </div>

            <LeadForm
                isOpen={showLeadForm}
                onClose={() => setShowLeadForm(false)}
                type="Site Visit"
                projectTitle={project.title}
                projectId={project.id}
            />
        </div>
    );
};

export default PropertyCard;
