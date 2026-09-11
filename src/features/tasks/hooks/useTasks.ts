/**
 * useTasks — TanStack Query hooks for the Tasks domain.
 *
 * Components import these hooks instead of calling the service directly.
 * This gives automatic caching, loading/error states, and background refetching.
 *
 * Usage:
 *   const { tasks, isLoading, error } = useTasks();
 */
import { useQuery } from '@tanstack/react-query';
import { fetchTasks } from '../api/tasksService';
import { useAuthStore } from '../../../store/useAuthStore';
export const TASKS_QUERY_KEY = ['tasks'] as const;
export const TASK_STATS_QUERY_KEY = ['tasks', 'stats'] as const;

export const useTasks = () => {
    const user = useAuthStore((state) => state.user);
    const {
        data: tasks = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: [...TASKS_QUERY_KEY, user],
        queryFn: () =>
            fetchTasks(user?.physicianId || 0, user?.practiceId || 0, user?.locationId || 0),
    });

    return { tasks, isLoading, isError, error, refetch };
};

// export const useTaskStats = () => {
//     debugger;
//     const user = useAuthStore((state) => state.user);
//     const {
//         data: stats,
//         isLoading,
//         isError,
//     } = useQuery({
//         queryKey: [...TASK_STATS_QUERY_KEY, user],
//         queryFn: () =>
//             fetchTaskStats(user?.physicianId || 0, user?.practiceId || 0, user?.locationId || 0),
//     });

//     return { stats, isLoading, isError };
// };
