/**
 * Location hook for DPM components.
 *
 * Exposes a simple API for reading the browser geolocation and watching changes.
 * Preserves common comment blocks for maintainability.
 */
import { useQuery } from '@tanstack/react-query';
//import { useEffect, useRef, useState } from 'react';
import { fetchLocations } from '../api/locationService';
import { useAuthStore } from '../../../store/useAuthStore';
export const usePracticeLocations = () => {
    const id = useAuthStore((state: any) => state.user)?.id;
    const {
        data: practiceUser,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: [id],
        queryFn: () => fetchLocations(id as number),
    });
    return { practiceUser, isLoading, isError, error, refetch };
};
