
import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Project, Builder } from '../types';
import { api, ProjectFilters } from '../services/api';

interface DataContextType {
    // We now expose hooks or query results directly, but to keep the interface compatible 
    // for now we'll mock the "all projects" behavior or change how consumers use it.
    // However, to truly support scalability, we should encourage components to use 
    // `useProjects` directly. For this transition, we will expose the "latest" projects
    // or keep this context mainly for Admin CRUD operations which might still need global updates.

    // Changing the interface to be more Hook-centric
    projects: Project[]; // Backward compatibility: will return first page or needed ones
    builders: Builder[];
    isLoading: boolean;
    error: Error | null;

    // CRUD
    addProject: (project: Project) => Promise<void>;
    updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    addBuilder: (builder: Builder) => Promise<void>;
    updateBuilder: (id: string, updates: Partial<Builder>) => Promise<void>;
    deleteBuilder: (id: string) => Promise<void>;

    refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();

    // Fetch initial data for "Home" or general usage (e.g. latest 10)
    // In a real robust app, individual pages should trigger their own queries.
    // For backward compatibility with the current "load everything" approach, 
    // we might need to adjust, but let's try to stick to "fetching what's needed".
    // For now, let's fetch the first page of projects to populate the "projects" array.
    const projectsQuery = useQuery({
        queryKey: ['projects', 'initial'],
        queryFn: () => api.projects.list(1, {}),
    });

    const buildersQuery = useQuery({
        queryKey: ['builders'],
        queryFn: () => api.builders.list(),
    });

    // Mutations
    const addProjectMutation = useMutation({
        mutationFn: async (project: Project) => {
            // We need to implement create in api.ts or use supabase directly here
            // For now, assuming direct supabase call or adding to api.ts. 
            // To keep it simple let's use the previous logic but wrapped.
            // Ideally we move this to api.ts in next step.
            const { supabase } = await import('../services/supabase');
            const { id, ...data } = project;
            const payload = id.startsWith('p') || id === '' ? data : project;
            const { error } = await supabase.from('projects').insert([payload]);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
    });

    const updateProjectMutation = useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Project> }) => {
            const { supabase } = await import('../services/supabase');
            const { error } = await supabase.from('projects').update(updates).eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
    });

    const deleteProjectMutation = useMutation({
        mutationFn: async (id: string) => {
            const { supabase } = await import('../services/supabase');
            const { error } = await supabase.from('projects').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
    });

    // Builders Mutations
    const addBuilderMutation = useMutation({
        mutationFn: async (builder: Builder) => {
            const { supabase } = await import('../services/supabase');
            const { id, ...data } = builder;
            const payload = id.startsWith('b') || id === '' ? data : builder;
            const { error } = await supabase.from('builders').insert([payload]);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['builders'] })
    });

    const updateBuilderMutation = useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Builder> }) => {
            const { supabase } = await import('../services/supabase');
            const { error } = await supabase.from('builders').update(updates).eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['builders'] })
    });

    const deleteBuilderMutation = useMutation({
        mutationFn: async (id: string) => {
            const { supabase } = await import('../services/supabase');
            const { error } = await supabase.from('builders').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['builders'] })
    });


    return (
        <DataContext.Provider value={{
            projects: projectsQuery.data?.data || [],
            builders: buildersQuery.data || [],
            isLoading: projectsQuery.isLoading || buildersQuery.isLoading,
            error: (projectsQuery.error as Error) || (buildersQuery.error as Error) || null,

            addProject: (p) => addProjectMutation.mutateAsync(p),
            updateProject: (id, u) => updateProjectMutation.mutateAsync({ id, updates: u }),
            deleteProject: (id) => deleteProjectMutation.mutateAsync(id),

            addBuilder: (b) => addBuilderMutation.mutateAsync(b),
            updateBuilder: (id, u) => updateBuilderMutation.mutateAsync({ id, updates: u }),
            deleteBuilder: (id) => deleteBuilderMutation.mutateAsync(id),

            refreshData: () => {
                queryClient.invalidateQueries();
            }
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
