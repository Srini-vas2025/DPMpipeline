import apiClient from '../../../lib/axios';
import type { ApiReturnOrderResponse } from '../types/returnorders.types';

export const fetchReturnOrders = async (
    physicianId: string | number,
    practiceId: string | number,
    locationId: string | number,
    signal?: AbortSignal,
): Promise<ApiReturnOrderResponse> => {
    const { data } = await apiClient.get<ApiReturnOrderResponse>(
        `/api/Order/getreturnorders/${physicianId}/${practiceId}/${locationId}`,
        { signal },
    );
    return data;
};