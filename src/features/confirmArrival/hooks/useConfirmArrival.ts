import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { fetchConfirmArrivals } from '../api/confirmArrival.service';
import type {
    ApiStatus,
    ApiConfirmArrivalRow,
    ConfirmArrivalRow,
    UseConfirmArrivalResult,
} from '../types/confirmArrival.types';
import { toStandardCase } from '../utils/confirmArrivalText';

const mapConfirmArrivals = (rows: ApiConfirmArrivalRow[]): ConfirmArrivalRow[] =>
    rows.map((row) => ({
        personId: row.personId,
        doId: row.doId,
        requestId: row.requestId,
        patientName: toStandardCase(row.patientName ?? ''),
        poNumber: row.poNumber ?? '',
        manufacturer: toStandardCase(row.manufacturer ?? ''),
        style: toStandardCase(row.style ?? ''),
        size: row.size ?? '',
        width: row.width ?? '',
        status: toStandardCase(row.status ?? ''),
        filterStatus: toStandardCase(row.filterStatus ?? ''),
        lastUpdated: row.lastUpdated ?? '',
        expires: row.expires ?? '',
    }));

export const useConfirmArrival = (
    physicianId: string | number | null,
    practiceId: string | number | null,
    locationId: string | number | null,
): UseConfirmArrivalResult => {
    const [status, setStatus] = useState<ApiStatus>('idle');
    const [data, setData] = useState<ConfirmArrivalRow[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(() => {
        if (physicianId === null || practiceId === null || locationId === null) return;

        const controller = new AbortController();

        setStatus('loading');
        setError(null);

        fetchConfirmArrivals(physicianId, practiceId, locationId, controller.signal)
            .then((response) => {
                const mapped = mapConfirmArrivals(response.data ?? []);
                setData(mapped);
                setTotal(response.total ?? mapped.length);
                setStatus('success');
            })
            .catch((err: unknown) => {
                if (axios.isCancel(err)) return;
                if (err instanceof Error && err.message === 'canceled') return;

                const message = axios.isAxiosError(err)
                    ? (err.response?.data?.message ?? err.message)
                    : err instanceof Error
                      ? err.message
                      : 'Something went wrong.';

                setError(message);
                setStatus('error');
            });

        return () => controller.abort();
    }, [physicianId, practiceId, locationId]);

    useEffect(() => {
        // The shared loader owns both initial loading state and manual refetch behavior.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        const cleanup = load();
        return cleanup;
    }, [load]);

    return { status, data, total, error, refetch: load };
};
