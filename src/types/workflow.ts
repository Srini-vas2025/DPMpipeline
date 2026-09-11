export type WorkflowAction =
    | 'patient-details'
    | 'shoe-prescription'
    | 'compression-prescription'
    | 'in-person-fitting'
    | 'dispensing'
    | 'proof-of-delivery'
    | 'upload-forms'
    | 'notes'
    | 'confirm-arrival'
    | 'order-shoes'
    | 'order-compression';

export interface WorkflowContext {
    personId?: string | number;
    patientId?: string | number;
    patientName?: string;
    doId?: string | number;
    createdOn?: string;
    dob?: string;
    product?: string;
    requestId?: string | number;
    toeFiller: number;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

const optionalString = (value: unknown): string | undefined => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    return undefined;
};

const optionalIdentifier = (value: unknown): string | number | undefined =>
    typeof value === 'string' || typeof value === 'number' ? value : undefined;

export const toWorkflowContext = (value: unknown): WorkflowContext => {
    if (!isRecord(value)) return {};

    return {
        personId: optionalIdentifier(value.personId),
        patientId: optionalIdentifier(value.patientId),
        patientName: optionalString(value.patientName) ?? optionalString(value.patient),
        doId: optionalIdentifier(value.doId),
        createdOn: optionalString(value.createdOn) ?? optionalString(value.dateCreated),
        dob: optionalString(value.dob),
        product: optionalString(value.product),
        requestId: optionalIdentifier(value.requestId),
        toeFiller: optionalIdentifier(value.toeFiller),
    };
};

export const formatWorkflowDob = (value: string | undefined): string => {
    if (!value) return '';

    const isoDate = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoDate) return `${isoDate[2]}/${isoDate[3]}/${isoDate[1]}`;

    const standardDate = value.match(/^(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{4})$/);
    if (standardDate) {
        const first = Number(standardDate[1]);
        const second = Number(standardDate[2]);
        const [month, day] = first > 12 && second <= 12 ? [second, first] : [first, second];
        return `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}/${standardDate[3]}`;
    }

    return value;
};

export const WORKFLOW_TITLES: Record<WorkflowAction, string> = {
    'patient-details': 'Patient Details',
    'shoe-prescription': 'New Shoe Prescription',
    'compression-prescription': 'Compression Prescription',
    'in-person-fitting': 'Fitting & Dispensing',
    dispensing: 'Fitting & Dispensing',
    'proof-of-delivery': 'Proof of Delivery',
    'upload-forms': 'Upload Forms',
    notes: 'Notes',
    'confirm-arrival': 'Confirm Arrival',
    'order-shoes': 'Order Shoes',
    'order-compression': 'Order Compression',
};
export interface RequestConfigurationItem {
    configurationOptionId: number;
    optionValue: string;
}

export interface DoctorOrderAll {
    doId: number;
    DealerId: number;
    secondDealerId: number;

    isReturned?: boolean | null;
    is3DScan?: boolean | null;

    personId: number;
    statusNo: number;
    isFittingAppointment: boolean;
    autoSend: boolean;
    productId: number;

    priorAuthNo?: string | null;

    isOnHold: boolean;
    isEmailSent: boolean;

    attentionTo?: string | null;

    physicianId: number;
    isOneTimeReorder: boolean;
    isIncomplete: boolean;

    expiryDate: string;

    requiresPriorAuth: boolean;
    isDeductible: boolean;
    priorAuthType: number;

    isDoFilledByFitter: boolean;
    cbaGroupId: number;
    previousStatusNo: number;

    isRxonly: boolean;
    isMedicalRecordsIncluded: boolean;
    isClaimProcessVerified: boolean;

    cgmType?: string | null;
    cgmModel?: string | null;

    isRevise: boolean;

    snfHospice?: string | null;

    doPriorAuthType: number;

    isIncludedReports?: string | null;

    effectDate?: string | null;

    patientAdvocate: number;
    educatorId: number;

    patientNote?: string | null;
    payrollType?: string | null;

    tracking_Number?: string | null;

    isExamining: boolean;

    requestId: number;

    isDpmClient: boolean;

    configurations: RequestConfigurationItem[];
}

export interface UserAccount {
    userPasswordId: number;
    userName?: string | null;
    password?: string | null;
    personId: number;

    fromTime?: string | null;
    toTime?: string | null;

    personRoleId: number[];

    orgId: number;

    UniversalFitterDpmPassword?: string | null;

    physicianId: number;
    practiceId: number;
    locationId: number;

    Person: string ;
}

export interface SaveShoeRequestDto {
    request: DoctorOrderAll;
    user: UserAccount;
}
export interface Person {
    personId: number;

    organizationId: number;

    personType?: string | null;

    firstName?: string | null;
    lastName?: string | null;
    middleName?: string | null;

    emailAddress?: string | null;

    city?: string | null;
    state?: string | null;
    zip?: string | null;
    phone?: string | null;

    suffix?: string | null;

    // address: Address;
    // fittersofOrg: FittersOfOrganization;
    // isActive: boolean;
    // isSalesPerson: boolean;
    // client: Client;
    // status: boolean;
    // isEndorsed: boolean;
    // employee: Employee;

    isFitterEndorsed?: string | null;

    certification?: string | null;

    rate: number;
    vacation: boolean;

    signatureTitle?: string | null;

    isDashboardLocked: boolean;

    lastLoginDate?: string | null;

    username?: string | null;

    isReorderStarted: boolean;

    fitterNo: number;
    salesNo: number;

    dob?: string | null;

    accountManagerName?: string | null;
    accountManagerId: number;

    salesPerson?: string | null;
    salesPersonId: number;

    blogNotesId: number;
    blogNotes?: string | null;

    productId: number;
}