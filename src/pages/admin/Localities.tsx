import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import AdminLayout from '../../components/Admin/AdminLayout';
import ImageUpload from '../../components/Admin/ImageUpload';
import { Plus, Trash2, Save, MapPin, Loader2, Edit2 } from 'lucide-react';

interface Locality {
    id: string;
    name: string;
    imageUrl: string;
    averagePrice: string;
    projectCount: number;
    isFeatured: boolean;
}

const AdminLocalities = () => {
    const [localities, setLocalities] = useState<Locality[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const initialFormState = {
        name: '',
        imageUrl: '',
        averagePrice: '',
        projectCount: 0,
        isFeatured: true
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchLocalities();
    }, []);

    const fetchLocalities = async () => {
        setIsLoading(true);
        const { data } = await supabase
            .from('localities')
            .select('*')
            .order('name', { ascending: true });

        if (data) setLocalities(data);
        setIsLoading(false);
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.imageUrl) return alert("Name and Image are required");
        setIsSaving(true);

        if (editingId) {
            await supabase.from('localities').update(formData).eq('id', editingId);
            setEditingId(null);
        } else {
            await supabase.from('localities').insert([formData]);
        }

        setFormData(initialFormState);
        fetchLocalities();
        setIsSaving(false);
    };

    const handleEdit = (loc: Locality) => {
        setEditingId(loc.id);
        setFormData({
            name: loc.name,
            imageUrl: loc.imageUrl,
            averagePrice: loc.averagePrice,
            projectCount: loc.projectCount,
            isFeatured: loc.isFeatured
        });
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this locality?')) return;
        await supabase.from('localities').delete().eq('id', id);
        fetchLocalities();
    };

    return (
        <AdminLayout title="Manage Localities">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Add/Edit Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        {editingId ? <Edit2 className="w-5 h-5 text-orange-500" /> : <Plus className="w-5 h-5 text-blue-600" />}
                        {editingId ? 'Edit Locality' : 'Add New Locality'}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <input
                                placeholder="Locality Name (e.g. Baner)"
                                className="w-full px-4 py-2 border rounded-lg"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                            <input
                                placeholder="Avg Price (e.g. ₹9.5k/sq.ft)"
                                className="w-full px-4 py-2 border rounded-lg"
                                value={formData.averagePrice}
                                onChange={e => setFormData({ ...formData, averagePrice: e.target.value })}
                            />
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <label className="text-xs text-slate-500 block mb-1">Project Count</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 border rounded-lg"
                                        value={formData.projectCount}
                                        onChange={e => setFormData({ ...formData, projectCount: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="flex items-center gap-2 h-full pt-6">
                                    <input
                                        type="checkbox"
                                        checked={formData.isFeatured}
                                        onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                                        className="w-5 h-5"
                                    />
                                    <label className="text-sm font-medium">Show on Home</label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <ImageUpload
                                label="Locality Image (Square/Thumbnail)"
                                value={formData.imageUrl}
                                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                                bucket="website-assets"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        {editingId && (
                            <button
                                onClick={() => {
                                    setEditingId(null);
                                    setFormData(initialFormState);
                                }}
                                className="px-4 py-2 text-slate-500 hover:text-slate-700"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            onClick={handleSubmit}
                            disabled={isSaving || !formData.imageUrl}
                            className={`px-6 py-2 rounded-lg font-bold text-white flex items-center gap-2 ${editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                            {editingId ? 'Update Locality' : 'Save Locality'}
                        </button>
                    </div>
                </div>

                {/* Localities Grid */}
                <div>
                    <h3 className="text-slate-800 font-bold mb-4">Existing Localities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {localities.map((loc) => (
                            <div key={loc.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                                <div className="h-32 relative">
                                    <img src={loc.imageUrl} alt={loc.name} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-lg p-1 shadow-sm">
                                        <button onClick={() => handleEdit(loc)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(loc.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <h4 className="font-bold text-slate-800 flex items-center gap-1">
                                        <MapPin className="w-3 h-3 text-slate-400" /> {loc.name}
                                    </h4>
                                    <div className="flex justify-between mt-2 text-xs text-slate-500">
                                        <span className="bg-slate-100 px-2 py-0.5 rounded">{loc.averagePrice}</span>
                                        <span>{loc.projectCount} Projects</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {!isLoading && localities.length === 0 && (
                        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
                            No localities added yet.
                        </div>
                    )}
                </div>

            </div>
        </AdminLayout>
    );
};

export default AdminLocalities;
