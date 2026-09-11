/**
 * PatientDetailPage — dedicated patient details page.
 *
 * This route loads a single patient by ID and renders a full-page view
 * rather than relying on the shared modal. It is intended to replace the
 * existing modal-only patient details experience for direct navigation.
 
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPatientDetail, PatientDetail } from '../../components/patientDetail/api/patientDetailService';

const formatDate = (iso?: string) => {
    if (!iso) return 'N/A';
    const date = new Date(iso);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const renderContact = (contact: { type: string; value: string }, index: number) => (
    <div key={`${contact.type}-${index}`} style={styles.contactRow}>
        <span style={styles.contactType}>{contact.type}</span>
        <span style={styles.contactValue}>{contact.value}</span>
    </div>
);

const PatientDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { patientId } = useParams<{ patientId: string }>();

    const {
        data: patient,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery<PatientDetail, Error>(
        ['patient', patientId],
        () => getPatientDetail(patientId ?? ''),
        {
            enabled: Boolean(patientId),
        },
    );

    if (!patientId) {
        return (
            <div style={styles.emptyState}>
                <h1>Patient not found</h1>
                <p>Missing patient identifier in the URL.</p>
                <button style={styles.primaryButton} onClick={() => navigate('/tasks')}>
                    Back to Tasks
                </button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div style={styles.emptyState}>
                <h1>Loading patient details…</h1>
            </div>
        );
    }

    if (isError) {
        return (
            <div style={styles.emptyState}>
                <h1>Unable to load patient details</h1>
                <p>{error?.message ?? 'An unexpected error occurred.'}</p>
                <div style={styles.buttonRow}>
                    <button style={styles.secondaryButton} onClick={() => refetch()}>
                        Retry
                    </button>
                    <button style={styles.primaryButton} onClick={() => navigate('/tasks')}>
                        Back to Tasks
                    </button>
                </div>
            </div>
        );
    }

    const fullName = `${patient?.firstName ?? ''} ${patient?.lastName ?? ''}`.trim() || 'Unknown Patient';

    return (
        <div className="page-wrap">
            <div style={styles.headerRow}>
                <div>
                    <button style={styles.linkButton} onClick={() => navigate('/tasks')}>
                        <i className="fas fa-arrow-left" /> Back to Tasks
                    </button>
                    <h1 style={styles.pageTitle}>Patient Details</h1>
                    <p style={styles.pageSubtitle}>{fullName}</p>
                </div>
                <div style={styles.actionRow}>
                    <button style={styles.primaryButton} onClick={() => navigate('/tasks')}>
                        Return to Tasks
                    </button>
                </div>
            </div>

            <div style={styles.grid}>
                <section style={styles.card}>
                    <div style={styles.cardHeader}>Patient Summary</div>
                    <div style={styles.row}>
                        <span style={styles.label}>Name</span>
                        <span>{fullName}</span>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.label}>Medical Record #</span>
                        <span>{patient.medicalRecordNumber ?? 'N/A'}</span>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.label}>Date of Birth</span>
                        <span>{formatDate(patient.dob)}</span>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.label}>Gender</span>
                        <span>{patient.gender ?? 'N/A'}</span>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.label}>Last Visit</span>
                        <span>{formatDate(patient.lastVisit)}</span>
                    </div>
                </section>

                <section style={styles.card}>
                    <div style={styles.cardHeader}>Contact Information</div>
                    <div style={styles.row}>
                        <span style={styles.label}>Address</span>
                        <span>{patient.address ?? 'N/A'}</span>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.label}>Contacts</span>
                        <div style={styles.contactList}>
                            {patient.contacts?.length ? (
                                patient.contacts.map(renderContact)
                            ) : (
                                <span style={styles.emptyText}>No contact details available.</span>
                            )}
                        </div>
                    </div>
                </section>

                <section style={styles.cardWide}>
                    <div style={styles.cardHeader}>Notes</div>
                    <div style={styles.notesBox}>{patient.notes ?? 'No notes available for this patient.'}</div>
                </section>
            </div>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: 40,
        color: 'var(--text-color)',
    },
    pageTitle: {
        margin: '10px 0 6px',
        fontSize: 32,
        fontWeight: 700,
        color: 'var(--primary-color)',
    },
    pageSubtitle: {
        margin: 0,
        color: 'var(--muted)',
        fontSize: 15,
    },
    headerRow: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        marginBottom: 24,
    },
    actionRow: {
        display: 'flex',
        gap: 12,
        alignItems: 'center',
    },
    grid: {
        display: 'grid',
        gap: 20,
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    },
    card: {
        background: 'var(--background-color)',
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 2px 20px rgba(18, 38, 63, 0.06)',
    },
    cardWide: {
        background: 'var(--background-color)',
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 2px 20px rgba(18, 38, 63, 0.06)',
        gridColumn: '1 / -1',
    },
    cardHeader: {
        marginBottom: 18,
        fontSize: 16,
        fontWeight: 700,
        color: 'var(--primary-color)',
    },
    row: {
        display: 'grid',
        gridTemplateColumns: '180px 1fr',
        gap: 8,
        alignItems: 'flex-start',
        marginBottom: 14,
    },
    label: {
        fontWeight: 700,
        color: 'var(--secondary-color)',
    },
    contactList: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
    },
    contactRow: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
    },
    contactType: {
        fontWeight: 700,
        color: 'var(--secondary-color)',
    },
    contactValue: {
        textAlign: 'right',
        color: 'var(--text-color)',
    },
    notesBox: {
        minHeight: 140,
        borderRadius: 12,
        background: 'var(--background-color)',
        border: '1px solid var(--border-color)',
        padding: 18,
        color: 'var(--text-color)',
        whiteSpace: 'pre-wrap',
    },
    buttonRow: {
        display: 'flex',
        gap: 12,
        marginTop: 18,
    },
    primaryButton: {
        background: 'var(--primary-color)',
        border: 'none',
        borderRadius: 8,
        color: '#fff',
        cursor: 'pointer',
        padding: '10px 18px',
        fontWeight: 700,
    },
    secondaryButton: {
        background: 'transparent',
        border: '1px solid var(--border-color)',
        borderRadius: 8,
        color: 'var(--text-color)',
        cursor: 'pointer',
        padding: '10px 18px',
        fontWeight: 700,
    },
    linkButton: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: 'transparent',
        border: 'none',
        color: 'var(--primary-color)',
        cursor: 'pointer',
        padding: 0,
        fontWeight: 700,
        marginBottom: 14,
    },
};

export default PatientDetailPage;
*/