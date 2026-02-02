
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/Admin/AdminLayout';
import { useData } from '../../context/DataContext';
import { Edit, Trash2, Plus, MapPin } from 'lucide-react';

import DeleteConfirmationModal from '../../components/Admin/DeleteConfirmationModal';

const Builders = () => {
    const { builders, deleteBuilder } = useData();
    const navigate = useNavigate();
    const [deleteModal, setDeleteModal] = React.useState<{ isOpen: boolean; id: string | null; name: string }>({
        isOpen: false,
        id: null,
        name: ''
    });

    const openDeleteModal = (id: string, name: string) => {
        setDeleteModal({ isOpen: true, id, name });
    };

    const confirmDelete = () => {
        if (deleteModal.id) {
            deleteBuilder(deleteModal.id);
        }
    };

    return (
        <AdminLayout title="Manage Builders">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-slate-700">All Builders ({builders.length})</h2>
                <Link
                    to="/admin/builders/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Builder
                </Link>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-900">Builder Name</th>
                            <th className="px-6 py-4 font-semibold text-slate-900">Established</th>
                            <th className="px-6 py-4 font-semibold text-slate-900">Projects (Active/Total)</th>
                            <th className="px-6 py-4 font-semibold text-slate-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {builders.map(builder => (
                            <tr key={builder.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={builder.logo} alt="" className="w-10 h-10 rounded-lg object-contain bg-white border border-gray-100 p-1" />
                                        <div>
                                            <p className="font-medium text-slate-900">{builder.name}</p>
                                            <p className="text-xs text-slate-400">ID: {builder.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{builder.establishedYear}</td>
                                <td className="px-6 py-4">
                                    {builder.ongoingProjects} / {builder.totalProjects}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/builders/${builder.id}`)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(builder.id, builder.name)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {builders.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-12">
                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                        <div className="bg-slate-50 p-4 rounded-full mb-3">
                                            <MapPin className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <p className="text-lg font-semibold text-slate-600">No Builders Found</p>
                                        <p className="text-sm mb-4">Add builders to associate projects with.</p>
                                        <Link
                                            to="/admin/builders/new"
                                            className="text-blue-600 font-medium hover:underline"
                                        >
                                            Add Builder
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={confirmDelete}
                title="Delete Builder"
                message="Are you sure you want to delete this builder? WARNING: Projects associated with this builder might display errors."
                itemName={deleteModal.name}
            />
        </AdminLayout>
    );
};

export default Builders;
