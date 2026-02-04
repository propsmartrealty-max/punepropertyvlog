
import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File): Promise<File> => {
    // Options for compression
    const options = {
        maxSizeMB: 0.2,          // Target < 200KB (approx "few KB")
        maxWidthOrHeight: 1200,  // HD Resolution is enough for web
        useWebWorker: true,
        fileType: 'image/webp',  // Modern format
        initialQuality: 0.7      // Good balance
    };

    try {
        console.log(`Original Size: ${(file.size / 1024).toFixed(2)} KB`);
        const compressedFile = await imageCompression(file, options);
        console.log(`Compressed Size: ${(compressedFile.size / 1024).toFixed(2)} KB`);

        // Create a new File object with the original name but .webp extension
        const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
        return new File([compressedFile], newFileName, { type: 'image/webp' });

    } catch (error) {
        console.error("Image compression failed, using original:", error);
        return file; // Fallback to original
    }
};
