/**
 * RoleGate — UI-level conditional rendering by role / permission.
 *
 * Use this inside any component to show or hide JSX based on the user's
 * roles or permissions — without cluttering the component with store calls.
 *
 * Examples:
 *   // Show only to Admins
 *   <RoleGate roles={[AppRole.Admin]}>
 *       <DeleteButton />
 *   </RoleGate>
 *
 *   // Show to anyone with payroll:write permission
 *   <RoleGate permissions={['payroll:write']}>
 *       <ApprovePayrollButton />
 *   </RoleGate>
 *
 *   // Show a fallback for unauthorized users
 *   <RoleGate roles={[AppRole.Admin]} fallback={<p>Admins only</p>}>
 *       <AdminPanel />
 *   </RoleGate>
 *
 *   // Require ALL listed permissions (default) or ANY (requireAll={false})
 *   <RoleGate permissions={['orders:read', 'orders:write']} requireAll>
 *       <OrderEditor />
 *   </RoleGate>
 */
import React, { type ReactNode } from 'react';
import { usePermissions } from '../hooks/usePermissions';
import type { AppRole, Permission } from '../types/roles';

interface RoleGateProps {
    /** At least one matching role allows access. */
    roles?: AppRole[];
    /** Permission check; combined with requireAll flag. */
    permissions?: Permission[];
    /** If true, ALL permissions must match. Default: true. */
    requireAll?: boolean;
    /** Rendered when the user lacks access. Defaults to null (nothing). */
    fallback?: ReactNode;
    children: ReactNode;
}

const RoleGate: React.FC<RoleGateProps> = ({
    roles = [],
    permissions = [],
    requireAll = true,
    fallback = null,
    children,
}) => {
    const { hasRole, hasPermission, hasAnyPermission } = usePermissions();

    let allowed = true;

    if (roles.length > 0) {
        allowed = hasRole(...roles);
    }

    if (allowed && permissions.length > 0) {
        allowed = requireAll ? hasPermission(...permissions) : hasAnyPermission(...permissions);
    }

    return <>{allowed ? children : fallback}</>;
};

export default RoleGate;
