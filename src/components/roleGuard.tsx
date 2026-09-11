/**
 * RoleGuard — route-level role enforcement component.
 *
 * Wraps a <Route> subtree. If the authenticated user does not hold at least
 * one of the required roles, they are redirected to /unauthorized instead of
 * seeing a blank screen or a cryptic error.
 *
 * Usage in App.tsx:
 *   <Route element={<RoleGuard roles={[AppRole.Admin, AppRole.Biller]} />}>
 *       <Route path="/payroll" element={<PayrollPage />} />
 *   </Route>
 *
 * When `roles` is an empty array, ALL authenticated users are allowed —
 * behaves identically to a plain <ProtectedRoute>.
 */
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';
import type { AppRole } from '../types/roles';

interface RoleGuardProps {
    /** Roles allowed to enter this subtree. Empty = all authenticated users. */
    roles: AppRole[];
}

const RoleGuard: React.FC<RoleGuardProps> = ({ roles }) => {
    const { hasRole } = usePermissions();
    const location = useLocation();

    // No role restriction → pass through
    if (roles.length === 0) return <Outlet />;

    // User has at least one of the required roles → allow
    if (hasRole(...roles)) return <Outlet />;

    // Access denied → redirect to /unauthorized, preserving the attempted path
    return <Navigate to="/unauthorized" state={{ from: location, requiredRoles: roles }} replace />;
};

export default RoleGuard;
