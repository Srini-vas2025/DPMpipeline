import * as React from 'react';
import * as Sentry from '@sentry/react';
import { logger } from '../utils/logger';

/*
 * Props for `ErrorBoundary`.
 *
 * - `children` - React node(s) rendered inside the boundary.
 * - `fallback` - Optional React node to display when an error is caught.
 */
interface Props {
    children?: React.ReactNode;
    fallback?: React.ReactElement;
}

/**
 * Internal state for `ErrorBoundary`.
 *
 * - `hasError` - Indicates whether an error has been captured by this boundary.
 */
interface State {
    hasError: boolean;
}

/**
 * A React error boundary that:
 * - Tracks and renders a local fallback UI when a render-time error occurs.
 * - Logs the error via the local `logger`.
 * - Wraps children with Sentry's `ErrorBoundary` to ensure downstream reporting and richer telemetry.
 *
 * Usage:
 * <ErrorBoundary fallback={<MyFallback />}>
 *   <MyComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    /**
     * React lifecycle: derive state from an error thrown in a descendant component.
     * Marks the boundary as having encountered an error so the local fallback UI is rendered.
     *
     * @param error - The error that was thrown (used here only to satisfy the type contract)
     * @returns New state with `hasError: true`
     */
    public static getDerivedStateFromError(error: Error): State {
        void error; // mark parameter as used to satisfy the linter
        return { hasError: true };
    }

    /**
     * React lifecycle: called after an error has been thrown by a descendant component.
     * Perform side-effects such as logging and additional telemetry reporting.
     *
     * @param error - The error that was thrown.
     * @param errorInfo - Additional React error information (component stack).
     */
    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log locally for troubleshooting and attach errorInfo to aid debugging.
        logger.error(error, { errorInfo });
    }

    /**
     * Render the local fallback UI if an error has been captured.
     * Otherwise, wrap children in Sentry's `ErrorBoundary` to ensure errors are reported to Sentry.
     */
    public render() {
        if (this.state.hasError) {
            return (
                this.props.fallback || (
                    <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
                        <h2>Oops, there is an error!</h2>
                        <p>Something went wrong. Our team has been notified.</p>
                    </div>
                )
            );
        }

        // Use Sentry's boundary to catch any other unhandled crashes and report appropriately downstream limit.
        return (
            <Sentry.ErrorBoundary fallback={this.props.fallback || <p>An error has occurred</p>}>
                {this.props.children}
            </Sentry.ErrorBoundary>
        );
    }
}
