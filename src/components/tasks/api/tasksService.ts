/**
 * Tasks service layer — all API calls for the Tasks domain.
 *
 * Keeps components free of HTTP/fetch concerns. When the backend is ready,
 * swap the mock data here without touching any component.
 */
import apiClient from '../../../lib/axios';
import type { Task, TaskStats, ProgressDot } from '../types';

const MOCK_STATS: TaskStats = {
    pendingRx: 1,
    needsFitting: 3,
    pendingDispensingForms: 2,
};
// eslint-disable-next-line react-hooks/rules-of-hooks
/* ─── Service functions ──────────────────────────────────────────────────── */
/**
 * Fetch all tasks for the authenticated user.
 */
export const fetchTasks = async (user: string): Promise<Task[]> => {
    debugger;
    const { data } = await apiClient.get<Task[]>('/api/dpm/dpmTasks?userName=' + user);
    data.map((m: Task) => {
        orderProgress(m);
    });     
    return data;
};
/*
 *Apply progress on order process
 *
 */
export const orderProgress = (m: Task): Task => {
    m.progress = [] as ProgressDot[];
    switch (m.statusNo) {
        case -1:
            m.progress = [
                { color: 'green', tooltip: 'DO Filled' },
                { color: 'red', tooltip: 'Fitting Form Signed' },
                { color: '' },
                { color: '' },
                { color: '' },
            ];
            m.actionModal = 'notes';
            m.actionLabel = 'Notes';
            return m;
        case -2:
            m.progress = [
                { color: 'green', tooltip: 'DO Filled' },
                { color: 'red', tooltip: 'Fitting Form Signed' },
                { color: '' },
                { color: '' },
                { color: '' },
            ];
            m.actionModal = 'uploadForms';
            m.actionLabel = 'Update Info';
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
            m.actionModal = 'fillShoeRx';
            m.actionLabel = m.product == "Diabetic Shoes" ? 'Fill Shoe RX' : m.product == "Leg Compression" ? "Fill Compression Rx" : "";
            return m;
        case 628:
            m.progress = [
                { color: 'green', tooltip: 'DO Filled' },
                { color: 'red', tooltip: 'Fitting Form Signed' },
                { color: '' },
                { color: '' },
                { color: '' },
            ];
            m.actionModal = 'inperson';
            m.actionLabel = m.product == "Diabetic Shoes" ? m.fittingApptDate != "" ? 'Fit Shoes' : 'Set Appointment' : "";
            return m;
        case 1192:
            m.progress = [
                { color: 'green', tooltip: 'DO Filled' },
                { color: 'red', tooltip: 'Fitting Form Signed' },
                { color: '' },
                { color: '' },
                { color: '' },
            ];
            m.actionModal = 'inperson';
            m.actionLabel = m.product == 'Leg Compression' ? m.dispensingApptDate != "" ? 'Fit Compression' : 'Set Appointment' : "";
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
            m.actionModal = 'shoeOrder';
            m.actionLabel = 'Order Shoes';
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
            m.actionModal = 'confirmArrival';
            m.actionLabel = m.product == "Diabetic Shoes" ? 'Confirm Shoes' : m.product == "Leg Compression" ? 'Confirm Compression' : 'Confirm Arrival';
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
            m.actionModal = 'dispensing';
            m.actionLabel = m.product == "Diabetic Shoes" ? 'Dispense Shoes' : '';
            return m;
        case 3:
            m.progress = [
                { color: 'green', tooltip: 'DO Filled' },
                { color: 'green', tooltip: 'Fitting Form Signed' },
                { color: 'green', tooltip: 'Ordered' },
                { color: 'green', tooltip: 'Order Confirmed' },
                { color: 'green', tooltip: 'Order Dispening' },
                { color: 'red', tooltip: 'Confirm POD' },
            ];
            m.actionModal = 'proofOfDelivery';
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
            m.actionModal = '';
            m.actionLabel = '';
            return m;
        default:
            return m;
    }
};

/**
 * Fetch task dashboard summary statistics.
 */
export const fetchTaskStats = async (): Promise<TaskStats> => {
    //if (import.meta.env.DEV) {
    return MOCK_STATS;
    //}
    const { data } = await apiClient.get<TaskStats>('/dpmTasksStats');
    return data;
};
