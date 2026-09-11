import { create } from 'zustand';

interface TaskFilterState {
    activeFilters: string[];
    setActiveFilters: (filters: string[]) => void;
}

export const useTaskFilterStore = create<TaskFilterState>((set) => ({
    activeFilters: [],

    setActiveFilters: (filters) =>
        set({
            activeFilters: Array.isArray(filters) ? filters : [],
        }),
}));
