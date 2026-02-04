import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import AdminLayout from '../../components/Admin/AdminLayout';
import { useData } from '../../context/DataContext';
import { Edit, Trash2, Plus, MapPin, TrendingUp } from 'lucide-react';
import ImageUpload from '../../components/Admin/ImageUpload';

const AdminLocalities = () => {
    const { localities, isLoading } = useData();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [currentLocality, setCurrentLocality] = useState<any>(null);

    // Form State
    const [name, setName] = useState('');
    const [avgPrice, setAvgPrice] = useState('');
    const [appreciationRate, setAppreciationRate] = useState('7.5');
    const [image, setImage] = useState('');

    const resetForm = () => {
        setName('');
        setAvgPrice('');
        setAppreciationRate('7.5');
        setImage('');
        setCurrentLocality(null);
        setIsEditing(false);
    }

    const handleEdit = (locality: any) => {
        setCurrentLocality(locality);
        setName(locality.name);
        setAvgPrice(locality.avgPriceSqft || '');
        setAppreciationRate(locality.appreciation_rate || '7.5');
        setImage(locality.image_url || locality.imageUrl || '');
        setIsEditing(true);
    };

    // Mutation to Add/Update Locality
    const mutation = useMutation({
        mutationFn: async (vars: any) => {
            const { supabase } = await import('../../services/supabase');
            if (vars.id) {
                // Update
                const { error } = await supabase.from('localities').update({
                    name: vars.name,
                    avgPriceSqft: vars.avgPriceSqft,
                    appreciation_rate: vars.appreciation_rate,
                    image_url: vars.imageUrl
                }).eq('id', vars.id);
                if (error) throw error;
            } else {
                // Insert
                const { error } = await supabase.from('localities').insert([{
                    name: vars.name,
                    avgPriceSqft: vars.avgPriceSqft,
                    appreciation_rate: vars.appreciation_rate,
                    image_url: vars.imageUrl
                }]);
                if (error) throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['localities'] });
            resetForm();
            toast.success('Locality saved successfully');
        },
        onError: (err: any) => {
            toast.error("Error saving locality: " + err.message);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { supabase } = await import('../../services/supabase');
            const { error } = await supabase.from('localities').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['localities'] });
            toast.success('Locality deleted successfully');
        },
        onError: (err: any) => {
            toast.error("Error deleting locality: " + err.message);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({
            id: currentLocality?.id,
            name,
            avgPriceSqft: avgPrice ? Number(avgPrice) : null,
            appreciation_rate: appreciationRate ? Number(appreciationRate) : 7.5,
            imageUrl: image
        });
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this locality?")) {
            deleteMutation.mutate(id);
        }
    }

    return (
        <AdminLayout title="Manage Localities (Market Intel)">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Form Section */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-6">
                        <h3 className="font-bold text-slate-800 mb-4">{isEditing ? 'Edit Locality' : 'Add New Locality'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <ImageUpload
                                    label="Locality Image"
                                    value={image}
                                    onChange={setImage}
                                    bucket="website-assets"
                                />
                            </div>
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Locality Image</label>
                                <ImageUpload
                                    value={image}
                                    onChange={setImage}
                                    bucket="website-assets"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Locality Name</label>
                                <input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="e.g. Baner"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Avg Price (₹/sq.ft)</label>
                                <input
                                    type="number"
                                    value={avgPrice}
                                    onChange={e => setAvgPrice(e.target.value)}
                                    placeholder="e.g. 8500"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <p className="text-xs text-slate-500 mt-1">Used for "Deal Meter" calculation.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Appreciation Rate (%)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={appreciationRate}
                                    onChange={e => setAppreciationRate(e.target.value)}
                                    placeholder="e.g. 7.5"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-slate-500 mt-1">Used for "Price Trend" graphs.</p>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={mutation.isPending}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {mutation.isPending ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4" />
                                            {isEditing ? 'Update' : 'Add'}
                                        </>
                                    )}
                                </button>
                                {isEditing && !mutation.isPending && (
                                    <button type="button" onClick={resetForm} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="md:col-span-2 space-y-4">
                    {localities.map((loc: any) => (
                        <div key={loc.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg">{loc.name}</h4>
                                    <div className="flex gap-4 text-sm text-slate-600 mt-1">
                                        <p>Avg: <span className="font-semibold text-slate-900">₹{loc.avgPriceSqft?.toLocaleString() || 'N/A'}/sqft</span></p>
                                        <p className="flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3 text-green-500" />
                                            <span className="font-semibold text-green-600">+{loc.appreciation_rate}%</span> /yr
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(loc)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(loc.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {localities.length === 0 && !isLoading && (
                        <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                            <p className="text-slate-400">No market intelligence data yet. Add a locality to start.</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminLocalities;
