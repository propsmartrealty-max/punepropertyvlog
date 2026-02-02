import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';
import PortalNavbar from '../components/Portal/Navbar';
import Footer from '../components/Portal/Footer';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <PortalNavbar />

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-lg w-full text-center">
                    <div className="mb-8 relative inline-block">
                        <span className="text-9xl font-bold text-gray-200 select-none">404</span>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold text-slate-800 bg-slate-50 px-2">Page Not Found</span>
                        </div>
                    </div>

                    <p className="text-slate-600 mb-8 text-lg">
                        Oops! The page you are looking for might have been removed,
                        had its name changed, or is temporarily unavailable.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            <Home className="w-5 h-5" />
                            Go Home
                        </Link>
                        <Link
                            to="/search"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            <Search className="w-5 h-5" />
                            Browse Properties
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default NotFound;
