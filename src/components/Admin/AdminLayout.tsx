
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, HardHat, LogOut, FileText, Layout, MapPin, Phone } from 'lucide-react';

const AdminLayout: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isAdminAuthenticated');
        navigate('/admin');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Building2, label: 'Projects', path: '/admin/projects' },
        { icon: HardHat, label: 'Builders', path: '/admin/builders' },
        { icon: Layout, label: 'Banners', path: '/admin/banners' },
        { icon: MapPin, label: 'Localities', path: '/admin/localities' },
        { icon: Phone, label: 'Leads', path: '/admin/leads' },
        { icon: LayoutDashboard, label: 'AI Seeder', path: '/admin/seed' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white fixed h-full hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <span className="bg-blue-600 p-1.5 rounded text-white text-xs">CMS</span>
                        Pune Property Vlog
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64">
                <header className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                    <div className="text-sm text-slate-500">
                        Welcome, Admin
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
