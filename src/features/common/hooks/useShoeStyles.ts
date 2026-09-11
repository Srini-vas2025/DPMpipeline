/**
 * useShoeStyles — TanStack Query hooks for the Shoe Styles domain.
 *
 * Components import these hooks instead of calling the service directly.
 * This gives automatic caching, loading/error states, and background refetching.
 *
 * Usage:
 *   const { shoeStyles, isLoading, error } = useShoeStyles ();
 */
import { useQuery, useMutation } from '@tanstack/react-query';
import {
    fetchAllShoeStyles,
    fetchUserShoeStyles,
    saveFavoriteUserShoeStyles,
} from '../api/shoeStyle.service';
import { useAuthStore } from '../../../store/useAuthStore';
import type { ShoeProduct } from '../types/shoeStyle.types';
export const SHOE_STYLES_QUERY_KEY = ['shoe-styles'] as const;
export const USER_SHOE_STYLES_QUERY_KEY = ['user-shoe-styles'] as const;

export const useUserShoeStyles = (shoeStyle: ShoeProduct) => {
    const user = useAuthStore((state) => state.user);
    const {
        data: shoeStyles = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: [...USER_SHOE_STYLES_QUERY_KEY, shoeStyle],
        queryFn: () =>
            fetchUserShoeStyles(
                user?.physicianId || 0,
                shoeStyle.gender,
                shoeStyle.manufacturer,
                shoeStyle.closureType,
            ),
    });

    return { shoeStyles, isLoading, isError, error, refetch };
};

export const useAllShoeStyles = (shoeStyle: ShoeProduct) => {
    const user = useAuthStore((state) => state.user);
    const {
        data: shoeStyles = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: [shoeStyle],
        queryFn: () =>
            fetchAllShoeStyles(
                user?.physicianId || 0,
                shoeStyle.gender,
                shoeStyle.manufacturer,
                shoeStyle.closureType,
            ),
    });
     debugger;
    // const { shoeStyles: userShoeStyles } = useUserShoeStyles(shoeStyle);
    // const allShoeStyles = [
    //     ...shoeStyles,
    //     ...userShoeStyles.filter((s) => !shoeStyles.find((us) => us.id === s.id)),
    // ];

    return { shoeStyles: shoeStyles, isLoading, isError, error, refetch };
};

export const useSaveFavoriteStyle = (shoeStyle: ShoeProduct) => {
    const user = useAuthStore((state) => state.user);

    // Use useMutation for side effects (POST/PUT/DELETE) instead of useQuery
    const { mutate, isPending, isError, error } = useMutation({
        mutationFn: () => saveFavoriteUserShoeStyles(user?.physicianId || 0, shoeStyle || null),
    });

    return { mutate, isPending, isError, error };
};
