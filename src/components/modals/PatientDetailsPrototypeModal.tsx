import {
    Check,
    ChevronDown,
    CirclePlus,
    Copy,
    Eye,
    EyeOff,
    Languages,
    MoreHorizontal,
    Search,
    X,
} from 'lucide-react';
import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import {
    mapInsurance,
    mapOrderProgress,
    mapPatient,
    mapPhysician,
} from '../../features/patientdetail/api/patientdetails.service';
import { usePatientDetails } from '../../features/patientdetail/hooks/usePatientDetails';
import type {
    InsuranceInfo,
    PatientInfo,
    Physician,
} from '../../features/patientdetail/types/patientmodal.api.types';
import type { WorkflowAction, WorkflowContext } from '../../types/workflow';
import PatientModalMeta from '../workflow/PatientModalMeta';
import '../../styles/OrderShoesModal.css';
import '../../styles/PatientDetailsPrototypeModal.css';

interface PatientDetailsPrototypeModalProps {
    context: WorkflowContext;
    onAction: (action: WorkflowAction) => void;
    onClose: () => void;
}

interface DetailRowData {
    action?: ReactNode;
    actionLabel?: string;
    label: string;
    onAction?: () => void;
    value: ReactNode | ReactNode[];
}

const samplePhysicians: Physician[] = [
    {
        address: '1818 S Australian Ave',
        city: 'West Palm Beach',
        name: 'Edward Alquero',
        npi: '1122334455',
        pecosEnrolled: true,
        phone: '(112) 233-4455',
        specialty: 'MD | Family Medicine',
        state: 'FL',
        zip: '33409',
    },
    {
        address: '42 Driftway',
        city: 'Scituate',
        name: 'Monica Garcia',
        npi: '1649273041',
        pecosEnrolled: true,
        phone: '(781) 555-0134',
        specialty: 'DPM | Podiatry',
        state: 'MA',
        zip: '02066',
    },
    {
        address: '120 Wayland Ave',
        city: 'Providence',
        name: 'Marc Vetrano',
        npi: '1902847365',
        pecosEnrolled: false,
        phone: '(401) 555-0112',
        specialty: 'MD | Endocrinology',
        state: 'RI',
        zip: '02906',
    },
];

const actionItems: Array<{ action: WorkflowAction; label: string }> = [
    { action: 'shoe-prescription', label: 'New Shoe Prescription' },
    { action: 'in-person-fitting', label: 'In-Person Fitting' },
    { action: 'dispensing', label: 'Dispensing' },
    { action: 'proof-of-delivery', label: 'Proof of Delivery' },
    { action: 'upload-forms', label: 'Upload Forms' },
    { action: 'notes', label: 'Notes' },
];

const emptyInsurance: InsuranceInfo = {
    primary: {
        effectiveFrom: '',
        effectiveTo: '',
        phone: '',
        policyNumber: '',
        provider: 'Not available',
    },
};

function valueOrFallback(value: string | undefined, fallback = 'Not available') {
    return value?.trim() || fallback;
}

function maskSsn(ssn: string) {
    const lastFour = ssn.replace(/\D/g, '').slice(-4);
    return lastFour ? `*** - ** - ${lastFour}` : 'Not available';
}

function DetailRow({ action, actionLabel, label, onAction, value }: DetailRowData) {
    const lines = Array.isArray(value) ? value : [value];

    return (
        <div className="patient-detail-row">
            <div>
                <dt>{label}</dt>
                <dd className="patient-detail-value">
                    {lines.map((line, index) => (
                        <span key={`${label}-${index}`}>{line}</span>
                    ))}
                </dd>
            </div>
            {action ? (
                <button
                    aria-label={actionLabel ?? `${label} action`}
                    className="patient-row-action"
                    onClick={onAction}
                    type="button"
                >
                    {action}
                </button>
            ) : null}
        </div>
    );
}

function InfoCard({
    children,
    className = '',
    title,
    warning = false,
}: {
    children: ReactNode;
    className?: string;
    title: string;
    warning?: boolean;
}) {
    return (
        <section className={`patient-info-card ${warning ? 'warning' : ''} ${className}`}>
            <header>
                <h3>{title}</h3>
                <button aria-label={`${title} options`} type="button">
                    <MoreHorizontal size={21} aria-hidden="true" />
                </button>
            </header>
            {children}
        </section>
    );
}

