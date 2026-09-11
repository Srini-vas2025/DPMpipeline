/**
 * Task domain types — co-located with feature, not dumped in a global types folder.
 */

export type DotColor = 'green' | 'yellow' | 'red' | '';

export interface ProgressDot {
    color: DotColor;
    tooltip?: string;
}

export interface Task {
    id: number;
    progress: ProgressDot[];
    expDanger?: boolean;
    actionLabel: string;
    actionModal?: string;
    patientId: string;
    patient: string;
    product: string;
    status: string;
    expirayDate: string;
    createdOn: string;
    doId: string;
    requestId: string;
    personId: string;
    statusNo: number;
    isSuspended: string;
    isMissingInfo: string;
    fittingApptDate: string;
    dispensingApptDate: string;
    dob: string;
}

export interface TasksFilters {
    searchQuery: string;
    activeFilters: string[];
    sortAsc: boolean;
    currentPage: number;
}

export interface TaskStats {
    pendingRx: number;
    needsFitting: number;
    pendingDispensingForms: number;
}
