export interface ApiReturnOrderRow {
    personId: number;
    doId: number;
    requestId: number;
    patientName: string;
    expiry: string;
    insole: string;
    poNumber: string;
    productName: string;
    filterStatus: string;
}

export interface ApiReturnOrderResponse {
    data: ApiReturnOrderRow[];
    success: boolean;
    message: string | null;
    total?: number;
}

export interface ReturnOrderRow {
    personId: number;
    doId: number;
    requestId: number;
    patientName: string;
    expiry: string;
    insole: string;
    poNumber: string;
    productName: string;
    filterStatus: string;
}

export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

export interface UseReturnOrdersResult {
    status: ApiStatus;
    data: ReturnOrderRow[];
    total: number;
    error: string | null;
    refetch: () => void;
}