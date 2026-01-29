import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Menu, UserCircle, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PortalNavbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Handle Scroll Effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Buy', path: '/search?type=buy' },
        { name: 'Rent', path: '/search?type=rent' },
        { name: 'Commercial', path: '/search?type=commercial' },
        { name: 'New Projects', path: '/search?type=new-launch' },
        { name: 'Builders', path: '/directory' },
        { name: 'Post Property', path: '/post-property', highlight: true },
    ];

    return (
        <>
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-glass border-b border-white/20 py-2' : 'bg-transparent py-4'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-xl shadow-lg group-hover:shadow-blue-500/30 transition-all">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className={`text-xl font-extrabold tracking-tight transition-colors ${scrolled ? 'text-slate-900' : 'text-slate-900 md:text-white'}`}>
                                    PROPSMART
                                </h1>
                                <p className={`text-[9px] font-bold tracking-[0.2em] transition-colors ${scrolled ? 'text-slate-500' : 'text-slate-400 md:text-blue-100'}`}>
                                    REALTY
                                </p>
                            </div>
                        </Link>

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-sm px-2 py-1 rounded-full border border-white/10">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${link.highlight
                                        ? 'bg-white text-slate-900 shadow-md hover:bg-blue-50'
                                        : scrolled
                                            ? 'text-slate-700 hover:bg-slate-100'
                                            : 'text-white hover:bg-white/10'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <a href="tel:+917744009295" className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${scrolled ? 'bg-slate-100 text-slate-900 hover:bg-slate-200' : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                                }`}>
                                <Phone className="w-4 h-4" />
                                <span className="hidden lg:inline">+91 7744009295</span>
                            </a>

                            <button className={`p-2 rounded-full md:hidden transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`} onClick={() => setMobileMenuOpen(true)}>
                                <Menu className="w-7 h-7" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[60] bg-white"
                    >
                        <div className="p-5 flex justify-between items-center border-b border-gray-100">
                            <span className="font-bold text-xl text-slate-900">Menu</span>
                            <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-full">
                                <X className="w-6 h-6 text-slate-600" />
                            </button>
                        </div>
                        <div className="p-5 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-lg font-bold text-slate-800 py-3 border-b border-gray-50 flex justify-between items-center"
                                >
                                    {link.name}
                                    <Building2 className="w-5 h-5 text-gray-300" />
                                </Link>
                            ))}
                            <button className="mt-8 w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-200">
                                Login / Sign Up
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default PortalNavbar;
