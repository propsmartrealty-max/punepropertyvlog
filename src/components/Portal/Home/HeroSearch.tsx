import React, { useState, useEffect } from 'react';
import { Search, MapPin, ChevronDown, Rocket, Key, Home, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { supabase } from '../../../services/supabase';

// Default Fallback Images
const DEFAULT_IMAGES = [
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1628624747186-a941947771b9?q=80&w=2670&auto=format&fit=crop"
];

const TABS = [
    { id: 'buy', label: 'Buy', icon: <Home className="w-4 h-4" /> },
    { id: 'rent', label: 'Rent', icon: <Key className="w-4 h-4" /> },
    { id: 'projects', label: 'New Projects', icon: <Rocket className="w-4 h-4" /> },
    { id: 'commercial', label: 'Commercial', icon: <Building className="w-4 h-4" /> },
];

const HeroSearch = () => {
    const navigate = useNavigate();
    const [heroImages, setHeroImages] = useState<string[]>(DEFAULT_IMAGES);
    const [currentImage, setCurrentImage] = useState(0);
    const [activeTab, setActiveTab] = useState('buy');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Fetch Banners from Supabase
    useEffect(() => {
        const fetchBanners = async () => {
            const { data } = await supabase
                .from('banners')
                .select('imageUrl')
                .eq('isActive', true)
                .order('sortOrder', { ascending: true });

            if (data && data.length > 0) {
                setHeroImages(data.map(b => b.imageUrl));
            }
        };
        fetchBanners();
    }, []);

    // Auto-rotate background
    useEffect(() => {
        if (heroImages.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % heroImages.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [heroImages.length]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=${activeTab}`);
        }
    };

    return (
        <div className="relative h-[650px] w-full flex flex-col items-center justify-center text-white overflow-hidden bg-brand-950">

            {/* Background Slider with Parallax-like feel */}
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentImage}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${heroImages[currentImage]})` }}
                />
            </AnimatePresence>

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-900/60 to-transparent" />
            <div className="absolute inset-0 bg-black/20" /> {/* Dimmer */}

            {/* Content */}
            <div className="relative z-10 w-full max-w-5xl px-4 flex flex-col items-center mt-8">

                {/* Badge */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-sm font-semibold text-brand-200 mb-6 flex items-center gap-2 shadow-lg"
                >
                    <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse"></span>
                    #1 Verified Real Estate Platform in Pune
                </motion.div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-4xl md:text-6xl font-extrabold text-center mb-4 drop-shadow-2xl leading-tight"
                >
                    Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-200 via-white to-brand-200">Dream Universe</span>
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg md:text-xl text-center text-brand-50/90 mb-10 font-medium max-w-2xl mx-auto leading-relaxed"
                >
                    Explore Pune's most exclusive properties. From luxury villas to premium apartments, find a home that matches your ambition.
                </motion.p>

                {/* Search Box Container */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden border border-white/40 p-1.5"
                >
                    <div className="bg-white rounded-[1.8rem] overflow-hidden shadow-inner">
                        {/* Tabs */}
                        <div className="flex bg-slate-50/50 border-b border-gray-100 overflow-x-auto no-scrollbar pt-1 px-1">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all relative whitespace-nowrap rounded-t-xl ${activeTab === tab.id
                                        ? 'text-brand-600 bg-white shadow-[0_-5px_10px_rgba(0,0,0,0.02)] z-10'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
                                        }`}
                                >
                                    <div className={`p-1 rounded-full ${activeTab === tab.id ? 'bg-brand-100' : 'bg-transparent'}`}>
                                        {tab.icon}
                                    </div>
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-brand-500 to-brand-300 rounded-t-full" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Search Input Area */}
                        <form onSubmit={handleSearch} className="p-4 md:p-5 flex flex-col md:flex-row gap-4 items-center bg-white relative">

                            {/* Location Dropdown */}
                            <div className="w-full md:w-[28%] relative border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-4 group">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block group-hover:text-brand-500 transition-colors">City</label>
                                <button type="button" className="flex justify-between items-center w-full text-slate-800 font-bold text-lg hover:text-brand-600 transition-colors">
                                    Pune <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-brand-500 transition-colors" />
                                </button>
                            </div>

                            {/* Text Input */}
                            <div className="flex-1 w-full relative group">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block group-hover:text-brand-500 transition-colors">Search Location, Project or Builder</label>
                                <input
                                    type="text"
                                    placeholder={`Try "3 BHK in Baner" or "VTP Realty"`}
                                    className="w-full text-slate-800 text-lg font-semibold placeholder:text-gray-300 outline-none bg-transparent"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setShowSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                />

                                {/* Smart Suggestions Dropdown */}
                                {showSuggestions && (
                                    <div className="absolute top-[calc(100%+20px)] left-[-20px] right-[-20px] bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-gray-100 p-3 z-50">
                                        <h4 className="text-xs font-bold text-gray-400 px-3 py-1 uppercase">Trending Localities</h4>
                                        <div className="grid grid-cols-2 gap-2 mt-1">
                                            {['Baner', 'Wakad', 'Hinjewadi', 'Kharadi', 'Viman Nagar', 'Balewadi'].map(loc => (
                                                <div
                                                    key={loc}
                                                    className="px-3 py-2 hover:bg-brand-50 hover:text-brand-700 rounded-lg cursor-pointer flex items-center gap-2 text-slate-600 font-medium text-sm transition-colors"
                                                    onClick={() => setSearchQuery(loc)}
                                                >
                                                    <span className="bg-slate-100 p-1 rounded text-slate-400"><MapPin className="w-3 h-3" /></span>
                                                    {loc}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Search Button */}
                            <button
                                type="submit"
                                className="w-full md:w-auto bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-bold py-4 px-10 rounded-[1.2rem] shadow-xl shadow-brand-500/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-md"
                            >
                                <Search className="w-5 h-5" />
                                Search
                            </button>
                        </form>
                    </div>
                </motion.div>

                {/* Quick Tags */}
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <span className="text-white/70 text-sm font-semibold flex items-center gap-2 bg-brand-950/30 px-3 py-1 rounded-full backdrop-blur-sm">
                        <Rocket className="w-3 h-3 text-accent-400" /> Trending:
                    </span>
                    {['2 BHK Baner', 'Luxury Villas', 'Pre-launch Offers', 'Godrej Properties'].map((tag, i) => (
                        <button
                            key={i}
                            className="bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md transition-all hover:-translate-y-0.5 shadow-sm"
                            onClick={() => {
                                setSearchQuery(tag);
                                navigate(`/search?q=${encodeURIComponent(tag)}`);
                            }}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default HeroSearch;
