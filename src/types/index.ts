export interface NavItem {
    id: string;
    label: string;
    icon: string; // path relative to /assets/images/
    selectBar: string; // path relative to /assets/images/
    path: string;
}

export type PageKey =
    | 'patient-nav'
    | 'appointments-nav'
    | 'equipment-nav'
    | 'orders-nav'
    | 'inventory-nav'
    | 'fitter-nav'
    | 'reports-nav';

export const PAGE_MAP: Record<PageKey, string> = {
    'patient-nav': 'tasks',
    'appointments-nav': 'appointments',
    'equipment-nav': 'all-orders',
    'orders-nav': 'reorder-list',
    'inventory-nav': 'confirm-arrival',
    'fitter-nav': 'return-shoes',
    'reports-nav': 'payroll',
};

export const NAV_ITEMS: NavItem[] = [
    {
        id: 'patient-nav',
        label: 'Tasks',
        icon: '/assets/images/tasks-nav-icon.png',
        selectBar: '/assets/images/nav-select-bar.png',
        path: '/tasks',
    },
    {
        id: 'equipment-nav',
        label: 'All Orders',
        icon: '/assets/images/all-orders-nav-icon.png',
        selectBar: '/assets/images/nav-select-bar.png',
        path: '/all-orders',
    },
    {
        id: 'orders-nav',
        label: 'Reorder List',
        icon: '/assets/images/reorder-list-nav-icon.png',
        selectBar: '/assets/images/nav-select-bar.png',
        path: '/reorder-list',
    },
    {
        id: 'inventory-nav',
        label: 'Confirm Arrival',
        icon: '/assets/images/confirm-arrival-nav-icon.png',
        selectBar: '/assets/images/nav-select-bar.png',
        path: '/confirm-arrival',
    },
    {
        id: 'fitter-nav',
        label: 'Return Shoes',
        icon: '/assets/images/return-shoes-nav-icon.png',
        selectBar: '/assets/images/nav-select-bar.png',
        path: '/return-shoes',
    },
    {
        id: 'appointments-nav',
        label: 'Appointments',
        icon: '/assets/images/appointments-nav-icon.png',
        selectBar: '/assets/images/nav-select-bar.png',
        path: '/appointments',
    },
    {
        id: 'reports-nav',
        label: 'Payroll',
        icon: '/assets/images/payroll-nav-icon.png',
        selectBar: '/assets/images/nav-select-bar.png',
        path: '/payroll',
    },
];