function PhysicianCard({ physician }: { physician: Physician }) {
    return (
        <dl>
            <DetailRow
                label="Name"
                value={`${valueOrFallback(physician.name)}${physician.specialty ? `, ${physician.specialty}` : ''}`}
            />
            <DetailRow label="Phone" value={valueOrFallback(physician.phone)} />
            <DetailRow
                label="Address"
                value={[
                    valueOrFallback(physician.address),
                    [physician.city, physician.state, physician.zip].filter(Boolean).join(' '),
                ]}
            />
            <DetailRow label="NPI" value={valueOrFallback(physician.npi)} />
            <div className="patient-detail-row pecos-row">
                <div>
                    <dt>PECOS</dt>
                    <dd>PECOS Enrolled?</dd>
                </div>
                <span className={`pecos-check ${physician.pecosEnrolled ? '' : 'inactive'}`}>
                    {physician.pecosEnrolled ? (
                        <Check size={14} strokeWidth={3.4} aria-hidden="true" />
                    ) : null}
                </span>
            </div>
        </dl>
    );
}

function PhysicianFlow({
    onCancel,
    onSelect,
}: {
    onCancel: () => void;
    onSelect: (physician: Physician) => void;
}) {
    const [mode, setMode] = useState<'search' | 'create'>('search');
    const [query, setQuery] = useState('');
    const [form, setForm] = useState({
        address: '',
        city: '',
        name: '',
        npi: '',
        phone: '',
        specialty: '',
        state: '',
        zip: '',
    });
    const filtered = useMemo(() => {
        const normalized = query.trim().toLowerCase();
        return normalized
            ? samplePhysicians.filter((physician) =>
                  [
                      physician.name,
                      physician.specialty,
                      physician.city,
                      physician.state,
                      physician.npi,
                  ]
                      .join(' ')
                      .toLowerCase()
                      .includes(normalized),
              )
            : samplePhysicians;
    }, [query]);

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onSelect({ ...form, pecosEnrolled: Boolean(form.npi) });
    }

    return (
        <div className="physician-flow-modal">
            <header className="modal-task-header patient-details-header physician-flow-header">
                <div className="modal-task-heading">
                    <h2>{mode === 'search' ? 'Physician Search' : 'Create New Physician'}</h2>
                </div>
            </header>
            {mode === 'search' ? (
                <div className="physician-picker">
                    <div className="physician-picker-hero">
                        <Search size={48} strokeWidth={1.5} aria-hidden="true" />
                        <h3>Find your physician</h3>
                        <p>
                            Search the directory, or{' '}
                            <button onClick={() => setMode('create')} type="button">
                                create a new physician record
                            </button>
                            .
                        </p>
                    </div>
                    <label className="physician-directory-search">
                        <span>Physician name, specialty, city, state, or NPI</span>
                        <div>
                            <Search size={17} aria-hidden="true" />
                            <input
                                autoFocus
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Start typing a physician's name"
                                value={query}
                            />
                        </div>
                    </label>
                    <div className="physician-picker-results">
                        {filtered.map((physician) => (
                            <article className="physician-picker-row" key={physician.npi}>
                                <div>
                                    <strong>{physician.name}</strong>
                                    <span>{physician.specialty}</span>
                                    <span>
                                        {physician.city}, {physician.state} {physician.zip}
                                    </span>
                                </div>
                                <button onClick={() => onSelect(physician)} type="button">
                                    Select
                                </button>
                            </article>
                        ))}
                    </div>
                    <footer className="physician-picker-footer">
                        <button onClick={onCancel} type="button">
                            Cancel
                        </button>
                    </footer>
                </div>
            ) : (
                <form className="physician-create-form" onSubmit={submit}>
                    <button
                        className="physician-back-button"
                        onClick={() => setMode('search')}
                        type="button"
                    >
                        Back to search
                    </button>
                    <div className="physician-form-grid">
                        {Object.keys(form).map((field) => (
                            <label key={field}>
                                <span>{field.replace(/([A-Z])/g, ' $1')}</span>
                                <input
                                    onChange={(event) =>
                                        setForm((current) => ({
                                            ...current,
                                            [field]: event.target.value,
                                        }))
                                    }
                                    required={[
                                        'name',
                                        'phone',
                                        'address',
                                        'city',
                                        'state',
                                        'zip',
                                    ].includes(field)}
                                    value={form[field as keyof typeof form]}
                                />
                            </label>
                        ))}
                    </div>
                    <footer className="physician-picker-footer">
                        <button onClick={onCancel} type="button">
                            Cancel
                        </button>
                        <button className="primary" type="submit">
                            Add Physician
                        </button>
                    </footer>
                </form>
            )}
        </div>
    );
}

