import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadFile, deleteFile } from '../../services/storageService';

interface ImageUploadProps {
    label: string;
    value?: string;
    onChange: (url: string) => void;
    onRemove?: () => void;
    placeholder?: string;
    className?: string;
    bucket?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    label,
    value,
    onChange,
    onRemove,
    placeholder = "Click to upload image",
    className = "",
    bucket = 'website-assets'
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Size check (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image too large (max 5MB)');
            return;
        }

        setIsProcessing(true);
        setError('');

        try {
            const url = await uploadFile(file, bucket);
            onChange(url);
        } catch (err: any) {
            console.error(err);
            setError('Failed to upload image. Please try again.');
        } finally {
            setIsProcessing(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRemove = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering upload click
        if (!value) return;

        if (window.confirm('Are you sure you want to remove this image?')) {
            try {
                await deleteFile(value, bucket);
                if (onRemove) {
                    onRemove();
                } else {
                    onChange('');
                }
            } catch (err) {
                console.error("Error deleting file", err);
                // Even if delete fails (e.g. not found), we clear the UI
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
            />

            {!value ? (
                <div
                    onClick={() => !isProcessing && fileInputRef.current?.click()}
                    className={`
                        border-2 border-dashed border-slate-300 rounded-xl p-6
                        flex flex-col items-center justify-center gap-2
                        cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-colors
                        ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
                    `}
                >
                    {isProcessing ? (
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    ) : (
                        <Upload className="w-8 h-8 text-slate-400" />
                    )}
                    <p className="text-sm text-slate-500 font-medium">
                        {isProcessing ? 'Uploading...' : placeholder}
                    </p>
                    <p className="text-xs text-slate-400">JPG, PNG (Max 5MB)</p>
                </div>
            ) : (
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
                            className="bg-white p-2 rounded-full text-red-600 hover:bg-red-50 shadow-lg transform hover:scale-110 transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                    <X className="w-3 h-3" /> {error}
                </p>
            )}
        </div>
    );
};

export default ImageUpload;
