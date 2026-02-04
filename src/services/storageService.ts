import { supabase } from './supabase';
import { compressImage } from '../utils/imageCompression';

export const uploadFile = async (file: File, bucket: string = 'website-assets'): Promise<string> => {
    try {
        if (!file) throw new Error("No file provided for upload");

        // Compress Image
        const compressedFile = await compressImage(file);

        const fileExt = compressedFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error } = await supabase.storage
            .from(bucket)
            .upload(filePath, compressedFile);

        if (error) {
            console.error("Supabase Storage Upload Error Details:", {
                message: error.message,
                name: error.name,
                details: (error as any).details,
                statusCode: (error as any).statusCode,
                bucket
            });
            throw error;
        }

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);


        return publicUrl;
    } catch (error: any) {
        console.error('Error uploading file:', error.message || error);
        throw error;
    }
};

export const listFiles = async (bucket: string = 'website-assets', path: string = ''): Promise<{ name: string; url: string; created_at: string; size: number }[]> => {
    try {
        const { data, error } = await supabase.storage
            .from(bucket)
            .list(path, {
                limit: 100,
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' },
            });

        if (error) {
            throw error;
        }

        // Generate public URLs for each file
        return data
            .filter(file => file.name !== '.emptyFolderPlaceholder') // Filter out placeholders
            .map(file => {
                const { data: { publicUrl } } = supabase.storage
                    .from(bucket)
                    .getPublicUrl(`${path ? path + '/' : ''}${file.name}`);

                return {
                    name: file.name,
                    url: publicUrl,
                    created_at: file.created_at,
                    size: file.metadata?.size || 0
                };
            });
    } catch (error: any) {
        console.error('Error listing files:', error.message || error);
        throw error;
    }
};

export const deleteFile = async (url: string, bucket: string = 'website-assets'): Promise<void> => {
    try {
        // Extract file path from URL
        // URL format: https://.../storage/v1/object/public/bucket/folder/file.jpg
        const path = url.split(`${bucket}/`).pop();
        if (!path) return;

        const { error } = await supabase.storage
            .from(bucket)
            .remove([path]);

        if (error) {
            throw error;
        }
    } catch (error) {
        console.error('Error deleting file:', error);
        throw error;
    }
};
