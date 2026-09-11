import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { fetchAllOrders } from '../api/order.service';
import type { ApiOrders, ApiStatus, Orders, UseAllOrdersResult } from '../types/order.types';
import { inferOrderProgress } from '../utils/orderProgress';

const formatDate = (raw: string | null | undefined): string => {
    if (!raw) return '';
    const date = new Date(raw);
    if (isNaN(date.getTime())) return raw;
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
};

const mapOrders = (rows: ApiOrders[]): Orders[] =>
    rows.map((row) => ({
        ...inferOrderProgress(row.status ?? '', row.progress),
        personId: row.personId,
        doId: row.doId,
        patientName: row.patientName ?? '',
        physicianName: row.physicianName ?? '',
        dateCreated: formatDate(row.dateCreated),
        product: row.product ?? '',
        dob: formatDate(row.dob),
        phone: row.phone ?? '',
        status: row.status ?? '',
    }));

export const useAllOrders = (
    physicianId: string | number | null,
    practiceId: string | number | null,
    locationId: string | number | null,
): UseAllOrdersResult => {
    const [status, setStatus] = useState<ApiStatus>('idle');
    const [data, setData] = useState<Orders[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(() => {
        if (!physicianId || !practiceId || !locationId) return;
        const controller = new AbortController();

        setStatus('loading');
        setError(null);

        fetchAllOrders(physicianId, practiceId, locationId, controller.signal)
            .then((response) => {
                const mapped = mapOrders(response.data ?? []);
                setData(mapped);
                setTotal(response.total ?? mapped.length);
                setStatus('success');
            })
            .catch((err: unknown) => {
                // Silence cancellations — expected on unmount / param change
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
