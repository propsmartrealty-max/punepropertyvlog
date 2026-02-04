
import React, { useState, useEffect } from 'react';
import { listFiles, uploadFile } from '../../services/storageService';
import { X, Check, Loader2, Upload, Search, Image as ImageIcon } from 'lucide-react';

interface MediaSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
}

const MediaSelectorModal: React.FC<MediaSelectorModalProps> = ({ isOpen, onClose, onSelect }) => {
    const [activeBucket, setActiveBucket] = useState<'website-assets' | 'project-images'>('website-assets');
    const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadFiles();
        }
    }, [isOpen, activeBucket]);

    const loadFiles = async () => {
        setLoading(true);
        try {
            const data = await listFiles(activeBucket);
            setFiles(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // storageService will handle compression automatically now!
            await uploadFile(file, activeBucket);
            loadFiles(); // Refresh
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-blue-600" />
                        Select Media
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Controls */}
                <div className="p-4 bg-slate-50 flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex bg-white border border-gray-200 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveBucket('website-assets')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeBucket === 'website-assets' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            Website Assets
                        </button>
                        <button
                            onClick={() => setActiveBucket('project-images')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeBucket === 'project-images' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            Project Images
                        </button>
                    </div>

                    <div className="flex flex-1 gap-2 max-w-md">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search images..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                            />
                        </div>
                        <label className={`
                            flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors
                            ${uploading ? 'opacity-70 pointer-events-none' : ''}
                        `}>
                            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            <span>Upload</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                        </label>
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                                <div key={i} className="aspect-square bg-slate-200 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : filteredFiles.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                            <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                            <p>No images found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {filteredFiles.map((file) => (
                                <div
                                    key={file.name}
                                    onClick={() => { onSelect(file.url); onClose(); }}
                                    className="group bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all relative"
                                >
                                    <div className="aspect-square bg-slate-100 relative">
                                        <img
                                            src={file.url}
                                            alt={file.name}
                                            loading="lazy"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors flex items-center justify-center">
                                            <span className="opacity-0 group-hover:opacity-100 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold transform translate-y-2 group-hover:translate-y-0 transition-all">
                                                Select
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-2 bg-white">
                                        <p className="text-xs text-slate-600 truncate">{file.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MediaSelectorModal;
