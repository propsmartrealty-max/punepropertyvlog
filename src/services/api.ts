
import { supabase } from './supabase';
import { Project, Builder } from '../types';

const PAGE_SIZE = 10;

export interface ProjectFilters {
    location?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    configurations?: string[];
    budget?: string[];
}

export const api = {
    projects: {
        list: async (page = 1, filters: ProjectFilters = {}) => {
            let query = supabase
                .from('projects')
                .select('*, project_configurations!inner(basePrice)', { count: 'exact' });

            // Note: We use !inner join to filter projects based on configurations prices if needed.
            // If no budget filter, strict inner join might exclude projects without configs.
            // So we need conditional selection.

            if (filters.budget && filters.budget.length > 0) {
                query = supabase.from('projects').select('*, project_configurations!inner(basePrice)', { count: 'exact' });
            } else {
                query = supabase.from('projects').select('*', { count: 'exact' });
            }

            // Apply filters (Server-side)
            if (filters.location) {
                query = query.ilike('location', `%${filters.location}%`);
            }
            if (filters.type) {
                query = query.ilike('type', `%${filters.type}%`);
            }
            if (filters.status) {
                query = query.eq('status', filters.status);
            }
            if (filters.configurations && filters.configurations.length > 0) {
                // 'configurations' column is text[]: ['2 BHK', '3 BHK']
                // .contains means "projects where configurations array contains ALL of these"?
                // No, we typically want ANY of the selected. .overlaps is better for OR logic.
                // Supabase supports .overlaps for array columns.
                query = query.overlaps('configurations', filters.configurations);
            }

            // Budget Filtering Logic using project_configurations
            if (filters.budget && filters.budget.length > 0) {
                // Map buckets to OR conditions?
                // Supabase OR syntax is tricky across joined tables.
                // Simplified strategy: Check if ANY configuration satisfies the range.
                // We construct a filter string for the JOINED table.

                // Buckets: '50L', '1Cr', '1.5Cr', '2Cr+'
                const conditions: string[] = [];
                if (filters.budget.includes('50L')) conditions.push('basePrice.lt.5000000');
                if (filters.budget.includes('1Cr')) conditions.push('and(basePrice.gte.5000000,basePrice.lt.10000000)');
                if (filters.budget.includes('1.5Cr')) conditions.push('and(basePrice.gte.10000000,basePrice.lt.15000000)');
                if (filters.budget.includes('2Cr+')) conditions.push('basePrice.gte.20000000');

                if (conditions.length > 0) {
                    // This applies to the joined table due to !inner
                    // Syntax: project_configurations.basePrice.lt.5000000, ...
                    // Correct Supabase syntax for filtering on joined resource:
                    // .or('basePrice.lt.5000000, ...', { foreignTable: 'project_configurations' })

                    query = query.or(conditions.join(','), { foreignTable: 'project_configurations' });
                }
            }

            const from = (page - 1) * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;

            const { data, error, count } = await query
                .order('createdAt', { ascending: false })
                .range(from, to);

            if (error) throw error;
            // Deduplicate projects if multiple configurations matched causing multiple rows?
            // Supabase returns projects, so if one project matches multiple details, it returns one row but with joined data array.

            return { data: data as Project[], count, page, totalPages: Math.ceil((count || 0) / PAGE_SIZE) };
        },

        getById: async (id: string) => {
            const { data, error } = await supabase
                .from('projects')
                .select('*, advancedConfigurations:project_configurations(*)')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data as Project;
        },

        // Keep create/update/delete for admin mostly unchanged, 
        // but can be moved here for consistency.
        saveConfigurations: async (projectId: string, configs: any[]) => {
            if (!configs || configs.length === 0) return;

            // Map to ensure projectId is present
            const records = configs.map(c => ({
                ...c,
                projectId,
            }));

            // Upsert (requires ID to be present for update, or matching unique constraint)
            // Since we generate IDs on client or they are new, we might need a mix.
            // Simplest strategy for now: Delete all for project and re-insert?
            // Or Upsert if they have IDs.

            const { error } = await supabase
                .from('project_configurations')
                .upsert(records, { onConflict: 'id' });

            if (error) throw error;
        }
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
