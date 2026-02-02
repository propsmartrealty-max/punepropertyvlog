import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/Admin/AdminLayout';
import { useData } from '../../context/DataContext';
import { Edit, Trash2, Plus, MapPin } from 'lucide-react';

import DeleteConfirmationModal from '../../components/Admin/DeleteConfirmationModal';

const Projects = () => {
    const { projects, builders, deleteProject } = useData();
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
            deleteProject(deleteModal.id);
        }
    };

    return (
        <AdminLayout title="Manage Projects">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-slate-700">All Projects ({projects.length})</h2>
                <Link
                    to="/admin/projects/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Project
                </Link>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-900">Project</th>
                            <th className="px-6 py-4 font-semibold text-slate-900">Builder</th>
                            <th className="px-6 py-4 font-semibold text-slate-900">Location</th>
                            <th className="px-6 py-4 font-semibold text-slate-900">Status</th>
                            <th className="px-6 py-4 font-semibold text-slate-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {projects.map(project => (
                            <tr key={project.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={project.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                                        <div>
                                            <p className="font-medium text-slate-900">{project.title}</p>
                                            <p className="text-xs text-slate-400">ID: {project.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {builders.find(b => b.id === project.builderId)?.name || project.builderId}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3 text-slate-400" />
                                        {project.location}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${project.status === 'Ready to Move' ? 'bg-green-100 text-green-800' :
                                        project.status === 'Under Construction' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                        {project.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/projects/${project.id}`)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(project.id, project.title)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {projects.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-12">
                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                        <div className="bg-slate-50 p-4 rounded-full mb-3">
                                            <MapPin className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <p className="text-lg font-semibold text-slate-600">No Projects Found</p>
                                        <p className="text-sm mb-4">Start by adding your first real estate project.</p>
                                        <Link
                                            to="/admin/projects/new"
                                            className="text-blue-600 font-medium hover:underline"
                                        >
                                            Create New Project
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
                title="Delete Project"
                message="Are you sure you want to delete this project? This action cannot be undone."
                itemName={deleteModal.name}
            />
        </AdminLayout>
    );
};

export default Projects;
