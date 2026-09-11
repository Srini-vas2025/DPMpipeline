/**
 * Tasks service layer — all API calls for the Tasks domain.
 *
 * Keeps components free of HTTP/fetch concerns. When the backend is ready,
 * swap the mock data here without touching any component.
 */
import apiClient from '../../../lib/axios';
import { isDemoMode } from '../../../lib/demoMode';
import type { Task, TaskStats, ProgressDot } from '../types';

const DEMO_TASKS: Task[] = [
    {
        id: 1,
        progress: [],
        actionLabel: '',
        patientId: 'DPM-1001',
        patient: 'Jordan Lee',
        product: 'Diabetic Shoes',
        status: 'Prescription received',
        expirayDate: '2026-10-18',
        createdOn: '2026-07-08',
        doId: 'DO-1001',
        requestId: 'REQ-1001',
        personId: 'P-1001',
        statusNo: 612,
        isSuspended: '',
        isMissingInfo: '',
        fittingApptDate: '',
        dispensingApptDate: '',
        dob: '1958-04-12',
        toeFiller: 0,
    },
    {
        id: 2,
        progress: [],
        actionLabel: '',
        patientId: 'DPM-1002',
        patient: 'Morgan Davis',
        product: 'Diabetic Shoes',
        status: 'Needs fitting appointment',
        expirayDate: '2026-09-24',
        createdOn: '2026-07-10',
        doId: 'DO-1002',
        requestId: 'REQ-1002',
        personId: 'P-1002',
        statusNo: 628,
        isSuspended: '',
        isMissingInfo: '',
        fittingApptDate: '',
        dispensingApptDate: '',
        dob: '1966-11-03',
        toeFiller: 0,

    },
    {
        id: 3,
        progress: [],
        actionLabel: '',
        patientId: 'DPM-1003',
        patient: 'Casey Robinson',
        product: 'Diabetic Shoes',
        status: 'Ready for order',
        expirayDate: '2026-11-05',
        createdOn: '2026-07-12',
        doId: 'DO-1003',
        requestId: 'REQ-1003',
        personId: 'P-1003',
        statusNo: 629,
        isSuspended: '',
        isMissingInfo: '',
        fittingApptDate: '2026-07-16',
        dispensingApptDate: '',
        dob: '1952-08-21',
        toeFiller: 0,

    },
    {
        id: 4,
        progress: [],
        actionLabel: '',
        patientId: 'DPM-1004',
        patient: 'Taylor Wilson',
        product: 'Leg Compression',
        status: 'Awaiting arrival',
        expirayDate: '2026-12-01',
        createdOn: '2026-07-14',
        doId: 'DO-1004',
        requestId: 'REQ-1004',
        personId: 'P-1004',
        statusNo: 2,
        isSuspended: '',
        isMissingInfo: '',
        fittingApptDate: '2026-07-18',
        dispensingApptDate: '',
        dob: '1970-02-17',
        toeFiller: 0,

    },
    {
        id: 5,
        progress: [],
        actionLabel: '',
        patientId: 'DPM-1005',
        patient: 'Riley Thompson',
        product: 'Diabetic Shoes',
        status: 'Ready to dispense',
        expirayDate: '2026-10-09',
        createdOn: '2026-07-15',
        doId: 'DO-1005',
        requestId: 'REQ-1005',
        personId: 'P-1005',
        statusNo: 3,
        isSuspended: '',
        isMissingInfo: '',
        fittingApptDate: '2026-07-17',
        dispensingApptDate: '2026-07-25',
        dob: '1961-06-29',
        toeFiller: 0,
    },

];

const DEMO_STATS: TaskStats = {
    pendingRx: 1,
    needsFitting: 2,
    needsScheduling: 1,
    pendingDispensingForms: 2,
};

/* ─── Service functions ──────────────────────────────────────────────────── */
/**
 * Fetch all tasks for the authenticated user.
 * TODO: replace with `apiClient.get<Task[]>('/tasks')` when backend is ready.
 */
export const fetchTasks = async (
    physicianId: number,
    practiceId: number,
    locationId: number,
): Promise<Task[]> => {
    if (isDemoMode()) {
        return DEMO_TASKS.map((task) => orderProgress({ ...task, progress: [] }));
    }

    const { data } = await apiClient.get<Task[]>(
        `/api/dpm/dpmTasks?physicianId=${physicianId}&&practiceId=${practiceId}&&locationId=${locationId}`,
    );
    debugger;
    data.map((m: Task) => {
        orderProgress(m);
    });
    console.log(data);
    return data;
};
/*
 *Apply progress on order process
 *
 */
