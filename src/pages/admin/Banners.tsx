import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import AdminLayout from '../../components/Admin/AdminLayout';
import ImageUpload from '../../components/Admin/ImageUpload';
import { Plus, Trash2, Save, MoveUp, MoveDown, Loader2 } from 'lucide-react';

interface Banner {
    id: string;
    title: string;
    imageUrl: string;
    link: string;
    isActive: boolean;
    sortOrder: number;
}

const AdminBanners = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // New/Edit State (Simplified: Inline editing or Modal? using Inline for speed)
    const [newBanner, setNewBanner] = useState<Partial<Banner>>({
        title: '',
        imageUrl: '',
        link: '',
        isActive: true,
        sortOrder: 0
    });

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('banners')
            .select('*')
            .order('sortOrder', { ascending: true });

        if (data) setBanners(data);
        setIsLoading(false);
    };

    const handleAddBanner = async () => {
        if (!newBanner.imageUrl) return alert("Image is required");
        setIsSaving(true);

        const { error } = await supabase.from('banners').insert([{
            ...newBanner,
            sortOrder: banners.length // Append to end
        }]);

        if (error) {
            alert('Failed to add banner');
            console.error(error);
        } else {
            setNewBanner({ title: '', imageUrl: '', link: '', isActive: true, sortOrder: 0 });
            fetchBanners();
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string, imageUrl: string) => {
        if (!confirm('Delete this banner?')) return;

        // Cleanup storage
        try {
            if (imageUrl) {
                const { deleteFile } = await import('../../services/storageService');
                await deleteFile(imageUrl);
            }
        } catch (error) {
            console.error("Error deleting image from storage:", error);
            // Continue to delete record even if storage fails
        }

        const { error } = await supabase.from('banners').delete().eq('id', id);
        if (error) {
            alert("Failed to delete banner");
        } else {
            fetchBanners();
        }
    };

    const handleUpdate = async (id: string, updates: Partial<Banner>) => {
        await supabase.from('banners').update(updates).eq('id', id);
        fetchBanners();
    };

    return (
        <AdminLayout title="Manage Home Banners">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Add New Banner Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-blue-600" /> Add New Banner
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <input
                                placeholder="Banner Title (Optional)"
                                className="w-full px-4 py-2 border rounded-lg"
                                value={newBanner.title}
                                onChange={e => setNewBanner({ ...newBanner, title: e.target.value })}
                            />
                            <input
                                placeholder="Link URL (e.g. /projects/godrej)"
                                className="w-full px-4 py-2 border rounded-lg"
                                value={newBanner.link}
                                onChange={e => setNewBanner({ ...newBanner, link: e.target.value })}
                            />
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-slate-600">Active status:</label>
                                <input
                                    type="checkbox"
                                    checked={newBanner.isActive}
                                    onChange={e => setNewBanner({ ...newBanner, isActive: e.target.checked })}
                                    className="w-4 h-4"
                                />
                            </div>
                        </div>
                        <div>
                            <ImageUpload
                                label="Banner Image (1920x600 recommended)"
                                value={newBanner.imageUrl}
                                onChange={(url) => setNewBanner({ ...newBanner, imageUrl: url })}
                                bucket="website-assets"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleAddBanner}
                            disabled={isSaving || !newBanner.imageUrl}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                            Save Banner
                        </button>
                    </div>
                </div>

                {/* Existing Banners List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 font-bold text-slate-700">
                        Active Banners ({banners.length})
                    </div>
                    {isLoading ? (
                        <div className="p-8 text-center text-slate-500">Loading banners...</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {banners.map((banner, index) => (
                                <div key={banner.id} className="p-4 flex flex-col md:flex-row gap-4 items-center">
                                    {/* Drag/Sort Handle could go here */}
                                    <div className="w-full md:w-48 h-24 bg-slate-100 rounded-lg overflow-hidden shrink-0 relative">
                                        <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                                        {!banner.isActive && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold uppercase">Inactive</div>}
                                    </div>

                                    <div className="flex-1 w-full text-center md:text-left">
                                        <h4 className="font-bold text-slate-800">{banner.title || 'Untitled Banner'}</h4>
                                        <p className="text-xs text-blue-500 truncate">{banner.link}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleUpdate(banner.id, { isActive: !banner.isActive })}
                                            className={`px-3 py-1 rounded text-xs font-bold ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                                        >
                                            {banner.isActive ? 'Active' : 'Draft'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(banner.id, banner.imageUrl)}
                                            className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {banners.length === 0 && (
                                <div className="p-8 text-center text-slate-400 font-medium">
                                    No banners found. Add one above.
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </AdminLayout>
    );
};

export default AdminBanners;
