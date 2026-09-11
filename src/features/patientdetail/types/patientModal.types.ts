// ─────────────────────────────────────────────────────────────
//  API Response Types — matches actual API response shape
// ─────────────────────────────────────────────────────────────
export type ModalView = 'dispensing' | 'inperson' | 'upload' | 'print' | 'notes';
export type ActionType =
    | "details"
    | "inperson"
    | "dispensing"
    | "proofOfDelivery"
    | "uploadForms"
    | "notes";
export interface ApiPatientInfo {
    dpmPhysicianId: number;
    orgId: number;
    assignedId: number;
    personId: number;
    suffix: string | null;
    firstName?: string | null;
    lastName?: string | null;
    address?: string | null;
    address2?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
    language?: string | null;
    phone?: string | null;
    alternatePhone?: string | null;
    dob?: string | null;
    ssn?: string | null;
    email?: string | null;
    [key: string]: any;
}

export interface ApiInsurancePlan {
    patientInsuranceId: number;
    insuranceId: number;
    personId: number;
    isPrimary: number;
    policyNo: string | null;
    providerName?: string | null;
    phone?: string | null;
    effectiveFrom?: string | null;
    effectiveTo?: string | null;
    [key: string]: any;
}

export interface ApiInsuranceInfo {
    primary: ApiInsurancePlan | null;
    secondary: ApiInsurancePlan | null;
}

export interface ApiOrderProgress {
    total: number;
    completed: number;
}

export interface ApiPatientData {
    patientInfo: ApiPatientInfo;
    insurancePlan: ApiInsurancePlan;
    insuranceInfo: ApiInsuranceInfo;
    orderProgress: ApiOrderProgress;
    shoeFormValues: Record<string, any>;
    shoeFormOptions: Record<string, any>;
    compressionFormValues: Record<string, any>;
    compressionFormOptions: Record<string, any>;
}

// Top-level API envelope
export interface ApiPatientDetailsResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: ApiPatientData;
}

export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

export interface UsePatientDetailsResult {
    status: ApiStatus;
    error: string | null;
    data: ApiPatientDetailsResponse | null;
    refetch: () => void;
}