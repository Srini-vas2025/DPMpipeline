/**
 * usePermissions — convenience hook for RBAC checks in components.
 *
 * Wraps the raw store functions so components get a clean, reactive API
 * without importing the store selector pattern every time.
 *
 * Usage:
 *   const { hasRole, hasPermission, hasAnyPermission, currentRoles } = usePermissions();
 *
 *   hasRole(AppRole.Admin)                          // true/false
 *   hasPermission('payroll:read', 'payroll:write')  // ALL must match
 *   hasAnyPermission('orders:read', 'orders:write') // ANY must match
 */
import { useAuthStore } from '../store/useAuthStore';
import { AppRole, ROLE_PERMISSIONS, type Permission } from '../types/roles';

export const usePermissions = () => {
    const user = useAuthStore((s) => s.user);
    const hasRole = useAuthStore((s) => s.hasRole);
    const hasPermission = useAuthStore((s) => s.hasPermission);
    const hasAnyPermission = useAuthStore((s) => s.hasAnyPermission);

    const currentRoles: AppRole[] = user?.roles ?? [];

    /** Returns the display-friendly label for the user's primary (first) role. */
    const primaryRole: AppRole | null = currentRoles[0] ?? null;

    /** Derives a flat, deduplicated set of all permissions the user currently holds. */
    const allPermissions = new Set<Permission>(
        currentRoles.flatMap((role) => ROLE_PERMISSIONS[role] ?? []),
    );

    return {
        currentRoles,
        primaryRole,
        allPermissions,
        hasRole,
        hasPermission,
        hasAnyPermission,
    };
};
