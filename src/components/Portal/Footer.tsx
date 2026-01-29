
import React from 'react';
import { Link } from 'react-router-dom';

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
                            <li><Link to="/directory" className="hover:text-white transition-colors">Project Directory</Link></li>
                            <li>About Us</li>
                            <li>Careers</li>
                            <li>Contact</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-medium mb-4">Services</h4>
                        <ul className="space-y-2 text-sm">
                            <li>Buy Property</li>
                            <li>Sell Property</li>
                            <li>Rent Property</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-medium mb-4">Connect</h4>
                        <p className="text-sm mb-2">connect@punepropertyvlog.com</p>
                        <p className="text-sm font-bold text-white">+91 7744009295</p>
                    </div>
                </div>
                <div className="border-t border-slate-800 pt-8 text-center text-xs">
                    © 2026 Pune Property Vlog. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
