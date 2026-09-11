import * as Sentry from '@sentry/react';

export const initLogger = () => {
    Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN || '', // Placeholder for actual DSN
        integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
        // Tracing
        tracesSampleRate: 1.0,
        // Session Replay
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
    });
};

export const logger = {
    info: (message: string, context?: Record<string, any>) => {
        console.info(`[INFO]: ${message}`, context);
        Sentry.addBreadcrumb({
            category: 'info',
            message,
            data: context,
            level: 'info',
        });
    },
    warn: (message: string, context?: Record<string, any>) => {
        console.warn(`[WARN]: ${message}`, context);
        Sentry.addBreadcrumb({
            category: 'warn',
            message,
            data: context,
            level: 'warning',
        });
    },
    error: (error: Error | string, context?: Record<string, any>) => {
        console.error(`[ERROR]:`, error, context);
        if (typeof error === 'string') {
            Sentry.captureMessage(error, { level: 'error', extra: context });
        } else {
            Sentry.captureException(error, { extra: context });
        }
    },
};