export default function PatientDetailsPrototypeModal({
    context,
    onAction,
    onClose,
}: PatientDetailsPrototypeModalProps) {
    const { data, error, status } = usePatientDetails(context.personId ?? null);
    const [selectedPhysician, setSelectedPhysician] = useState<Physician | null>(null);
    const [showPhysicianFlow, setShowPhysicianFlow] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const [showSsn, setShowSsn] = useState(false);

    const patient: PatientInfo = data
        ? mapPatient(data)
        : {
              address: '',
              city: '',
              dob: context.dob ?? '',
              email: '',
              firstName: context.patientName?.split(' ')[0] ?? 'Patient',
              id: context.patientId ?? context.personId ?? '',
              language: 'English',
              lastName: context.patientName?.split(' ').slice(1).join(' ') ?? '',
              phone: '',
              ssn: '',
              state: '',
              zip: '',
          };
    const apiPhysician = data ? mapPhysician(data) : null;
    const physician = selectedPhysician ?? (apiPhysician?.name ? apiPhysician : null);
    const insurance = data ? mapInsurance(data) : emptyInsurance;
    const progress = data ? mapOrderProgress(data) : { completed: 0, total: 6 };
    const patientName =
        [patient.firstName, patient.lastName].filter(Boolean).join(' ') ||
        context.patientName ||
        'Patient';
    const progressStatuses = Array.from({ length: Math.max(progress.total, 6) }, (_, index) =>
        index < progress.completed
            ? 'complete'
            : index === progress.completed
              ? 'warning'
              : 'empty',
    );

    const insuranceRows = [insurance.primary, insurance.secondary]
        .filter((plan): plan is NonNullable<typeof plan> => Boolean(plan))
        .map((plan, index) => ({
            label: index === 0 ? 'Primary' : 'Secondary',
            value: [
                valueOrFallback(plan.provider),
                valueOrFallback(plan.phone),
                plan.policyNumber ? `Policy #${plan.policyNumber}` : 'Policy not available',
                [plan.effectiveFrom, plan.effectiveTo].filter(Boolean).join(' - ') ||
                    'Dates not available',
            ],
        }));

    const patientRows: DetailRowData[] = [
        {
            action: <Copy size={18} aria-hidden="true" />,
            actionLabel: 'Copy patient name',
            label: 'Name',
            onAction: () => navigator.clipboard?.writeText(patientName),
            value: patientName,
        },
        {
            label: 'Address',
            value: [
                valueOrFallback(patient.address),
                [patient.address2, patient.city, patient.state, patient.zip]
                    .filter(Boolean)
                    .join(' '),
            ],
        },
        {
            action: <Languages size={18} aria-hidden="true" />,
            label: 'Language',
            value: valueOrFallback(patient.language, 'English'),
        },
        { label: 'Phone', value: valueOrFallback(patient.phone) },
        { label: 'Alternate Phone', value: valueOrFallback(patient.alternatePhone) },
        { label: 'DOB', value: valueOrFallback(patient.dob) },
        {
            action: showSsn ? (
                <Eye size={17} aria-hidden="true" />
            ) : (
                <EyeOff size={17} aria-hidden="true" />
            ),
            actionLabel: showSsn ? 'Hide social security number' : 'Show social security number',
            label: 'Social Security',
            onAction: () => setShowSsn((current) => !current),
            value: showSsn ? valueOrFallback(patient.ssn) : maskSsn(patient.ssn),
        },
        { label: 'Email', value: valueOrFallback(patient.email) },
    ];

    return (
        <main className="shoe-prototype patient-details-prototype">
            <section
                className={`patient-details-modal ${showPhysicianFlow ? 'physician-flow-active' : ''}`}
                aria-labelledby="patient-details-title"
            >
                <button
                    aria-label={showPhysicianFlow ? 'Back to patient details' : 'Close modal'}
                    className="modal-close patient-close"
                    onClick={showPhysicianFlow ? () => setShowPhysicianFlow(false) : onClose}
                    type="button"
                >
                    <X size={22} aria-hidden="true" />
                </button>

                {showPhysicianFlow ? (
                    <PhysicianFlow
                        onCancel={() => setShowPhysicianFlow(false)}
                        onSelect={(nextPhysician) => {
                            setSelectedPhysician(nextPhysician);
                            setShowPhysicianFlow(false);
                        }}
                    />
                ) : (
                    <>
                        <header className="modal-task-header patient-details-header">
                            <div className="modal-task-heading">
                                <h2 id="patient-details-title">Patient Details</h2>
                                <PatientModalMeta
                                    context={{
                                        ...context,
                                        dob: patient.dob,
                                        patientId: patient.id,
                                        patientName,
                                    }}
                                />
                            </div>
                            {status === 'loading' ? (
                                <span className="patient-data-notice">
                                    Refreshing patient data…
                                </span>
                            ) : error ? (
                                <span className="patient-data-notice error">
                                    Using task data: {error}
                                </span>
                            ) : null}
                        </header>

                        <div className="patient-nav-header">
                            <nav className="patient-order-tabs" aria-label="Patient workflow tabs">
                                <button className="active" type="button">
                                    <span className="order-status-dots hidden" />
                                    <span>Patient Details</span>
                                </button>
                                <button onClick={() => onAction('shoe-prescription')} type="button">
                                    <span className="order-status-dots">
                                        {progressStatuses.map((item, index) => (
                                            <i className={item} key={`${item}-${index}`} />
                                        ))}
                                    </span>
                                    <span>Shoe Order</span>
                                </button>
                                <button
                                    onClick={() => onAction('compression-prescription')}
                                    type="button"
                                >
                                    <span className="order-status-dots">
                                        {progressStatuses.map((item, index) => (
                                            <i className={item} key={`${item}-${index}`} />
                                        ))}
                                    </span>
                                    <span>Compression Order</span>
                                </button>
                                <button onClick={() => onAction('notes')} type="button">
                                    <span className="order-status-dots hidden" />
                                    <span>Notes</span>
                                </button>
                            </nav>

                            <div className="patient-actions-wrap">
                                <button
                                    aria-expanded={showActions}
                                    className="patient-actions-button"
                                    onClick={() => setShowActions((current) => !current)}
                                    type="button"
                                >
                                    Actions
                                    <ChevronDown size={15} aria-hidden="true" />
                                </button>
                                {showActions ? (
                                    <div className="patient-actions-menu">
                                        {actionItems.map((item) => (
                                            <button
                                                key={item.action}
                                                onClick={() => onAction(item.action)}
                                                type="button"
                                            >
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        <div className="patient-details-grid">
                            <InfoCard
                                className={physician ? '' : 'physician-zero-card'}
                                title="Primary Physician"
                                warning={!physician}
                            >
                                {physician ? (
                                    <PhysicianCard physician={physician} />
                                ) : (
                                    <div className="physician-zero-state">
                                        <p>Add Physician Information</p>
                                        <button
                                            aria-label="Add physician information"
                                            onClick={() => setShowPhysicianFlow(true)}
                                            type="button"
                                        >
                                            <CirclePlus size={50} aria-hidden="true" />
                                        </button>
                                    </div>
                                )}
                            </InfoCard>

                            <InfoCard title="Insurance Info">
                                <dl>
                                    {insuranceRows.map((row) => (
                                        <DetailRow key={row.label} {...row} />
                                    ))}
                                </dl>
                            </InfoCard>

                            <InfoCard className="patient-primary-card" title="Patient Info">
                                <dl>
                                    {patientRows.map((row) => (
                                        <DetailRow key={row.label} {...row} />
                                    ))}
                                </dl>
                            </InfoCard>
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}
