import { useQuery } from '@tanstack/react-query';
import { fetchProductConfiguration } from '../api/shoeStyle.service';

export const useProductConfiguration = (
    requestId?: number | string | null,
) => {
    return useQuery({
        queryKey: ['productConfiguration', requestId],
        queryFn: ({ signal }) =>
            fetchProductConfiguration(
                1,
                requestId!,
                signal,
            ),
        enabled:
            requestId !== undefined &&
            requestId !== null,
    });
};