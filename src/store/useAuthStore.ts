/**
 * Auth store — Zustand
 *
 * Single source of truth for authentication state AND roles.
 * Extends AuthUser with a roles array so every part of the app
 * can check permissions without an extra API call.
 *
 * Usage:
 *   const { isLoggedIn, user, login, logout } = useAuthStore();
 *   const { hasRole, hasPermission }          = useAuthStore();
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppRole, ROLE_PERMISSIONS, type Permission } from '../types/roles';
import { disableDemoMode } from '../lib/demoMode';

export interface AuthUser {
    username: string;
    name?: string;
    roles: AppRole[];
    physicianId: number;
    practiceId: number;
    locationId: number;
    id: number;
    isLocationSet: boolean;
}

interface AuthState {
    isLoggedIn: boolean;
    user: AuthUser | null;
    token: string | null;

    login: (user: AuthUser, token?: string) => void;
    relogin: (physicianId: number, practiceId: number, locationId: number) => void;
    logout: () => void;

    /** Returns true if the user holds at least one of the given roles. */
    hasRole: (...roles: AppRole[]) => boolean;

    /** Returns true if the user's roles grant ALL listed permissions. */
    hasPermission: (...permissions: Permission[]) => boolean;

    /** Returns true if the user's roles grant ANY of the listed permissions. */
    hasAnyPermission: (...permissions: Permission[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            isLoggedIn: false,
            user: null,
            token: null,

            login: (user, token = '') => {
                if (token) localStorage.setItem('authToken', token);
                set({ isLoggedIn: true, user, token });
            },
            relogin: (physicianId, practiceId, locationId) => {
                const current = get().user;
                if (!current) return;
                set({
                    user: {
                        ...current,
                        physicianId,
                        practiceId,
                        locationId,
                        isLocationSet: true,
                    } as AuthUser,
                });
            },
            logout: () => {
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                disableDemoMode();
                set({ isLoggedIn: false, user: null, token: null });
            },

            hasRole: (...roles) => {
                const userRoles = get().user?.roles ?? [];
                return roles.some((r) => userRoles.includes(r));
            },

            hasPermission: (...permissions) => {
                const userRoles = get().user?.roles ?? [];
                const granted = new Set(userRoles.flatMap((role) => ROLE_PERMISSIONS[role] ?? []));
                return permissions.every((p) => granted.has(p));
            },

            hasAnyPermission: (...permissions) => {
                const userRoles = get().user?.roles ?? [];
                const granted = new Set(userRoles.flatMap((role) => ROLE_PERMISSIONS[role] ?? []));
                return permissions.some((p) => granted.has(p));
            },
        }),
        {
            name: 'softgait-auth',
            partialize: (state) => ({
                isLoggedIn: state.isLoggedIn,
                user: state.user,
                token: state.token,
            }),
        },
    ),
);
