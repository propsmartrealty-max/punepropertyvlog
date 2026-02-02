
import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Project, Builder, Locality } from '../types';
import { api, ProjectFilters } from '../services/api';

interface DataContextType {
    // We now expose hooks or query results directly, but to keep the interface compatible 
    // for now we'll mock the "all projects" behavior or change how consumers use it.
    // However, to truly support scalability, we should encourage components to use 
    // `useProjects` directly. For this transition, we will expose the "latest" projects
    // or keep this context mainly for Admin CRUD operations which might still need global updates.

    // Changing the interface to be more Hook-centric
    projects: Project[]; // Backward compatibility
    builders: Builder[];
    localities: Locality[]; // Phase 3: Expose localities
    isLoading: boolean;
    error: Error | null;

    // CRUD
    addProject: (project: Project) => Promise<void>;
    updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    addBuilder: (builder: Builder) => Promise<void>;
    updateBuilder: (id: string, updates: Partial<Builder>) => Promise<void>;
    deleteBuilder: (id: string) => Promise<void>;


    // Compare Logic
    compareList: string[];
    addToCompare: (id: string) => void;
    removeFromCompare: (id: string) => void;
    clearCompare: () => void;

    refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();

    // Compare Logic State
    const [compareList, setCompareList] = React.useState<string[]>(() => {
        const saved = localStorage.getItem('propsmart_compare');
        return saved ? JSON.parse(saved) : [];
    });

    const addToCompare = (id: string) => {
        setCompareList(prev => {
            if (prev.includes(id)) return prev;
            if (prev.length >= 3) {
                // Optional: Notify user max 3
                return prev;
            }
            const newList = [...prev, id];
            localStorage.setItem('propsmart_compare', JSON.stringify(newList));
            return newList;
        });
    };

    const removeFromCompare = (id: string) => {
        setCompareList(prev => {
            const newList = prev.filter(item => item !== id);
            localStorage.setItem('propsmart_compare', JSON.stringify(newList));
            return newList;
        });
    };

    const clearCompare = () => {
        setCompareList([]);
        localStorage.removeItem('propsmart_compare');
    };

    // Fetch initial data
    const projectsQuery = useQuery({
        queryKey: ['projects', 'initial'],
        queryFn: () => api.projects.list(1, {}),
    });

    const buildersQuery = useQuery({
        queryKey: ['builders'],
        queryFn: () => api.builders.list(),
    });

    // Phase 3: Fetch Localities globally for Deal Engine
    const localitiesQuery = useQuery({
        queryKey: ['localities'],
        queryFn: async () => {
            const { supabase } = await import('../services/supabase');
            const { data } = await supabase.from('localities').select('*');
            return data || [];
        }
    });

    // Mutations
    const addProjectMutation = useMutation({
        mutationFn: async (project: Project) => {
            const { supabase } = await import('../services/supabase');
            const { id, advancedConfigurations, ...data } = project;
            const payload = id.startsWith('p') || id === '' ? data : { ...data, id };
            const { data: inserted, error } = await supabase.from('projects').insert([payload]).select().single();
            if (error) throw error;
            if (advancedConfigurations && advancedConfigurations.length > 0) {
                await api.projects.saveConfigurations(inserted.id, advancedConfigurations);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
    });

    const updateProjectMutation = useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Project> }) => {
            const { supabase } = await import('../services/supabase');
            const { advancedConfigurations, ...data } = updates;
            const { error } = await supabase.from('projects').update(data).eq('id', id);
            if (error) throw error;
            if (advancedConfigurations) {
                await api.projects.saveConfigurations(id, advancedConfigurations);
            }
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
            localities: localitiesQuery.data || [],
            isLoading: projectsQuery.isLoading || buildersQuery.isLoading || localitiesQuery.isLoading,
            error: (projectsQuery.error as Error) || (buildersQuery.error as Error) || null,

            compareList,
            addToCompare,
            removeFromCompare,
            clearCompare,

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
