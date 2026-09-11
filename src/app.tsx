/**
 * App.tsx — Enterprise entry point.
 *
 * Pure routing orchestrator. No UI state lives here.
 * - QueryClientProvider  → TanStack Query caching
 * - ErrorBoundary        → global Sentry error catch
 * - ProtectedRoute       → authentication guard
 * - RoleGuard            → role-based authorization per route group
 * - MainLayout           → persistent Sidebar + TopBar shell
 * - ReactQueryDevtools   → visible in development only
 */
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './styles/App.css';
import queryClient from './lib/react-query';
import { ErrorBoundary } from './components/errorBoundary';
import ProtectedRoute from './components/protectedRoute';
import RoleGuard from './components/roleGuard';
import MainLayout from './layouts/mainLayout';
import { AppRole, ROUTE_ROLES } from './types/roles';

// Lazy-load route-level components for code splitting

/*const TasksPage = lazy(() => import('./features/tasks/components/tasksPage'));*/
const TasksPage = lazy(() => import('./pages/TaskListPage'));
const AppointmentsPage = lazy(() => import('./pages/AppointmentsPage'));
const OrdersListPage = lazy(() => import('./pages/OrdersListPage'));
const ReorderListPage = lazy(() => import('./pages/ReorderListPage'));
const ConfirmArrivalPage = lazy(() => import('./pages/ConfirmArrivalPage'));
const ReturnShoesPage = lazy(() => import('./pages/ReturnshoesPage'));
const PayrollPage = lazy(() => import('./pages/PayrollPage'));
const UnauthorizedPage = lazy(() => import('./pages/unauthorizedPage'));
const PatientDetailPage = lazy(() => import('./pages/PatientDetailPage'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
// Placeholder for pages that are not yet built
const Placeholder: React.FC<{ title: string }> = ({ title }) => (
    <div style={{ padding: 40, textAlign: 'center', color: '#103E52' }}>
        <h2>{title}</h2>
        <p style={{ marginTop: 12, color: '#888' }}>This page is coming soon.</p>
    </div>
);

// Full-screen loader rendered while lazy chunks are downloading
const PageLoader: React.FC = () => (
    <div
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            color: '#103E52',
        }}
    >
        Loading…
    </div>
);

import './styles/variables.css';
import './styles/global.css';
import './styles/masterpage.css';
import './styles/topbar.css';
import './styles/layout.css';
import './styles/statcards.css';
import './styles/datatable.css';
import './styles/modalcard.css';
import './styles/login.css';
// import './styles/shoe-order.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // bootstrap js
import 'bootstrap/dist/css/bootstrap.min.css'; // bootstrap styles
import '@fortawesome/fontawesome-free/css/all.min.css'; // font awesome icons
import './styles/typography.css';

const App: React.FC = () => (
    <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    {/* ── Public routes ────────────────────────────────── */}
                    <Route path="/login" element={<LandingPage />} />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />

                    {/* ── Protected routes (must be logged in) ─────────── */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<MainLayout />}>
                            {/* Default redirect */}
                            {/*  <Route index element={<Navigate to="/tasks" replace />} */}

                            {/* All authenticated roles */}
                            <Route element={<RoleGuard roles={ROUTE_ROLES['/tasks']} />}>
                                <Route path="/tasks" element={<TasksPage />} />
                                <Route path="/patient/:patientId" element={<PatientDetailPage />} />
                            </Route>

                            <Route element={<RoleGuard roles={ROUTE_ROLES['/appointments']} />}>
                                <Route path="/appointments" element={<AppointmentsPage />} />
                            </Route>

                            {/* Admin + Fitter + Biller */}
                            <Route element={<RoleGuard roles={ROUTE_ROLES['/all-orders']} />}>
                                <Route path="/all-orders" element={<OrdersListPage />} />
                            </Route>

                            {/* Admin + Fitter */}
                            <Route element={<RoleGuard roles={ROUTE_ROLES['/reorder-list']} />}>
                                <Route path="/reorder-list" element={<ReorderListPage />} />
                            </Route>

                            <Route element={<RoleGuard roles={ROUTE_ROLES['/confirm-arrival']} />}>
                                <Route path="/confirm-arrival" element={<ConfirmArrivalPage />} />
                            </Route>

                            <Route element={<RoleGuard roles={ROUTE_ROLES['/return-shoes']} />}>
                                <Route path="/return-shoes" element={<ReturnShoesPage />} />
                            </Route>

                            {/* Admin + Biller */}
                            <Route element={<RoleGuard roles={ROUTE_ROLES['/payroll']} />}>
                                <Route path="/payroll" element={<PayrollPage />} />
                            </Route>

                            {/* Admin only */}
                            <Route element={<RoleGuard roles={[AppRole.Admin]} />}>
                                <Route
                                    path="/admin"
                                    element={<Placeholder title="Admin Panel" />}
                                />
                            </Route>
                        </Route>
                    </Route>

                    {/* ── 404 fallback ──────────────────────────────────── */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Suspense>

            {/* TanStack Query Devtools — visible only in development */}
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    </ErrorBoundary>
);

export default App;
