import React, { useState } from 'react';
import { Search, MapPin, Building2, TrendingUp, Home, Key, Percent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- CONFIGURATION ---
// Change this URL to update the home page background image
const BANNER_IMAGE = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop";

const SearchBanner = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'buy' | 'rent'>('buy');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="relative h-[650px] w-full flex items-center justify-center overflow-hidden bg-slate-900">
            {/* Dynamic Background with Mesh Gradient and Image Blend */}
            <div className="absolute inset-0 bg-mesh opacity-20 animate-pulse" style={{ animationDuration: '10s' }} />
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-overlay opacity-60"
                style={{
                    backgroundImage: `url("${BANNER_IMAGE}")`,
                }}
            />

            {/* Floating 3D Elements for Depth */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[15%] left-[10%] animate-float opacity-30">
                    <Home className="w-16 h-16 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
                </div>
                <div className="absolute bottom-[20%] right-[10%] animate-float opacity-30" style={{ animationDelay: '2s' }}>
                    <Key className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                </div>
                <div className="absolute top-[20%] right-[15%] animate-float opacity-20" style={{ animationDelay: '1s' }}>
                    <Percent className="w-10 h-10 text-purple-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.5)]" />
                </div>
            </div>

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-slate-900/60" />

            <div className="relative z-20 w-full max-w-5xl px-4 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "outCirc" }}
                    className="text-center"
                >
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-blue-200 text-sm font-semibold mb-6 shadow-lg">
                        ✨ #1 Real Estate Platform in Pune
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
                        Discover Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-emerald-200 to-cyan-300 text-glow">
                            Dream Universe
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-200 mb-12 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
                        Explore Pune's most exclusive properties. From luxury villas to premium apartments, find a home that matches your ambition.
                    </p>
                </motion.div>

                {/* Glassmorphism Search Box */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
                    className="w-full max-w-4xl"
                >
                    <div className="bg-white/10 backdrop-blur-xl p-3 rounded-[2.5rem] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                        {/* Tabs */}
                        <div className="flex gap-2 mb-3 px-2">
                            {['buy', 'rent'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 transform ${activeTab === tab
                                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Search Input Area */}
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 p-2 bg-white rounded-[2rem] shadow-2xl items-center">

                            {/* Location Input */}
                            <div className="flex-1 flex items-center px-6 py-4 gap-4 w-full md:border-r border-gray-100 relative group">
                                <div className="bg-blue-50 p-2 rounded-full text-blue-500 group-focus-within:bg-blue-100 transition-colors">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col items-start w-full">
                                    <label className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Location</label>
                                    <input
                                        type="text"
                                        placeholder="Search Baner, Wakad..."
                                        className="w-full bg-transparent outline-none text-slate-800 text-lg font-bold placeholder:text-slate-300 placeholder:font-semibold"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Property Type Dropdown */}
                            <div className="flex-1 flex items-center px-6 py-4 gap-4 w-full relative group">
                                <div className="bg-emerald-50 p-2 rounded-full text-emerald-500 group-focus-within:bg-emerald-100 transition-colors">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col items-start w-full">
                                    <label className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Property Type</label>
                                    <select className="w-full bg-transparent outline-none text-slate-800 text-lg font-bold cursor-pointer appearance-none">
                                        <option>Apartment</option>
                                        <option>Villa</option>
                                        <option>Plot</option>
                                        <option>Commercial</option>
                                    </select>
                                </div>
                            </div>

                            {/* Search Button */}
                            <button type="submit" className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-[1.5rem] px-10 py-5 font-bold transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95">
                                <Search className="w-5 h-5" />
                                <span className="md:hidden">Search Properties</span>
                            </button>
                        </form>
                    </div>

                    {/* Trending Tags */}
                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                        <span className="text-white/80 text-sm font-semibold flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                            <TrendingUp className="w-4 h-4 text-emerald-300" /> Trending:
                        </span>
                        {['2 BHK in Baner', 'Row House in Wakad', 'Luxury in Kharadi', 'Pre-launch Offers'].map((tag, i) => (
                            <button
                                key={i}
                                onClick={() => navigate(`/search?q=${encodeURIComponent(tag)}`)}
                                className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-xs font-medium text-white transition-all backdrop-blur-sm hover:-translate-y-0.5"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-50/90 to-transparent z-10 pointer-events-none" />
        </div>
    );
};

export default SearchBanner;
