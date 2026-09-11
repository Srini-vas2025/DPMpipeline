import apiClient from '../../../lib/axios';
import type { ApiReorderResponse } from '../types/reorder.types';

export const fetchReorders = async (
    physicianId: string | number,
    practiceId: string | number,
    locationId: string | number,
    signal?: AbortSignal,
): Promise<ApiReorderResponse> => {
    
    const { data } = await apiClient.get<ApiReorderResponse>(
        `/api/Order/getreorders/${physicianId}/${practiceId}/${locationId}`,
        { signal },
    );
    
    return data;
};