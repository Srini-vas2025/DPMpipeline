export interface ApiReorderRow {
    personId: number;
    doId: number;
    patientName: string;
    lastDispensed: string;
    insurance: string;
    filterStatus: string;
}

export interface ApiReorderResponse {
    data: ApiReorderRow[];
    success: boolean;
    message: string | null;
    total?: number;
}


export interface ReorderRow {
    personId: number;
    doId: number;
    patientName: string;
    lastDispensed: string;
    insurance: string;
    filterStatus: string;
}


export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

export interface UseReorderResult {
    status: ApiStatus;
    data: ReorderRow[];
    total: number;
    error: string | null;
    refetch: () => void;
}