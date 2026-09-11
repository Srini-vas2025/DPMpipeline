export interface ApiConfirmArrivalRow {
    personId: number;
    doId: number;
    requestId: number;
    patientName: string;
    poNumber: string;
    manufacturer: string;
    style: string;
    size: string;
    width: string;
    status: string;
    filterStatus: string;
    lastUpdated: string;
    expires: string;
}

export interface ApiConfirmArrivalResponse {
    data: ApiConfirmArrivalRow[];
    success: boolean;
    message: string | null;
    total?: number;
}

export interface ConfirmArrivalRow {
    personId: number;
    doId: number;
    requestId: number;
    patientName: string;
    poNumber: string;
    manufacturer: string;
    style: string;
    size: string;
    width: string;
    status: string;
    filterStatus: string;
    lastUpdated: string;
    expires: string;
}


export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

export interface UseConfirmArrivalResult {
    status: ApiStatus;
    data: ConfirmArrivalRow[];
    total: number;
    error: string | null;
    refetch: () => void;
}