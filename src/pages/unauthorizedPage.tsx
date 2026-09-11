/**
 * UnauthorizedPage — shown when a user navigates to a route they lack
 * the required role for.
 *
 * Displays:
 *  - Which roles are needed
 *  - The user's current roles
 *  - A back button and a home link
 */
import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';
import type { AppRole } from '../types/roles';

interface LocationState {
    from?: { pathname: string };
    requiredRoles?: AppRole[];
}

const UnauthorizedPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentRoles } = usePermissions();

    const state = location.state as LocationState | null;
    const requiredRoles = state?.requiredRoles ?? [];
    const attemptedPath = state?.from?.pathname ?? '';

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                {/* Icon */}
                <div style={styles.iconRing}>
                    <i className="fas fa-shield-halved" style={styles.icon} />
                </div>

                <h1 style={styles.heading}>Access Denied</h1>

                <p style={styles.subtext}>
                    You don&apos;t have permission to view
                    {attemptedPath ? (
                        <>
                            {' '}
                            <code style={styles.code}>{attemptedPath}</code>
                        </>
                    ) : (
                        ' this page'
                    )}
                    .
                </p>

                {requiredRoles.length > 0 && (
                    <div style={styles.section}>
                        <p style={styles.label}>Required roles</p>
                        <div style={styles.chips}>
                            {requiredRoles.map((r) => (
                                <span key={r} style={{ ...styles.chip, ...styles.chipRequired }}>
                                    {r}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div style={styles.section}>
                    <p style={styles.label}>Your roles</p>
                    <div style={styles.chips}>
                        {currentRoles.length > 0 ? (
                            currentRoles.map((r) => (
                                <span key={r} style={{ ...styles.chip, ...styles.chipCurrent }}>
                                    {r}
                                </span>
                            ))
                        ) : (
                            <span style={styles.none}>None assigned</span>
                        )}
                    </div>
                </div>

                <div style={styles.actions}>
                    <button style={styles.backBtn} onClick={() => navigate(-1)}>
                        <i className="fas fa-arrow-left" /> &nbsp;Go Back
                    </button>
                    <Link to="/tasks" style={styles.homeLink}>
                        <i className="fas fa-house" /> &nbsp;Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

/* ─── Inline styles (no extra CSS file needed) ─────────────────────────── */
const styles: Record<string, React.CSSProperties> = {
    wrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--color-bg, #f5f7fa)',
    },
    card: {
        background: '#fff',
        borderRadius: 16,
        padding: '48px 40px',
        maxWidth: 480,
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
    },
    iconRing: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 72,
        height: 72,
        borderRadius: '50%',
        background: '#fef3f2',
        marginBottom: 20,
    },
    icon: { fontSize: 32, color: '#d92d20' },
    heading: { fontSize: 24, fontWeight: 700, color: '#101828', marginBottom: 8 },
    subtext: { fontSize: 15, color: '#667085', marginBottom: 24 },
    code: { background: '#f2f4f7', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace' },
    section: { marginBottom: 20, textAlign: 'left' },
    label: {
        fontSize: 12,
        fontWeight: 600,
        color: '#98a2b3',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: 8,
    },
    chips: { display: 'flex', flexWrap: 'wrap', gap: 8 },
    chip: { padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 500 },
    chipRequired: { background: '#fef3f2', color: '#b42318' },
    chipCurrent: { background: '#f0f9ff', color: '#026aa2' },
    none: { fontSize: 13, color: '#98a2b3' },
    actions: { display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 },
    backBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '10px 20px',
        borderRadius: 8,
        border: '1px solid #d0d5dd',
        background: '#fff',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: 14,
        color: '#344054',
    },
    homeLink: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '10px 20px',
        borderRadius: 8,
        textDecoration: 'none',
        background: '#103E52',
        color: '#fff',
        fontWeight: 600,
        fontSize: 14,
    },
};

export default UnauthorizedPage;
