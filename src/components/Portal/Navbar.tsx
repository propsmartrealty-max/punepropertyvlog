import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Menu, X, Phone, MessageCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAVIGATION_CONFIG, NavItem } from '../../config/navigation';

const PortalNavbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
    const location = useLocation();

    // Handle Scroll Effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileExpand = (name: string) => {
        setMobileExpanded(mobileExpanded === name ? null : name);
    };

    return (
        <>
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-glass border-b border-white/20 py-2' : 'bg-transparent py-4'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group z-50">
                            {/* Updated to Dark Amber for the "Yellow" request */}
                            <motion.div
                                whileHover="hover"
                                className="bg-[#15803d] p-2.5 rounded-xl shadow-lg group-hover:shadow-green-500/30 transition-all overflow-hidden relative w-11 h-11 flex items-center justify-center"
                            >
                                <motion.div
                                    initial={{ y: 0, opacity: 1 }}
                                    variants={{ hover: { y: -30, opacity: 0 } }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute"
                                >
                                    <Building2 className="w-6 h-6 text-slate-900" />
                                </motion.div>
                                <motion.div
                                    initial={{ y: 30, opacity: 0 }}
                                    variants={{ hover: { y: 0, opacity: 1 } }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute"
                                >
                                    <React.Fragment>
                                        {/* Key Icon imported locally within variants if needed or stick to Lucide Key */}
                                        {/* Since Key was removed from imports, using SVG or re-importing Key if essential. assuming Key is standard lucide. Re-adding Key to imports for safety */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-slate-900"><path d="m21 2-2 2m-7.6 7.6a6 6 0 1 1-5.7-5.7L10 11l4-4 2 2"></path><circle cx="8" cy="17" r="2"></circle></svg>
                                    </React.Fragment>
                                </motion.div>
                            </motion.div>
                            <div>
                                <h1 className={`text-xl font-extrabold tracking-tight transition-colors flex gap-1 ${scrolled ? '' : 'md:text-white'}`}>
                                    <span className={scrolled ? 'text-[#4285F4]' : 'text-white'}>PUNE</span>
                                    <span className={scrolled ? 'text-[#EA4335]' : 'text-white'}>PROPERTY</span>
                                    <span className={scrolled ? 'text-[#34A853]' : 'text-white'}>VLOG</span>
                                </h1>
                                <p className={`text-[9px] font-bold tracking-[0.2em] transition-colors ${scrolled ? 'text-slate-500' : 'text-slate-400 lg:text-blue-100'}`}>
                                    REAL ESTATE INTELLIGENCE
                                </p>
                            </div>
                        </Link>

                        {/* Desktop Links */}
                        <div className="hidden lg:flex items-center gap-1 bg-white/5 backdrop-blur-sm px-2 py-1 rounded-full border border-white/10 shrink-0">
                            {NAVIGATION_CONFIG.map((item) => (
                                <div
                                    key={item.name}
                                    className="relative group"
                                    onMouseEnter={() => setActiveDropdown(item.name)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    {item.children ? (
                                        <button
                                            className={`px-3 lg:px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1 ${scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}
                                        >
                                            {item.name}
                                            <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                                        </button>
                                    ) : (
                                        <Link
                                            to={item.path!}
                                            className={`px-3 lg:px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1 ${item.highlight
                                                ? 'bg-white text-slate-900 shadow-md hover:bg-blue-50'
                                                : scrolled
                                                    ? 'text-slate-700 hover:bg-slate-100'
                                                    : 'text-white hover:bg-white/10'
                                                }`}
                                        >
                                            {item.name}
                                        </Link>
                                    )}

                                    {/* Dropdown Menu */}
                                    {item.children && (
                                        <AnimatePresence>
                                            {activeDropdown === item.name && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-1 z-50"
                                                >
                                                    {item.children.map((child) => (
                                                        <Link
                                                            key={child.name}
                                                            to={child.path!}
                                                            className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                                                        >
                                                            {child.name}
                                                        </Link>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 shrink-0">
                            <a href="https://wa.me/917744009295" target="_blank" rel="noopener noreferrer" className={`hidden lg:flex items-center gap-2 px-3 lg:px-4 py-2 rounded-full font-bold text-sm transition-all ${scrolled ? 'bg-green-50 text-green-700 hover:bg-green-100 shadow-sm' : 'bg-green-500/20 text-white hover:bg-green-500/30 backdrop-blur-sm border border-green-400/30'
                                }`}>
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                <span className="hidden xl:inline">WhatsApp</span>
                            </a>

                            <a href="tel:+917744009295" className={`hidden lg:flex items-center gap-2 px-3 lg:px-4 py-2 rounded-full font-bold text-sm transition-all ${scrolled ? 'bg-slate-100 text-slate-900 hover:bg-slate-200' : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/10'
                                }`}>
                                <Phone className="w-4 h-4" />
                                <span className="hidden xl:inline">+91 7744009295</span>
                            </a>

                            <button className={`p-2 rounded-full lg:hidden transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`} onClick={() => setMobileMenuOpen(true)}>
                                <Menu className="w-7 h-7" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav >

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {
                    mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: '100%' }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-0 z-[60] bg-white overflow-y-auto"
                        >
                            <div className="p-5 flex justify-between items-center border-b border-gray-100 sticky top-0 bg-white z-10">
                                <span className="font-bold text-xl text-slate-900">Menu</span>
                                <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-full">
                                    <X className="w-6 h-6 text-slate-600" />
                                </button>
                            </div>
                            <div className="p-5 flex flex-col gap-2">
                                {NAVIGATION_CONFIG.map((item) => (
                                    <div key={item.name} className="border-b border-gray-50 last:border-0">
                                        {item.children ? (
                                            <>
                                                <button
                                                    onClick={() => toggleMobileExpand(item.name)}
                                                    className="w-full text-lg font-bold text-slate-800 py-3 flex justify-between items-center"
                                                >
                                                    <span className="flex items-center gap-3">
                                                        {item.icon && <item.icon className="w-5 h-5 text-gray-400" />}
                                                        {item.name}
                                                    </span>
                                                    <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${mobileExpanded === item.name ? 'rotate-90' : ''}`} />
                                                </button>
                                                <AnimatePresence>
                                                    {mobileExpanded === item.name && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden bg-slate-50 rounded-xl"
                                                        >
                                                            <div className="p-3 flex flex-col gap-2">
                                                                {item.children.map(child => (
                                                                    <Link
                                                                        key={child.name}
                                                                        to={child.path!}
                                                                        onClick={() => setMobileMenuOpen(false)}
                                                                        className="block px-4 py-3 text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-white rounded-lg transition-colors"
                                                                    >
                                                                        {child.name}
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </>
                                        ) : (
                                            <Link
                                                to={item.path!}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={`text-lg font-bold py-3 flex justify-between items-center ${item.highlight ? 'text-brand-600' : 'text-slate-800'}`}
                                            >
                                                <span className="flex items-center gap-3">
                                                    {item.icon && <item.icon className={`w-5 h-5 ${item.highlight ? 'text-brand-600' : 'text-gray-400'}`} />}
                                                    {item.name}
                                                </span>
                                            </Link>
                                        )}
                                    </div>
                                ))}

                                <div className="mt-8 flex flex-col gap-3">
                                    <a href="https://wa.me/917744009295" className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                        </svg>
                                        WhatsApp Us
                                    </a>
                                    <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-200">
                                        Login / Sign Up
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )
                }
            </AnimatePresence >
        </>
    );
};

export default PortalNavbar;
