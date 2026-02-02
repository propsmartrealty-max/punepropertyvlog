import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Facebook } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-gray-400 py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Pune Property Vlog</h3>
                        <p className="text-sm">The most trusted storage of Real Estate data in Pune.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-medium mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/directory" className="hover:text-brand-400 transition-colors">Project Directory</Link></li>
                            <li><Link to="/about" className="hover:text-brand-400 transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-brand-400 transition-colors">Contact</Link></li>
                            <li><Link to="/post-property" className="hover:text-brand-400 transition-colors">Post Property</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-medium mb-4">Services</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/search?type=buy" className="hover:text-brand-400 transition-colors">Buy Property</Link></li>
                            <li><Link to="/post-property" className="hover:text-brand-400 transition-colors">Sell Property</Link></li>
                            <li><Link to="/search?type=rent" className="hover:text-brand-400 transition-colors">Rent Property</Link></li>
                            <li><Link to="/search?type=commercial" className="hover:text-brand-400 transition-colors">Commercial</Link></li>
                            <li><Link to="/search?type=plots" className="hover:text-brand-400 transition-colors">Plots</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-medium mb-4">Connect</h4>
                        <p className="text-sm mb-2">connect@punepropertyvlog.in</p>
                        <p className="text-sm font-bold text-white mb-4">+91 7744009295</p>
                        <div className="flex gap-4">
                            <a href="https://www.facebook.com/punepropertyvlog" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-500 transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="https://www.instagram.com/pune_property_vlog/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-500 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="https://www.youtube.com/@punepropertyvlog" target="_blank" rel="noopener noreferrer" className="text-white hover:text-red-500 transition-colors">
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-slate-800 pt-8 text-center text-xs text-gray-500">
                    © 2026 Pune Property Vlog. All rights reserved. <br />
                    <span className="italic mt-2 block opacity-70">
                        Disclaimer: Properties listed here are RERA registered. Prices mentioned are indicative and subject to change.
                        Please verify actual details on the official MahaRERA website before making any decision.
                        This website is an information aggregator and not a direct sales platform.
                    </span>
                </div>
            </div>
        </footer >
    );
};

export default Footer;
