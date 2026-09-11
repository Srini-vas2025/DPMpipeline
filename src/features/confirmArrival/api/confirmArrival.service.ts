import apiClient from '../../../lib/axios';
import type { ApiConfirmArrivalResponse } from '../types/confirmArrival.types';

export const fetchConfirmArrivals = async (
    physicianId: string | number,
    practiceId: string | number,
    locationId: string | number,
    signal?: AbortSignal,
): Promise<ApiConfirmArrivalResponse> => {
    const { data } = await apiClient.get<ApiConfirmArrivalResponse>(
        `/api/Order/getordersconfirmarrival/${physicianId}/${practiceId}/${locationId}`,
        { signal },
    );
    return data;
};