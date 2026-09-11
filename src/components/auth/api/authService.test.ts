/**
 * Unit tests — authService
 *
 * Uses vitest + msw (mock service worker) patterns via axios-mock-adapter
 * to simulate the backend without a real network, keeping tests fast and deterministic.
 *
 * Note: We use vi.mock to stub the logger so Sentry is never initialised in tests.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { authClient, loginUser } from './authService';
import { AppRole } from '../../../types/roles';

// Silence logger in tests
vi.mock('../../../utils/logger', () => ({
    logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));
/* ─── Helpers ────────────────────────────────────────────────────────────── */
/**
 * Build a minimal JWT with the given payload (unsigned — fine for test decoding).
 */
const makeJwt = (payload: Record<string, unknown>): string => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body = btoa(JSON.stringify(payload));
    return `${header}.${body}.fake-sig`;
};

/* ─── Setup ──────────────────────────────────────────────────────────────── */

// Intercept axios calls made by any axios instance
const mock = new MockAdapter(authClient);

beforeEach(() => {
    mock.reset();
    localStorage.clear();
});

/* ─── Tests ──────────────────────────────────────────────────────────────── */

describe('loginUser()', () => {
    it('extracts email and roles from the JWT payload (short claim key)', async () => {
        const token = makeJwt({
            email: 'admin@softgait.com',
            name: 'Admin User',
            role: AppRole.Admin,
        });

        mock.onPost('/api/Auth/empLogin').reply(200, { token });

        const result = await loginUser({ username: 'admin@softgait.com', password: 'secret' });

        expect(result.token).toBe(token);
        expect(result.user.username).toBe('admin@softgait.com');
        expect(result.user.roles).toContain(AppRole.Admin);
    });

    it('extracts multiple roles from an array claim', async () => {
        const token = makeJwt({
            email: 'multi@softgait.com',
            role: [AppRole.Doctor, AppRole.Biller],
        });

        mock.onPost('/api/Auth/empLogin').reply(200, { token });

        const result = await loginUser({ username: 'multi@softgait.com', password: 'secret' });

        expect(result.user.roles).toContain(AppRole.Doctor);
        expect(result.user.roles).toContain(AppRole.Biller);
    });

    it('extracts roles from the ASP.NET Core long-form claim key', async () => {
        const token = makeJwt({
            username: 'fitter@softgait.com',
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': AppRole.Fitter,
        });

        mock.onPost('/api/Auth/empLogin').reply(200, { token });

        const result = await loginUser({ username: 'fitter@softgait.com', password: 'secret' });

        expect(result.user.roles).toContain(AppRole.Fitter);
    });

    it('falls back to roles field in response body when token has no role claim', async () => {
        const token = makeJwt({ email: 'biller@softgait.com' });

        mock.onPost('/api/Auth/empLogin').reply(200, { token, roles: [AppRole.Biller] });

        const result = await loginUser({ username: 'biller@softgait.com', password: 'secret' });

        expect(result.user.roles).toContain(AppRole.Biller);
    });

    it('stores the refresh token in localStorage when present', async () => {
        const token = makeJwt({ username: 'user@softgait.com', role: AppRole.Doctor });

        mock.onPost('/api/Auth/empLogin').reply(200, { token, refreshToken: 'refresh-xyz' });

        await loginUser({ username: 'user@softgait.com', password: 'secret' });

        expect(localStorage.getItem('refreshToken')).toBe('refresh-xyz');
    });

    it('throws on 401 Unauthorized', async () => {
        mock.onPost('/api/Auth/empLogin').reply(401, { message: 'Invalid credentials' });

        await expect(
            loginUser({ username: 'bad@softgait.com', password: 'wrong' }),
        ).rejects.toThrow();
    });

    it('throws when no token is returned', async () => {
        mock.onPost('/api/Auth/empLogin').reply(200, { token: '' });

        await expect(
            loginUser({ username: 'user@softgait.com', password: 'secret' }),
        ).rejects.toThrow('No token received');
    });
});
