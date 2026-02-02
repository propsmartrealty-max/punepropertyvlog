import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project } from '../../../types';

interface SpotlightSectionProps {
    projects: Project[];
}

const SpotlightSection: React.FC<SpotlightSectionProps> = ({ projects }) => {
    if (!projects.length) return null;

    // Pick top 3 premium projects (randomized or filtered)
    const spotlightProjects = projects.filter(p => p.priceRange.includes('Cr')).slice(0, 3);

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Star className="w-5 h-5 text-accent-500 fill-accent-500" />
                            <h6 className="text-xs font-bold tracking-widest text-slate-500 uppercase">In Spotlight</h6>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">Featured Collections</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {spotlightProjects.map((project, index) => (
                        <Link to={`/project/${project.slug}`} key={project.id} className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-lg cursor-pointer">
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                onError={(e) => {
                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                                <span className="text-xs font-bold text-white">Featured</span>
                            </div>

                            <div className="absolute bottom-0 left-0 p-6 w-full text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-2xl font-bold mb-1">{project.title}</h3>
                                <p className="text-white/80 text-sm mb-3">{project.location}</p>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-lg text-accent-400">{project.priceRange}</span>
                                    <div className="flex-1" />
                                    <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SpotlightSection;
