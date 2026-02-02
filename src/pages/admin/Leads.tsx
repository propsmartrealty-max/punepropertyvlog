import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { supabase } from '../../services/supabase';

import { Trash2, Phone, Search } from 'lucide-react';

// Define a local interface for display purposes
interface EnrichedLead {
    id: string;
    name: string;
    mobile: string;
    email?: string;
    type: string;
    propertyType: string;
    location: string;
    price: string;
    message: string;
    status: string;
    createdAt: string;
}

import DeleteConfirmationModal from '../../components/Admin/DeleteConfirmationModal';

const AdminLeads = () => {
    const [leads, setLeads] = useState<EnrichedLead[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null; name: string }>({
        isOpen: false,
        id: null,
        name: ''
    });

    const fetchLeads = async () => {
        const { data, error } = await supabase
            .from('leads')
            .select('*, projects(title, location)')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching leads:', error);
        }

        if (data) {
            const mappedLeads: EnrichedLead[] = data.map((item: any) => ({
                id: item.id,
                name: item.name,
                mobile: item.mobile,
                email: item.email,
                type: item.type,
                // Logic: Project Title > Metadata Project > Metadata Property Type > General
                propertyType: item.projects?.title || item.metadata?.project || item.metadata?.property_type || 'General Inquiry',
                // Logic: Project Location > Metadata Location > Default
                location: item.projects?.location || item.metadata?.location || 'Pune',
                price: item.metadata?.price || '-',
                message: item.metadata?.message || '',
                status: item.status,
                createdAt: item.created_at
            }));
            setLeads(mappedLeads);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const openDeleteModal = (id: string, name: string) => {
        setDeleteModal({ isOpen: true, id, name });
    };

    const confirmDelete = async () => {
        if (deleteModal.id) {
            await supabase.from('leads').delete().eq('id', deleteModal.id);
            fetchLeads();
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        const { error } = await supabase
            .from('leads')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        } else {
            // Optimistic update or refetch
            fetchLeads();
        }
    };

    return (
        <AdminLayout title="Lead Management">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 font-semibold text-slate-600">Date</th>
                                <th className="p-4 font-semibold text-slate-600">Name / Mobile</th>
                                <th className="p-4 font-semibold text-slate-600">Requirement</th>
                                <th className="p-4 font-semibold text-slate-600">Details</th>
                                <th className="p-4 font-semibold text-slate-600">Status</th>
                                <th className="p-4 font-semibold text-slate-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {leads.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <div className="bg-slate-50 p-4 rounded-full mb-3">
                                                <Phone className="w-8 h-8 text-slate-300" />
                                            </div>
                                            <p className="text-lg font-semibold text-slate-600">No Leads Yet</p>
                                            <p className="text-sm">New inquiries will appear here.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {leads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-slate-50">
                                    <td className="p-4 text-sm text-slate-500">
                                        {new Date(lead.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800">{lead.name}</div>
                                        <div className="text-sm text-blue-600 flex items-center gap-1">
                                            <Phone className="w-3 h-3" /> {lead.mobile}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${lead.type === 'Sell Property' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {lead.type}
                                        </span>
                                        <div className="text-xs text-slate-500 mt-1">{lead.propertyType}</div>
                                    </td>
                                    <td className="p-4 text-sm">
                                        <div className="font-medium text-slate-700">{lead.location}</div>
                                        <div className="text-slate-500">₹ {lead.price}</div>
                                    </td>
                                    <td className="p-4">
                                        <select
                                            value={lead.status}
                                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                            className={`text-sm font-semibold rounded-lg px-2 py-1 border-0 ring-1 ring-inset ${lead.status === 'New' ? 'text-blue-700 bg-blue-50 ring-blue-600/20' :
                                                lead.status === 'Contacted' ? 'text-yellow-800 bg-yellow-50 ring-yellow-600/20' :
                                                    'text-green-700 bg-green-50 ring-green-600/20'
                                                }`}
                                        >
                                            <option value="New">New</option>
                                            <option value="Contacted">Contacted</option>
                                            <option value="Closed">Closed</option>
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <button onClick={() => openDeleteModal(lead.id, lead.name)} className="text-red-400 hover:text-red-600 p-2">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <DeleteConfirmationModal
                    isOpen={deleteModal.isOpen}
                    onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                    onConfirm={confirmDelete}
                    title="Delete Lead"
                    message="Are you sure you want to delete this lead? This action cannot be undone."
                    itemName={deleteModal.name}
                />
            </div>
        </AdminLayout>
    );
};

export default AdminLeads;
