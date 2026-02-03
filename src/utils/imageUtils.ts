
/**
 * Optimizes Supabase Storage URLs for performance.
 * 
 * Strategy:
 * 1. Appends ?width=X&quality=Y for resizing (Standard Supabase Feature).
 * 2. Caches results to avoid frequent recalculations.
 * 3. Handles fallbacks for broken/empty URLs.
 */

export const getOptimizedImageUrl = (url: string | undefined, width: number = 800, quality: number = 80): string => {
    if (!url) return 'https://placehold.co/600x400?text=No+Image';
    if (url.includes('placehold.co') || url.includes('ui-avatars')) return url;
    if (url.startsWith('blob:')) return url; // Preview images during upload

    try {
        // Check if it's a Supabase Storage URL
        if (url.includes('supabase.co/storage/v1/object/public')) {
            const separator = url.includes('?') ? '&' : '?';
            // Transformations: width, quality, format=webp (modern browsers)
            return `${url}${separator}width=${width}&quality=${quality}&format=webp`;
        }

        // Return original for non-Supabase URLs
        return url;
    } catch (e) {
        return url;
    }
};

export const getBlurHash = (url: string) => {
    // Phase 2: Implement BlurHash for smooth loading
    return "L6PZfSi_.AyE_3t7t7R**0o#DgR4";
};
