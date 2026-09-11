// ─────────────────────────────────────────────────────────────
//  API Response Types — matches actual API response shape
// ─────────────────────────────────────────────────────────────

import type { WorkflowContext } from '../../../types/workflow';

export type ModalView = 'dispensing' | 'inperson' | 'upload' | 'print' | 'notes';

export type ActionType =
    'details' | 'inperson' | 'dispensing' | 'proofOfDelivery' | 'uploadForms' | 'notes';

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
    physician: Physician;
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

// ─────────────────────────────────────────────────────────────
//  Component Types
// ─────────────────────────────────────────────────────────────

export type TabType = 'patient' | 'shoe' | 'compression' | 'notes';

export interface SelectOption {
    value: string;
    label: string;
}

export interface ShoeFormOptions {
    diagnosis: SelectOption[];
    qualifying: SelectOption[];
    leftFootAilments: SelectOption[];
    rightFootAilments: SelectOption[];
    abnormalCharacteristics: SelectOption[];
    shoeSelection: SelectOption[];
    insertTypes: SelectOption[];
    toeFillers: SelectOption[];
}

export interface CompressionFormOptions {
    dxCodes: SelectOption[];
    products: SelectOption[];
    sides: SelectOption[];
    quantities: SelectOption[];
}

export interface ShoeFormValues {
    diagnosis: string;
    qualifying: string;
    leftFoot: string;
    rightFoot: string;
    abnormal: string;
    shoeSelection: string;
    insertType: string;
    toeFiller: string;
    accommodations: string;
    acknowledgement: boolean;
}

export interface CompressionFormValues {
    dxCode: string;
    product: string;
    side: string;
    quantity: string;
    acknowledgement: boolean;
}

// ── Internal Data Types (produced by mappers, used by component) ──

export interface PatientInfo {
    id: string | number;
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    language: string;
    languageFlag?: string;
    phone: string;
    alternatePhone?: string;
    dob: string;
    ssn: string;
    email: string;
}

export interface Physician {
    name: string;
    specialty?: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    npi: string;
    pecosEnrolled?: boolean;
}

export interface InsurancePlan {
    provider: string;
    phone: string;
    policyNumber: string;
    effectiveFrom: string;
    effectiveTo: string;
}

export interface InsuranceInfo {
    primary: InsurancePlan;
    secondary?: InsurancePlan;
}

export interface OrderProgress {
    total: number;
    completed: number;
}

export interface ActionMenuItem {
    key: ActionType;
    label: string;
    icon: string;
}

// ── Main Modal Props ──────────────────────────────────────────

export interface PatientDetailsModalProps {
    show?: boolean;
    onClose?: () => void;
    initialTab?: TabType;

    // API-driven
    personId?: string | number;
    workflowContext?: WorkflowContext;

    // Manual override (optional — skip API if provided)
    patient?: PatientInfo;
    physician?: Physician;
    insurance?: InsuranceInfo;
    orderProgress?: OrderProgress;

    // Form options
    shoeFormOptions?: ShoeFormOptions;
    compressionFormOptions?: CompressionFormOptions;

    // Initial form values
    initialShoeForm?: Partial<ShoeFormValues>;
    initialCompressionForm?: Partial<CompressionFormValues>;

    // Actions menu
    actionMenuItems?: ActionMenuItem[];

    // Callbacks
    onOrderShoes?: () => void;
    onShoeSubmit?: (values: ShoeFormValues) => void;
    onCompressionSubmit?: (values: CompressionFormValues) => void;
    onActionClick?: (action: ActionType) => void;
    onPecosChange?: (checked: boolean) => void;
}
