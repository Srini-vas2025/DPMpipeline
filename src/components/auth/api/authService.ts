/**
 * Auth service — API layer for authentication.
 *
 * Calls the authentication endpoint on VITE_API_BASE_URL.
 * Maps the response JWT to the AuthUser shape used by the Zustand auth store.
 *
 * JWT Role mapping:
 *   The JWT payload is decoded client-side (no library needed — uses atob())
 *   to extract the `role` claim. Supported claim key formats:
 *     - Short: "role" | "roles"
 *     - ASP.NET Core long-form: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
 *   Unknown role strings are silently ignored so new backend roles don't crash
 *   the frontend until the AppRole enum is updated.
 */
import axios from 'axios';
import type { AuthUser } from '../../../store/useAuthStore';
import { AppRole } from '../../../types/roles';
import { logger } from '../../../utils/logger';

/**
 * Dedicated Axios instance for auth endpoints.
 * Local development uses the sandbox origin configured in .env.local.
 */
export const authClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
    timeout: 15_000,
    headers: { 'Content-Type': 'application/json' },
});

export interface LoginCredentials {
    username: string;
    password: string;
}

/** Shape returned by POST /api/Auth/login — adjust field names to match your API. */
export interface LoginApiResponse {
    token: string; // JWT access token
    refreshToken?: string; // Optional refresh token
    expiresIn?: number; // Token lifetime in seconds
    // Some APIs also return user info directly:
    username?: string;
    name?: string;
    roles?: string[];
}

type LoginApiEnvelope = LoginApiResponse & { data?: LoginApiResponse };

export interface LoginResult {
    user: AuthUser;
    token: string;
}

/* ─── JWT decoder ────────────────────────────────────────────────────────── */

/**
 * Decodes a JWT without verifying the signature (browser-side only).
 * Signature verification is performed by the backend on every API call.
 */
const decodeJwt = (token: string): Record<string, unknown> => {
    try {
        const payload = token.split('.')[1];
        // Base-64 URL → standard Base-64
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join(''),
        );
        return JSON.parse(json);
    } catch {
        logger.warn('Failed to decode JWT payload', { token: token.slice(0, 20) + '…' });
        return {};
    }
};

/**
 * Extracts AppRole values from JWT claims.
 * The `role` claim may be a string or an array of strings.
 * Standard ASP.NET Core claim key: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
 * Short-form key also supported: "role" or "roles"
 */
const extractRoles = (claims: Record<string, unknown>): AppRole[] => {
    const ROLE_CLAIM_KEYS = [
        'role',
        'roles',
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
    ];

    let rawRoles: string[] = [];

    for (const key of ROLE_CLAIM_KEYS) {
        if (claims[key]) {
            const val = claims[key];
            rawRoles = Array.isArray(val) ? (val as string[]) : [val as string];
            break;
        }
    }

    const validRoles = Object.keys(AppRole) as string[];
    return rawRoles.filter((r) => validRoles.find((v) => v === r)).map((r) => r as AppRole);
};

/* ─── Service function ───────────────────────────────────────────────────── */

/**
 * Authenticates the user against the backend API.
 *
 * POST /Auth/login
 * Body: { email, password }
 *
 * @throws {AuthError} with a user-friendly message on failure
 */
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResult> => {
    const { data } = await authClient.post<LoginApiEnvelope>('/api/Auth/empLogin', credentials);
    const payload = (data.data ?? data) as LoginApiResponse;
    const { token } = payload;

    if (!token) {
        throw new Error('No token received from the server.');
    }
    // Store refresh token if present
    if (payload.refreshToken) {
        localStorage.setItem('refreshToken', payload.refreshToken);
    }

    // Decode the JWT to extract user info and roles
    const claims = decodeJwt(token);
    // Extract email — standard OIDC + ASP.NET Core claim keys
    const username = payload.username ?? (claims['username'] as string) ?? credentials.username;

    // Extract name
    const name = username;

    // Extract and map roles
    let roles = extractRoles(claims);

    // Fall back to roles returned directly in the response body
    if (roles.length === 0 && payload.roles?.length) {
        const validRoles = Object.keys(AppRole) as string[];
        roles = payload.roles
            .filter((role) => validRoles.includes(role))
            .map((role) => role as AppRole);
    }

    const id = Number(claims['sub']) || 0;
    const physicianId = Number(claims['physicianId']) || 0;
    const practiceId = Number(claims['practiceId']) || 0;
    const locationId = Number(claims['locationId']) || 0;
    logger.info('User logged in', { username, roles });

    return {
        token,
        user: {
            username,
            name,
            roles,
            physicianId,
            practiceId,
            locationId,
            id,
            isLocationSet: false,
        },
    };
};
