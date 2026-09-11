/**
 * Centralized Axios HTTP client.
 *
 * - Reads the API base URL from VITE_API_BASE_URL env variable.
 * - Automatically attaches an Authorization header when an auth token is
 *   stored in localStorage.
 * - Intercepts 401 responses and clears the session so the user is bounced
 *   back to the login screen.
 * - Forwards all unexpected errors to the application logger (Sentry).
 */
import axios from 'axios';
import { logger } from '../utils/logger';
import { isDemoMode } from './demoMode';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 15_000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/* ─── Request interceptor ─────────────────────────────────────────────────── */
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        logger.error(error, { phase: 'request-interceptor' });
        return Promise.reject(error);
    },
);

/* ─── Response interceptor ────────────────────────────────────────────────── */

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Don't log or handle cancellations — these are expected
        if (axios.isCancel(error)) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !isDemoMode()) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('isLoggedIn');
            window.location.href = '/login';
        }

        logger.error(error, {
            phase: 'response-interceptor',
            status: error.response?.status,
            url: error.config?.url,
        });

        return Promise.reject(error);
    },
);
export default apiClient;
