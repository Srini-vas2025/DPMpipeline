import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { fetchReorders } from '../api/reorder.service';
import type {
    ApiStatus,
    ApiReorderRow,
    ReorderRow,
    UseReorderResult,
} from '../types/reorder.types';

const formatDate = (raw: string | null | undefined): string => {
    if (!raw) return '';
    const date = new Date(raw);
    if (isNaN(date.getTime())) return raw;
    return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
    });
};

const mapReorders = (rows: ApiReorderRow[]): ReorderRow[] =>
    rows.map((row) => ({
        personId: row.personId,
        doId: row.doId,
        patientName: row.patientName ?? '',
        lastDispensed: formatDate(row.lastDispensed),
        insurance: row.insurance ?? '',
        filterStatus: row.filterStatus ?? '',
    }));


export const useReorder = (
    physicianId: string | number | null,
    practiceId: string | number | null,
    locationId: string | number | null,
): UseReorderResult => {
    const [status, setStatus] = useState<ApiStatus>('idle');
    const [data, setData] = useState<ReorderRow[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(() => {
        if (physicianId === null || practiceId === null || locationId === null) return;

        const controller = new AbortController();

        setStatus('loading');
        setError(null);
        
        fetchReorders(physicianId, practiceId, locationId, controller.signal)
            .then((response) => {
                const mapped = mapReorders(response.data ?? []);
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
        const cleanup = load();
        return cleanup;
    }, [load]);

    return { status, data, total, error, refetch: load };
};