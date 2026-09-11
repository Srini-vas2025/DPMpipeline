/**
 * Shared QueryClient instance with sensible enterprise defaults.
 *
 * - staleTime: 5 min  — prevents refetching data that is still fresh.
 * - retry: 2          — retry failed requests twice before surfacing errors.
 * - refetchOnWindowFocus: false — avoids noisy refetches in clinical workflows.
 */
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            retry: 2,
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 0,
        },
    },
});

export default queryClient;