export const orderProgress = (m: Task): Task => {
    m.progress = [] as ProgressDot[];
    m.actionModal = undefined;
    m.actionLabel = '';
    const normalizedProduct = m.product.trim().toLowerCase();
    const isShoeOrder = normalizedProduct.includes('shoe');
    const isCompressionOrder = normalizedProduct.includes('compression');
    const hasMissingInfo =
        m.isMissingInfo === true ||
        m.isMissingInfo === 1 ||
        (typeof m.isMissingInfo === 'string' &&
            ['1', 'true', 'yes'].includes(m.isMissingInfo.trim().toLowerCase()));

    switch (m.statusNo) {
        case -1:
            return m;
        case 612:
            m.progress = [
                { color: 'red', tooltip: 'DO Filled' },
                { color: '', tooltip: '' },
                { color: '' },
                { color: '' },
                { color: '' },
                { color: '' },
            ];
            if (isShoeOrder) {
                m.actionModal = 'shoe-prescription';
                m.actionLabel = 'Fill Shoe Rx';
            } else if (isCompressionOrder) {
                m.actionModal = 'compression-prescription';
                m.actionLabel = 'Fill Compression Rx';
            }

            return m;
        case 628:
            m.progress = [
                { color: 'green', tooltip: 'DO Filled' },
                { color: 'red', tooltip: 'Fitting Form Signed' },
                { color: '' },
                { color: '' },
                { color: '' },
                { color: '' },
            ];
            m.actionModal = 'in-person-fitting';
            m.actionLabel = isShoeOrder
                ? m.fittingApptDate
                    ? 'Fit Shoes'
                    : 'Set Appointment'
                : '';
            return m;
        case 1192:
            m.progress = [
                { color: 'green', tooltip: 'DO Filled' },
                { color: 'red', tooltip: 'Fitting Form Signed' },
                { color: '' },
                { color: '' },
                { color: '' },
                { color: '' },
            ];
            m.actionModal = 'in-person-fitting';
            m.actionLabel = isCompressionOrder
                ? m.dispensingApptDate
                    ? 'Fit Compression'
                    : 'Set Appointment'
                : '';

            return m;
        case 629:
            m.progress = [
                { color: 'green', tooltip: 'DO Filled' },
                { color: 'green', tooltip: 'Fitting Form Signed' },
                { color: 'red', tooltip: 'Need To Order' },
                { color: '' },
                { color: '' },
                { color: '' },
            ];
            m.status = 'Ready For Order';
            if (isShoeOrder) {
                m.actionModal = 'order-shoes';
                m.actionLabel = 'Order Shoes';
            } else if (isCompressionOrder) {
                m.actionModal = 'order-compression';
                m.actionLabel = 'Order Compression';
            }
            return m;

        case 2:
            m.progress = [
                { color: 'green', tooltip: 'DO Filled' },
                { color: 'green', tooltip: 'Fitting Form Signed' },
                { color: 'green', tooltip: 'Ordered' },
                { color: 'red', tooltip: 'Confirm Arrival' },
                { color: '' },
                { color: '' },
            ];
            m.actionModal = 'confirm-arrival';
            m.actionLabel = isShoeOrder
                ? 'Confirm Shoes'
                : isCompressionOrder
                  ? 'Confirm Compression'
                  : 'Confirm Arrival';
            return m;
        case 3:
            m.progress = [
                { color: 'green', tooltip: 'DO Filled' },
                { color: 'green', tooltip: 'Fitting Form Signed' },
                { color: 'green', tooltip: 'Ordered' },
                { color: 'green', tooltip: 'Order Confirmed' },
                { color: 'red', tooltip: 'Order Dispening' },
                { color: '' },
            ];
            if (isShoeOrder) {
                m.actionModal = 'dispensing';
                m.actionLabel = 'Dispense Shoes';
            }
            return m;
        case 5:
        case 76:
            m.progress = [
                { color: 'green', tooltip: 'DO Filled' },
                { color: 'green', tooltip: 'Fitting Form Signed' },
                { color: 'green', tooltip: 'Ordered' },
                { color: 'green', tooltip: 'Order Confirmed' },
                { color: 'green', tooltip: 'Order Dispening' },
                { color: 'red', tooltip: 'Confirm POD' },
            ];
            m.actionModal = 'proof-of-delivery';
            m.actionLabel = 'Proof of Delivery';
            return m;
        case 10:
            m.progress = [
                { color: 'green', tooltip: 'DO Filled' },
                { color: 'green', tooltip: 'Fitting Form Signed' },
                { color: 'green', tooltip: 'Ordered' },
                { color: 'green', tooltip: 'Ordered Confirmed' },
                { color: 'green', tooltip: 'Order Dispensed' },
                { color: 'green', tooltip: 'Confirm POD' },
            ];
            m.actionModal = undefined;
            m.actionLabel = '';
            return m;
        default:
            m.progress = [
                { color: '' },
                { color: '' },
                { color: '' },
                { color: '' },
                { color: '' },
                { color: '' },
            ];
            m.actionModal = hasMissingInfo ? 'upload-forms' : 'notes';
            m.actionLabel = hasMissingInfo ? 'Update Info' : 'View Notes';
            m.status = hasMissingInfo ? 'Update Info' : 'View Notes';
            return m;
    }
};
/**
 * Fetch task dashboard summary statistics.
 */
export const fetchTaskStats = async (
    physicianId: number,
    practiceId: number,
    locationId: number,
): Promise<TaskStats> => {
    if (isDemoMode()) return DEMO_STATS;

    const { data } = await apiClient.get<TaskStats>(
        `/api/dpm/dpmStats?physicianId=${physicianId}&&practiceId=${practiceId}&&locationId=${locationId}`,
    );
    return data;
};
