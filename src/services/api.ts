
import { supabase } from './supabase';
import { Project, Builder } from '../types';

const PAGE_SIZE = 10;

export interface ProjectFilters {
    location?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
}

export const api = {
    projects: {
        list: async (page = 1, filters: ProjectFilters = {}) => {
            let query = supabase
                .from('projects')
                .select('*', { count: 'exact' });

            // Apply filters (Server-side)
            if (filters.location) {
                query = query.ilike('location', `%${filters.location}%`);
            }
            if (filters.type) {
                // If filtering by "Commercial", we match explicitly.
                // If filtering by "Residential" (default), we might include Apartments, Villas.
                query = query.ilike('type', `%${filters.type}%`);
            }
            if (filters.status) {
                query = query.eq('status', filters.status);
            }

            // Price range filtering would require a numeric column or clever casting. 
            // For now, client-side price filtering on the PAGE is acceptable if the page size is small,
            // BUT for robustness we should ideally store price as integer. 
            // We will skip complex SQL price filtering for this iteration as it requires schema migration of `priceRange` column.

            const from = (page - 1) * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;

            const { data, error, count } = await query
                .order('createdAt', { ascending: false })
                .range(from, to);

            if (error) throw error;
            return { data: data as Project[], count, page, totalPages: Math.ceil((count || 0) / PAGE_SIZE) };
        },

        getById: async (id: string) => {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data as Project;
        },

        // Keep create/update/delete for admin mostly unchanged, 
        // but can be moved here for consistency.
    },
    builders: {
        list: async () => {
            // Builders list is usually smaller, can fetch all for now or paginate if needed.
            const { data, error } = await supabase.from('builders').select('*');
            if (error) throw error;
            return data as Builder[];
        },
        getById: async (id: string) => {
            const { data, error } = await supabase.from('builders').select('*').eq('id', id).single();
            if (error) throw error;
            return data as Builder;
        }
    }
};
