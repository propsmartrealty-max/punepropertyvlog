import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PropertyCard from '../PropertyCard';
import { Project } from '../../../types';

interface ProjectRailProps {
    title: string;
    subtitle?: string;
    projects: Project[];
    viewAllLink?: string;
    bgColor?: string;
}

const ProjectRail: React.FC<ProjectRailProps> = ({ title, subtitle, projects, viewAllLink = '/search', bgColor = 'bg-white' }) => {
    return (
        <section className={`py-12 ${bgColor}`}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
                        {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
                    </div>
                    <Link to={viewAllLink} className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                        See All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="flex gap-6 overflow-x-auto no-scrollbar pb-6 snap-x">
                    {projects.map((project) => (
                        <div key={project.id} className="min-w-[320px] md:min-w-[350px] snap-center">
                            <PropertyCard project={project} variant="grid" />
                        </div>
                    ))}

                    {/* View More Card */}
                    <div className="min-w-[150px] flex items-center justify-center">
                        <Link to={viewAllLink} className="flex flex-col items-center gap-2 group">
                            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-md">
                                <ArrowRight className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600">View All</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectRail;
