export type ApiOrderProgressStatus = 'green' | 'red' | '';

export interface ApiOrders {
    personId: number;
    doId: number;
    patientName: string;
    physicianName: string;
    dateCreated: string;
    product: string;
    dob: string;
    phone: string;
    progress?: ApiOrderProgressStatus[] | null;
    status: string;
}

export interface ApiAllOrdersResponse {
    data: ApiOrders[];
    total?: number;
}

// ── Mapped / UI ───────────────────────────────────────────────

export type ProgressDot = ApiOrderProgressStatus;
export type OrderProgressState = 'api' | 'inferred' | 'completed' | 'cancelled' | 'unknown';

export interface Orders {
    personId: number;
    doId: number;
    patientName: string;
    physicianName: string;
    dateCreated: string;
    product: string;
    dob: string;
    phone: string;
    progress: ProgressDot[];
    progressState: OrderProgressState;
    status: string;
}

// ── Hook ─────────────────────────────────────────────────────

export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

export interface UseAllOrdersResult {
    status: ApiStatus;
    data: Orders[];
    total: number;
    error: string | null;
    refetch: () => void;
}

// ── Store slice (expected shape from useAuthStore) ────────────

export interface OrdersStoreParams {
    physicianId: string | number;
    practiceId: string | number;
    locationId: string | number;
}
