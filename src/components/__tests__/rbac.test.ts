/**
 * Unit tests — RBAC (Role-Based Access Control)
 *
 * Covers:
 *  - hasRole() — single and multiple role checks
 *  - hasPermission() — ALL-match permission checks
 *  - hasAnyPermission() — ANY-match permission checks
 *  - Role isolation — e.g. Doctor cannot access payroll
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { act } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { AppRole } from '../../types/roles';

const resetStore = (roles: AppRole[]) => {
    useAuthStore.setState({
        isLoggedIn: true,
        user: {
            username: 'test@softgait.com',
            roles: roles,
            physicianId: 0,
            practiceId: 0,
            locationId: 0,
            id: 0,
            isLocationSet: false,
        },
        token: 'mock-token',
    });
};

beforeEach(() => {
    useAuthStore.setState({ isLoggedIn: false, user: null, token: null });
});

/* ─── hasRole ──────────────────────────────────────────────────────────── */
describe('hasRole()', () => {
    it('returns true when user has the exact role', () => {
        act(() => resetStore([AppRole.Admin]));
        expect(useAuthStore.getState().hasRole(AppRole.Admin)).toBe(true);
    });

    it('returns false when user does not have the role', () => {
        act(() => resetStore([AppRole.Doctor]));
        expect(useAuthStore.getState().hasRole(AppRole.Admin)).toBe(false);
    });

    it('returns true when any one of the listed roles matches', () => {
        act(() => resetStore([AppRole.Fitter]));
        expect(useAuthStore.getState().hasRole(AppRole.Admin, AppRole.Fitter)).toBe(true);
    });

    it('returns false for unauthenticated user', () => {
        expect(useAuthStore.getState().hasRole(AppRole.Admin)).toBe(false);
    });
});

/* ─── hasPermission (ALL must match) ───────────────────────────────────── */
describe('hasPermission()', () => {
    it('Admin has payroll:read and payroll:write', () => {
        act(() => resetStore([AppRole.Admin]));
        expect(useAuthStore.getState().hasPermission('payroll:read', 'payroll:write')).toBe(true);
    });

    it('Doctor does NOT have payroll:read', () => {
        act(() => resetStore([AppRole.Doctor]));
        expect(useAuthStore.getState().hasPermission('payroll:read')).toBe(false);
    });

    it('Biller has payroll:read but NOT admin:users', () => {
        act(() => resetStore([AppRole.Biller]));
        expect(useAuthStore.getState().hasPermission('payroll:read')).toBe(true);
        expect(useAuthStore.getState().hasPermission('admin:users')).toBe(false);
    });

    it('returns false when even one permission is missing', () => {
        act(() => resetStore([AppRole.Fitter]));
        // Fitter has orders:read but NOT payroll:write
        expect(useAuthStore.getState().hasPermission('orders:read', 'payroll:write')).toBe(false);
    });
});

/* ─── hasAnyPermission (ANY must match) ────────────────────────────────── */
describe('hasAnyPermission()', () => {
    it('returns true when at least one permission matches', () => {
        act(() => resetStore([AppRole.Doctor]));
        // Doctor has tasks:read but not payroll:read
        expect(useAuthStore.getState().hasAnyPermission('payroll:read', 'tasks:read')).toBe(true);
    });

    it('returns false when no permissions match', () => {
        act(() => resetStore([AppRole.Doctor]));
        expect(useAuthStore.getState().hasAnyPermission('payroll:read', 'admin:users')).toBe(false);
    });
});

/* ─── Multi-role user ──────────────────────────────────────────────────── */
describe('multi-role user', () => {
    it('accumulates permissions from all roles', () => {
        act(() => resetStore([AppRole.Doctor, AppRole.Biller]));
        // Doctor has tasks:read, Biller has payroll:read — both should be granted
        expect(useAuthStore.getState().hasPermission('tasks:read')).toBe(true);
        expect(useAuthStore.getState().hasPermission('payroll:read')).toBe(true);
    });
});
