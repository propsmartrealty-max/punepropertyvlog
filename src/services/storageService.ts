import { supabase } from './supabase';

export const uploadFile = async (file: File, bucket: string = 'website-assets'): Promise<string> => {
    try {
        if (!file) throw new Error("No file provided for upload");

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        console.log(`Uploading ${file.name} to bucket ${bucket} as ${filePath}...`);

        const { error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

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

        console.log(`Upload successful: ${publicUrl}`);
        return publicUrl;
    } catch (error: any) {
        console.error('Error uploading file:', error.message || error);
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
