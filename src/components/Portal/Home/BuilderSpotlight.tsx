import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Award } from 'lucide-react';
import { Builder } from '../../../types';

interface BuilderSpotlightProps {
    builders: Builder[];
}

const BuilderSpotlight: React.FC<BuilderSpotlightProps> = ({ builders }) => {
    // Track errored images by builder ID
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
        <section className="py-20 bg-dark-DEFAULT text-white relative overflow-hidden">

            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-900/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-accent-400 font-bold tracking-widest text-xs uppercase mb-4 backdrop-blur-sm">
                        <Award className="w-3 h-3" /> Trusted Partners
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                        Pune's <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-100 to-white">Elite Developers</span>
                    </h2>
                    <p className="text-slate-400 text-lg">We partner exclusively with RERA-registered builders with a track record of excellence and timely delivery.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {builders.slice(0, 11).map((builder) => {
                        const showFallback = !builder.logo || erroredImages[builder.id];

                        return (
                            <Link to={`/builder/${builder.slug}`} key={builder.id} className="group relative bg-dark-card border border-white/5 rounded-2xl p-6 flex flex-col items-center gap-4 hover:bg-white/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-900/30">

                                {/* Logo Container */}
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center p-3 shadow-lg group-hover:scale-110 transition-transform duration-500 relative overflow-hidden">
                                    {showFallback ? (
                                        <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center">
                                            <span className="text-xl font-bold text-slate-400">{getInitials(builder.name)}</span>
                                        </div>
                                    ) : (
                                        <img
                                            src={builder.logo}
                                            alt={builder.name}
                                            onError={() => handleImageError(builder.id)}
                                            className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                                        />
                                    )}

                                    {/* Verified Checkmark */}
                                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full border-2 border-dark-card group-hover:scale-110 transition-transform">
                                        <CheckCircle2 className="w-3 h-3" />
                                    </div>
                                </div>

                                <div className="text-center">
                                    <h4 className="font-bold text-base md:text-lg mb-1 group-hover:text-white text-slate-200 transition-colors">{builder.name}</h4>
                                </div>
                            </Link>
                        );
                    })}

                    {/* View All Card */}
                    <Link to="/directory" className="group bg-gradient-to-br from-brand-900/50 to-dark-card border border-brand-500/20 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-brand-900/80 transition-all duration-300 hover:-translate-y-2">
                        <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition-all">
                            <span className="text-2xl font-bold">+</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-xl font-bold text-brand-200 group-hover:text-white mb-1">View All</span>
                            <span className="text-xs text-brand-400/70 font-bold uppercase tracking-wider">50+ Developers</span>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BuilderSpotlight;
