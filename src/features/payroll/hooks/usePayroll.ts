import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { fetchPayroll } from '../api/payroll.service';
import type {
    ApiStatus,
    ApiPayrollRow,
    PayrollRow,
    UsePayrollResult,
} from '../types/payroll.types';

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

const mapPayroll = (rows: ApiPayrollRow[]): PayrollRow[] =>
    rows.map((row) => ({
        personId: row.personId,
        doId: row.doId,
        requestId: row.requestId,
        patientName: row.patientName ?? '',
        work: row.work ?? '',
        date: formatDate(row.date),
        allocatedTime: row.allocatedTime ?? '',
        compensation: row.compensation ?? '',
        payDate: formatDate(row.payDate),
    }));

export const usePayroll = (
    physicianId: string | number | null,
    practiceId: string | number | null,
    locationId: string | number | null,
    payrollSearch: string | number,
    searchString: string | number | null,
): UsePayrollResult => {
    const [status, setStatus] = useState<ApiStatus>('idle');
    const [data, setData] = useState<PayrollRow[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [datesDropdown, setDates] = useState<string[]>([]);
    const [payrollDate, setPayrollDate] = useState<string | null>(null);
    const [totalAmount, setTotalAmount] = useState<number>(0);

    const load = useCallback(() => {
        if (physicianId === null || practiceId === null || locationId === null) return;
        console.log(physicianId);
        console.log(payrollSearch);
        console.log(searchString);
        const controller = new AbortController();

        setStatus('loading');
        setError(null);

        fetchPayroll(physicianId, practiceId, locationId, payrollSearch, searchString)
            .then((response) => {
                const mapped = mapPayroll(response.data ?? []);
                setData(mapped);
                setTotal(response.data.length ?? mapped.length);
                setStatus('success');
                setDates(response.datesDropdown);
                setPayrollDate(response.payrollDate);
                setTotalAmount(response.totalAmount);
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
    }, [physicianId, practiceId, locationId, payrollSearch, searchString]);

    useEffect(() => {
        const cleanup = load();
        return cleanup;
    }, [load]);

    return { status, data, total, error, datesDropdown, payrollDate, totalAmount, refetch: load };
};
