// ─────────────────────────────────────────────────────────────
//  All Orders – API Service
// ─────────────────────────────────────────────────────────────
import apiClient from '../../../lib/axios';
import type { ApiAllOrdersResponse } from '../types/order.types';

export const fetchAllOrders = async (
    physicianId: string | number,
    practiceId: string | number,
    locationId: string | number,
    signal?: AbortSignal,
): Promise<ApiAllOrdersResponse> => {
    const { data } = await apiClient.get<ApiAllOrdersResponse>(
        `/api/Order/${physicianId}/${practiceId}/${locationId}`,
        { signal },
    );
    return data;
};
