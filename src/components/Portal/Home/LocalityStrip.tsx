import React, { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabase';
// import { motion } from 'framer-motion';
// import { ChevronRight, ChevronLeft, MapPin } from 'lucide-react';
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
    // const scrollRef = useRef<HTMLDivElement>(null); // Removed layout logic
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

    return (
        <section className="py-16 bg-white relative">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-10">
                    <span className="text-accent-500 font-extrabold tracking-widest text-xs uppercase mb-1 block">Explore By Area</span>
                    <h3 className="text-3xl font-bold text-slate-900">Popular Localities</h3>
                    <div className="w-20 h-1 bg-brand-500 mx-auto mt-4 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {localities.map((loc) => (
                        <Link to={`/search?q=${loc.name}`} key={loc.name} className="group cursor-pointer">
                            {/* Card Container */}
                            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] mb-3 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                <img
                                    src={loc.image}
                                    alt={loc.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                                <div className="absolute bottom-4 left-4 text-white">
                                    <h4 className="text-lg font-bold mb-1">{loc.name}</h4>
                                    <div className="flex items-center gap-2 text-xs text-white/90">
                                        <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">{loc.count} Projects</span>
                                    </div>
                                </div>

                                <div className="absolute top-4 right-4 bg-brand-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                                    {loc.price}
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
