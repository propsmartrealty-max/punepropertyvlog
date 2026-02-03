import React, { useRef, useState, useEffect } from 'react';
import { supabase } from '../../../services/supabase';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const DEFAULT_LOCALITIES = [
    { name: 'Baner', image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=500', price: '₹9.5k/sq.ft', count: 45 },
    { name: 'Wakad', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500', price: '₹7.2k/sq.ft', count: 32 },
    { name: 'Hinjewadi', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500', price: '₹6.8k/sq.ft', count: 56 },
    { name: 'Punawale', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500', price: '₹6.5k/sq.ft', count: 12 },
    { name: 'Ravet', image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=500', price: '₹7.0k/sq.ft', count: 18 },
    { name: 'Tathawade', image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=500', price: '₹6.8k/sq.ft', count: 15 },
];

const LocalityStrip = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [localities, setLocalities] = useState<any[]>(DEFAULT_LOCALITIES);

    useEffect(() => {
        const fetchLocalities = async () => {
            const { data } = await supabase
                .from('localities')
                .select('*')
                .eq('isFeatured', true)
                .order('name');

            if (data && data.length > 0) {
                // Map DB columns to UI shape if needed, or just use as is
                const mapped = data.map((l, index) => ({
                    name: l.name,
                    // Try image_url, imageUrl, or fallback to the default list by index/random
                    image: l.image_url || l.imageUrl || DEFAULT_LOCALITIES[index % DEFAULT_LOCALITIES.length].image,
                    price: l.avgPriceSqft ? `₹${(l.avgPriceSqft / 1000).toFixed(1)}k/sq.ft` : (l.averagePrice || 'N/A'), // Fix price key mapping
                    count: l.projectCount || 0
                }));
                setLocalities(mapped);
            }
        };
        fetchLocalities();
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -300 : 300;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-12 bg-white relative">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <span className="text-accent-500 font-extrabold tracking-widest text-xs uppercase mb-1 block">Explore By Area</span>
                        <h3 className="text-2xl font-bold text-slate-900">Popular Localities</h3>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => scroll('left')} className="p-3 rounded-full bg-white border border-gray-100 shadow-lg hover:bg-brand-50 hover:text-brand-600 transition-all active:scale-95">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={() => scroll('right')} className="p-3 rounded-full bg-white border border-gray-100 shadow-lg hover:bg-brand-50 hover:text-brand-600 transition-all active:scale-95">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex gap-5 overflow-x-auto no-scrollbar snap-x pb-8 px-1"
                >
                    {localities.map((loc) => (
                        <Link to={`/search?q=${loc.name}`} key={loc.name} className="min-w-[200px] snap-start group cursor-pointer">
                            {/* Image Container with Gradient Ring */}
                            <div className="relative p-[3px] rounded-2xl bg-gradient-to-br from-brand-300 via-accent-300 to-brand-300 bg-[length:400%_400%] animate-pulse-slow mb-3 transition-transform hover:-translate-y-1 duration-300">
                                <div className="relative h-36 rounded-xl overflow-hidden bg-white">
                                    <img src={loc.image} alt={loc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
                                    <div className="absolute bottom-3 left-3 text-white">
                                        <span className="text-xl font-bold">{loc.name}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="px-1">
                                <div className="flex justify-between items-center">
                                    <p className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full inline-block">{loc.price}</p>
                                    <p className="text-xs text-slate-400 font-medium group-hover:text-brand-500 transition-colors">{loc.count}+ Projects</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LocalityStrip;
