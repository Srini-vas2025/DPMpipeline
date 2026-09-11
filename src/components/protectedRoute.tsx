/**
 * ProtectedRoute — Route-level guard component.
 *
 * Redirects unauthenticated users to /login transparently.
 * Wrap any <Route> that requires authentication with this.
 *
 * Usage:
 *   <Route element={<ProtectedRoute />}>
 *       <Route path="/tasks" element={<TasksPage />} />
 *   </Route>
 */
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const ProtectedRoute: React.FC = () => {
    const { isLoggedIn } = useAuthStore();
    const location = useLocation();

    if (!isLoggedIn) {
        // Preserve the page the user was trying to reach so we can redirect
        // them back after they successfully log in.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
