export interface ApiPayrollRow {
    assignedId: number;
    personId: number;
    doId: number;
    requestId: number;
    patientName: string;
    work: string;
    date: string;
    allocatedTime: string;
    compensation: number;
    payDate: string;
    paymentType: string;
    commissionType: string;
    status: number;
    isPaid: boolean;
    checkNo: string;
    product: string;
    hcpcs: string;
}

export interface ApiPayrollResponse {
    data: ApiPayrollRow[];
    success: boolean;
    message: string | null;
    total?: number;
    datesDropdown: PayrollRow[][];
    payrollDate: string;
    totalAmount: number;
}

export interface PayrollRow {
    personId: number;
    doId: number;
    requestId: number;
    patientName: string;
    work: string;
    date: string;
    allocatedTime: string;
    compensation: number;
    payDate: string;
}

export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

export interface UsePayrollResult {
    status: ApiStatus;
    data: PayrollRow[];
    total: number;
    error: string | null;
    datesDropdown: string[];
    payrollDate: string|null;
    totalAmount: number;
    refetch: () => void;
}
