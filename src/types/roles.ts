/**
 * RBAC (Role-Based Access Control) types.
 *
 * AppRole defines every role in the system. Keep this as the single source
 * of truth — backend JWT claims should map to these values.
 *
 * Permission is a fine-grained action string (e.g. 'tasks:read').
 * ROLE_PERMISSIONS maps each role to the set of actions it may perform.
 *
 * Usage:
 *   import { AppRole, ROLE_PERMISSIONS } from '@/types/roles';
 */

/* ─── Roles ──────────────────────────────────────────────────────────────── */
export enum AppRole {
    Admin = 'Admin',
    Doctor = 'Doctor',
    Fitter = 'Fitter',
    Biller = 'Biller',
}

/* ─── Fine-grained permissions ───────────────────────────────────────────── */
export type Permission =
    // Tasks
    | 'tasks:read'
    | 'tasks:write'
    | 'tasks:delete'
    // Orders
    | 'orders:read'
    | 'orders:write'
    | 'orders:approve'
    // Patients
    | 'patients:read'
    | 'patients:write'
    | 'patients:delete'
    // Inventory
    | 'inventory:read'
    | 'inventory:write'
    // Reports / Payroll
    | 'reports:read'
    | 'payroll:read'
    | 'payroll:write'
    // Admin
    | 'admin:users'
    | 'admin:settings';

/* ─── Role → Permission mapping ──────────────────────────────────────────── */
export const ROLE_PERMISSIONS: Record<AppRole, Permission[]> = {
    [AppRole.Admin]: [
        'tasks:read',
        'tasks:write',
        'tasks:delete',
        'orders:read',
        'orders:write',
        'orders:approve',
        'patients:read',
        'patients:write',
        'patients:delete',
        'inventory:read',
        'inventory:write',
        'reports:read',
        'payroll:read',
        'payroll:write',
        'admin:users',
        'admin:settings',
    ],
    [AppRole.Doctor]: [
        'tasks:read',
        'tasks:write',
        'orders:read',
        'patients:read',
        'patients:write',
        'reports:read',
    ],
    [AppRole.Fitter]: [
        'tasks:read',
        'tasks:write',
        'orders:read',
        'orders:write',
        'patients:read',
        'inventory:read',
    ],
    [AppRole.Biller]: [
        'tasks:read',
        'orders:read',
        'orders:approve',
        'patients:read',
        'reports:read',
        'payroll:read',
        'payroll:write',
    ],
};

/* ─── Route access config ─────────────────────────────────────────────────── */
/**
 * Maps each app route path to the roles that may access it.
 * An empty array means ALL authenticated users can access the route.
 */
export const ROUTE_ROLES: Record<string, AppRole[]> = {
    '/tasks': [], //all roles
    '/appointments': [],
    '/login': [],
    '/all-orders': [AppRole.Admin, AppRole.Doctor, AppRole.Fitter, AppRole.Biller],
    '/reorder-list': [AppRole.Admin, AppRole.Doctor, AppRole.Fitter],
    '/confirm-arrival': [AppRole.Admin, AppRole.Doctor, AppRole.Fitter],
    '/return-shoes': [AppRole.Admin, AppRole.Doctor, AppRole.Fitter],
    '/payroll': [AppRole.Admin, AppRole.Doctor, AppRole.Biller],
    '/admin': [AppRole.Admin],
};
