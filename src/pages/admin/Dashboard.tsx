
import React from 'react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { useData } from '../../context/DataContext';
import { Building2, HardHat, TrendingUp, Loader2 } from 'lucide-react';

const Dashboard = () => {
    const { projects, builders, isLoading } = useData();

    if (isLoading) {
        return (
            <AdminLayout title="Dashboard Overview">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Dashboard Overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-500 font-medium">Total Projects</h3>
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                            <Building2 className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{projects.length}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-500 font-medium">Total Builders</h3>
                        <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                            <HardHat className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{builders.length}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-500 font-medium">Total Views</h3>
                        <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">1.2k</p>
                </div>
            </div>

            <h3 className="text-lg font-bold mb-4">Recent Projects</h3>
            <div className="bg-white border border-gray-100 rounded-xl overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-900">Project Name</th>
                            <th className="px-6 py-4 font-semibold text-slate-900">Location</th>
                            <th className="px-6 py-4 font-semibold text-slate-900">Status</th>
                            <th className="px-6 py-4 font-semibold text-slate-900">Price</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {projects.slice(0, 5).map(project => (
                            <tr key={project.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4 font-medium text-slate-900">{project.title}</td>
                                <td className="px-6 py-4">{project.location}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {project.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{project.priceRange}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
