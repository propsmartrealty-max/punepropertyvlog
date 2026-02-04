import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, FolderOpen } from 'lucide-react';
import { uploadFile, deleteFile } from '../../services/storageService';
import MediaSelectorModal from './MediaSelectorModal';

interface ImageUploadProps {
    label: string;
    value?: string;
    onChange: (url: string) => void;
    onRemove?: () => void;
    placeholder?: string;
    className?: string;
    bucket?: string;
    onUploadStatusChange?: (isUploading: boolean) => void;
    disabled?: boolean;
    altValue?: string;
    onAltChange?: (val: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    label,
    value,
    onChange,
    onRemove,
    placeholder = "Click to upload image",
    className = "",
    bucket = 'website-assets',
    onUploadStatusChange,
    disabled = false,
    altValue,
    onAltChange
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;

        const file = e.target.files?.[0];
        if (!file) return;

        // Size check (max 5MB - though compression will reduce this anyway)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image too large (max 5MB input)');
            return;
        }

        setIsProcessing(true);
        onUploadStatusChange?.(true);
        setError('');

        try {
            // storageService now handles compression automatically!
            const url = await uploadFile(file, bucket);
            onChange(url);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to upload image. Please try again.');
        } finally {
            setIsProcessing(false);
            onUploadStatusChange?.(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRemove = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!value) return;

        if (window.confirm('Are you sure you want to remove this image?')) {
            try {
                // If it's a supabase URL, try to delete it (optional policy)
                // But often reused images shouldn't be deleted from storage on form clear
                // Ideally prompt: "Remove from form" vs "Delete from storage"
                // For safety in this component, we just clear the Form value
                // and let the Media Library manage storage deletion.
                if (onRemove) {
                    onRemove();
                } else {
                    onChange('');
                }
            } catch (err) {
                console.error("Error removing", err);
                onChange('');
            }
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <label className="block text-sm font-medium text-slate-700">{label}</label>

            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileSelect}
                disabled={disabled}
            />

            {!value ? (
                <div className="flex flex-col gap-2">
                    {/* Main Drop Zone */}
                    <div
                        onClick={() => !isProcessing && !disabled && fileInputRef.current?.click()}
                        className={`
                            border-2 border-dashed border-slate-300 rounded-xl p-6
                            flex flex-col items-center justify-center gap-2
                            transition-colors
                            ${isProcessing || disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-blue-500 hover:bg-blue-50/50'}
                        `}
                    >
                        {isProcessing ? (
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        ) : (
                            <Upload className="w-8 h-8 text-slate-400" />
                        )}
                        <p className="text-sm text-slate-500 font-medium">
                            {isProcessing ? 'Compressing & Uploading...' : placeholder}
                        </p>
                        <p className="text-xs text-slate-400">JPG, PNG -&gt; WebP (Auto-Compressed)</p>
                    </div>

                    {/* Choose from Library Button */}
                    <button
                        type="button"
                        onClick={() => setIsLibraryOpen(true)}
                        disabled={disabled || isProcessing}
                        className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    >
                        <FolderOpen className="w-4 h-4" />
                        Select from Library
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    <div className="relative group rounded-xl overflow-hidden border border-slate-200">
                        <img
                            src={value}
                            alt="Preview"
                            className="w-full h-48 object-cover bg-slate-100"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button
                                type="button"
                                onClick={handleRemove}
                                className={`bg-white p-2 rounded-full text-red-600 hover:bg-red-50 shadow-lg transform hover:scale-110 transition-all ${disabled ? 'pointer-events-none opacity-50' : ''}`}
                                disabled={disabled}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Alt Text Input - Only if handler provided */}
                    {onAltChange && (
                        <input
                            type="text"
                            value={altValue || ''}
                            onChange={(e) => onAltChange(e.target.value)}
                            placeholder="Alt Text (SEO Description)"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
                            disabled={disabled}
                        />
                    )}
                </div>
            )}

            {error && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                    <X className="w-3 h-3" /> {error}
                </p>
            )}

            <MediaSelectorModal
                isOpen={isLibraryOpen}
                onClose={() => setIsLibraryOpen(false)}
                onSelect={(url) => {
                    onChange(url);
                    // No need to set isProcessing since it's just a string link now
                }}
            />
        </div>
    );
};

export default ImageUpload;
