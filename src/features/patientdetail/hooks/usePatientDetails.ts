import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { fetchPatientDetails } from '../api/patientdetails.service';
import type {
    ApiPatientDetailsResponse,
    ApiStatus,
    UsePatientDetailsResult,
} from '../types/patientmodal.api.types';

export const usePatientDetails = (
    personId: string | number | null,
): UsePatientDetailsResult => {
    const [status, setStatus] = useState<ApiStatus>('idle');
    const [data, setData] = useState<ApiPatientDetailsResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(() => {
        if (!personId) return;
        setStatus('loading');
        setError(null);

        const controller = new AbortController();

        fetchPatientDetails(personId, controller.signal)
            .then((result) => {
                setData(result);
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
    }, [personId]);

    useEffect(() => {
        const cleanup = load();
        return cleanup;
    }, [load]);

    return { status, data, error, refetch: load };
};