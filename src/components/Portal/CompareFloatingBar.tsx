
import React from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useData } from '../../context/DataContext';

const CompareFloatingBar: React.FC = () => {
    const { compareList, removeFromCompare, clearCompare, projects } = useData();
    const [isExpanded, setIsExpanded] = React.useState(true);

    if (compareList.length === 0) return null;

    const selectedProjects = projects.filter(p => compareList.includes(p.id));

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 flex justify-center pointer-events-none">
            <div className="bg-white rounded-2xl shadow-[0_-5px_20px_rgba(0,0,0,0.15)] border border-slate-200 w-full max-w-3xl pointer-events-auto overflow-hidden animate-in slide-in-from-bottom duration-300">

                {/* Header / Toggle */}
                <div
                    className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">Compare Projects</span>
                        <span className="bg-brand-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {compareList.length}/3
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </div>
                </div>

                {/* Content */}
                {isExpanded && (
                    <div className="p-3 md:p-4 flex flex-col md:flex-row items-center gap-4">
                        <div className="flex-1 flex gap-3 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-hide">
                            {selectedProjects.map(project => (
                                <div key={project.id} className="relative group shrink-0 w-20 md:w-24">
                                    <button
                                        onClick={() => removeFromCompare(project.id)}
                                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                    <div className="w-full aspect-square rounded-lg overflow-hidden border border-slate-200">
                                        <img
                                            src={project.image || 'https://via.placeholder.com/150'}
                                            alt={project.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <p className="text-[10px] font-semibold text-slate-700 mt-1 truncate">
                                        {project.title}
                                    </p>
                                </div>
                            ))}
                            {[...Array(3 - selectedProjects.length)].map((_, i) => (
                                <div key={`empty-${i}`} className="shrink-0 w-20 md:w-24 aspect-square rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50">
                                    <span className="text-[10px] text-slate-400 font-medium">Add Project</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                            <button
                                onClick={clearCompare}
                                className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-red-500 transition-colors"
                            >
                                Clear
                            </button>
                            <Link
                                to="/compare"
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-brand-200 transition-all ${compareList.length >= 2
                                        ? 'bg-brand-600 text-white hover:bg-brand-700 hover:-translate-y-0.5'
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    }`}
                                onClick={(e) => {
                                    if (compareList.length < 2) e.preventDefault();
                                }}
                            >
                                Compare Now <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompareFloatingBar;
