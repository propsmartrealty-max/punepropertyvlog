
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/Admin/AdminLayout';
import { listFiles, uploadFile, deleteFile } from '../../services/storageService';
import { Trash2, Copy, Upload, Image as ImageIcon, Check, RefreshCw } from 'lucide-react';

interface FileItem {
    name: string;
    url: string;
    created_at: string;
    size: number;
}

const MediaGallery = () => {
    const [activeBucket, setActiveBucket] = useState<'website-assets' | 'project-images'>('website-assets');
    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const loadFiles = async () => {
        setLoading(true);
        try {
            const data = await listFiles(activeBucket);
            setFiles(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load images');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFiles();
    }, [activeBucket]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            await uploadFile(file, activeBucket);
            toast.success('Image uploaded successfully');
            loadFiles(); // Refresh list
        } catch (error: any) {
            toast.error(error.message || 'Upload failed');
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    const handleDelete = async (file: FileItem) => {
        if (!window.confirm(`Are you sure you want to delete ${file.name}?`)) return;

        try {
            await deleteFile(file.url, activeBucket);
            toast.success('Image deleted');
            setFiles(prev => prev.filter(f => f.name !== file.name));
        } catch (error) {
            console.error(error);
            toast.error('Delete failed');
        }
    };

    const copyToClipboard = (url: string, name: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(name);
        toast.success('URL copied to clipboard');
        setTimeout(() => setCopiedId(null), 2000);
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    return (
        <AdminLayout title="Media Library">
            <div className="space-y-6">

                {/* Header Controls */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveBucket('website-assets')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeBucket === 'website-assets' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Website Assets
                        </button>
                        <button
                            onClick={() => setActiveBucket('project-images')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeBucket === 'project-images' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Project Images
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={loadFiles} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <label className={`
                            flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors shadow-sm
                            ${uploading ? 'opacity-70 pointer-events-none' : ''}
                        `}>
                            {uploading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
                            <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                        </label>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                            <div key={i} className="aspect-square bg-slate-200 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : files.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ImageIcon className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-600">No images found</h3>
                        <p className="text-slate-400">Upload an image to get started</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {files.map((file) => (
                            <div key={file.name} className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all relative">
                                <div className="aspect-square bg-slate-100 relative overflow-hidden">
                                    <img
                                        src={file.url}
                                        alt={file.name}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => copyToClipboard(file.url, file.name)}
                                            className="p-2 bg-white text-slate-700 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                            title="Copy URL"
                                        >
                                            {copiedId === file.name ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(file)}
                                            className="p-2 bg-white text-red-500 rounded-full hover:bg-red-50 hover:text-red-700 transition-colors"
                                            title="Delete Image"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <p className="text-sm font-medium text-slate-700 truncate" title={file.name}>
                                        {file.name}
                                    </p>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                                            {file.name.split('.').pop()}
                                        </span>
                                        <span className="text-[10px] text-slate-400">
                                            {formatSize(file.size)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default MediaGallery;
