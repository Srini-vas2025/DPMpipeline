import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import '../styles/PatientUnifiedModal.css';
import PatientModalMeta from '../components/workflow/PatientModalMeta';
import Notes from '../components/modals/Notes';
import { usePatientDetails } from '../features/patientdetail/hooks/usePatientDetails';
import {
    mapPatient,
    mapPhysician,
    mapInsurance,
    mapOrderProgress,
} from '../features/patientdetail/api/patientdetails.service';
/*import type { PatientDetailsModalProps, TabType, ShoeFormValues, CompressionFormValues, ActionType } from '../features/patientdetail/types/patientModal.types';*/
// patientDetail.tsx — update this import
import type {
    PatientDetailsModalProps,
    TabType,
    ShoeFormValues,
    CompressionFormValues,
    ActionType,
} from '../features/patientdetail/types/patientmodal.api.types';
import {
    DEFAULT_ACTION_MENU_ITEMS,
    DEFAULT_SHOE_FORM,
    DEFAULT_COMPRESSION_FORM,
    DEFAULT_SHOE_FORM_OPTIONS,
    DEFAULT_COMPRESSION_FORM_OPTIONS,
} from '../features/patientdetail/types/patientModal.defaults';

// ─── Helpers ────────────────────────────────────────────────

const maskSSN = (ssn: string): string => {
    const digits = ssn.replace(/\D/g, '');
    const last4 = digits.slice(-4);
    return `*** - ** - ${last4}`;
};

const formatAddress = (
    address: string,
    address2: string | undefined,
    city: string,
    state: string,
    zip: string,
): React.ReactNode => (
    <>
        {address}
        {address2 && (
            <>
                <br />
                {address2}
            </>
        )}
        <br />
        {city}, {state} {zip}
    </>
);

// ─── Sub-components ──────────────────────────────────────────

interface ModalRowProps {
    label: string;
    children: React.ReactNode;
    shaded?: boolean;
}

const ModalRow: React.FC<ModalRowProps> = ({ label, children, shaded }) => (
    <div className={`modal-info-row${shaded ? ' light' : ''}`}>
        <label>{label}</label>
        <div>{children}</div>
    </div>
);

// ─── Main Component ──────────────────────────────────────────

const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({
    show = true,
    onClose = () => {},
    initialTab = 'patient',
    personId,
    workflowContext,
    patient: patientProp = undefined,
    physician: physicianProp = undefined,
    insurance: insuranceProp = undefined,
    orderProgress: orderProgressProp = undefined,
    shoeFormOptions = DEFAULT_SHOE_FORM_OPTIONS,
    compressionFormOptions = DEFAULT_COMPRESSION_FORM_OPTIONS,
    initialShoeForm,
    initialCompressionForm,
    actionMenuItems = DEFAULT_ACTION_MENU_ITEMS,
    onOrderShoes,
    onShoeSubmit,
    onCompressionSubmit,
    onActionClick,
    onPecosChange,
}) => {
    const modalTitle = 'Patient Details';

    // ── API fetch ──────────────────────────────────────────────
    const { status, data: apiData, error: apiError } = usePatientDetails(personId ?? null);

    // Resolve data: prefer manually passed props, fall back to API data
    const patient = patientProp ?? (apiData ? mapPatient(apiData) : null);
    const physician = physicianProp ?? (apiData ? mapPhysician(apiData) : null);
    const insurance = insuranceProp ?? (apiData ? mapInsurance(apiData) : null);
    const orderProgress = orderProgressProp ?? (apiData ? mapOrderProgress(apiData) : null);

    // ── Local state ────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState<TabType>(initialTab);
    const [showShoeOrderModal, setShowShoeOrderModal] = useState(false);
    const [showSSN, setShowSSN] = useState(false);
    const [showActionsMenu, setShowActionsMenu] = useState(false);
    const [pecosChecked, setPecosChecked] = useState(physician?.pecosEnrolled ?? false);

    const [shoeForm, setShoeForm] = useState<ShoeFormValues>({
        ...DEFAULT_SHOE_FORM,
        ...initialShoeForm,
    });

    const [compressionForm, setCompressionForm] = useState<CompressionFormValues>({
        ...DEFAULT_COMPRESSION_FORM,
        ...initialCompressionForm,
    });

    if (!show) return null;

    // ── Loading state ─────────────────────────────────────────
    if (status === 'loading') {
        return (
            <div className="modal-card large-modal">
                <div className="modal-header">
                    <div className="modal-header-left">
                        <h2 className="modal-title">{modalTitle}</h2>
                    </div>
                    <div className="modal-header-right">
                        <button
                            type="button"
                            className="modal-close-btn"
                            onClick={onClose}
                            aria-label="Close modal"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
                    <i
                        className="fa-solid fa-spinner fa-spin"
                        style={{ fontSize: '1.5rem', marginBottom: '0.75rem', display: 'block' }}
                    ></i>
                    <p>Loading patient details…</p>
                </div>
            </div>
        );
    }

    // ── Error state ───────────────────────────────────────────
    if (status === 'error' || apiError) {
        return (
            <div className="modal-card large-modal">
                <div className="modal-header">
                    <div className="modal-header-left">
                        <h2 className="modal-title">{modalTitle}</h2>
                    </div>
                    <div className="modal-header-right">
                        <button
                            type="button"
                            className="modal-close-btn"
                            onClick={onClose}
                            aria-label="Close modal"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>
                <div
                    style={{
                        padding: '2rem',
                        textAlign: 'center',
                        color: 'var(--danger, #e53e3e)',
                    }}
                >
                    <i
                        className="fa-solid fa-circle-exclamation"
                        style={{ fontSize: '1.5rem', marginBottom: '0.75rem', display: 'block' }}
                    ></i>
                    <p>{apiError ?? 'Failed to load patient details.'}</p>
                </div>
            </div>
        );
    }

    // ── Data guard ────────────────────────────────────────────
    if (!patient || !physician || !insurance || !orderProgress) return null;

    // ── Handlers ──────────────────────────────────────────────

    const handleActionClick = (action: ActionType) => {
        onActionClick?.(action);
        setShowActionsMenu(false);
    };

    const handleShoeFormChange = <K extends keyof ShoeFormValues>(
        field: K,
        value: ShoeFormValues[K],
    ) => setShoeForm((prev: ShoeFormValues) => ({ ...prev, [field]: value }));

    const handleCompressionFormChange = <K extends keyof CompressionFormValues>(
        field: K,
        value: CompressionFormValues[K],
    ) => setCompressionForm((prev: CompressionFormValues) => ({ ...prev, [field]: value }));

    const handleShoeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onShoeSubmit?.(shoeForm);
    };

    const handleCompressionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCompressionSubmit?.(compressionForm);
    };

    const handlePecosToggle = () => {
        const next = !pecosChecked;
        setPecosChecked(next);
        onPecosChange?.(next);
    };

    const handleOrderShoes = () => {
        if (onOrderShoes) {
            onOrderShoes();
        } else {
            setShowShoeOrderModal(true);
        }
    };

    const handleClose = () => {
        setShowActionsMenu(false);
        onClose();
    };

    const patientFullName = `${patient.firstName} ${patient.lastName}`;

    // ── Render ────────────────────────────────────────────────

    return (
        <div
            className="modal-card large-modal patient-unified-modal"
            onClick={(event) => event.stopPropagation()}
        >
            {/* ── Modal Header ── */}
            <div className="modal-header">
                <div className="modal-header-left">
                    <h2 className="modal-title">{modalTitle}</h2>

                    <PatientModalMeta
                        context={{
                            ...workflowContext,
                            dob: patient.dob,
                            // The task row's patientId is the identifier the user
                            // clicked. Keep it in the modal header; personId is only
                            // the lookup key for the patient-details request.
                            patientId: workflowContext?.patientId ?? patient.id,
                            patientName: patientFullName,
                        }}
                    />

                    <div className="modal-patient-row">
                        <span className="modal-progress-label">Order Progress:</span>

                        <div className="modal-progress-dots">
                            {Array.from({ length: orderProgress.total }).map((_, i) => (
                                <span
                                    key={i}
                                    className={i < orderProgress.completed ? 'active' : ''}
                                />
                            ))}
                        </div>

                        <span className="modal-divider">|</span>

                        <button
                            type="button"
                            className="modal-small-btn"
                            onClick={handleOrderShoes}
                        >
                            Order Shoes
                        </button>
                    </div>
                </div>

                <div className="modal-header-right patient-modal-controls">
                    <button type="button" className="modal-close-btn" onClick={handleClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>

                    <div className="modal-actions-wrapper">
                        <button
                            type="button"
                            className="modal-actions-btn"
                            aria-expanded={showActionsMenu}
                            onClick={() => setShowActionsMenu((prev) => !prev)}
                        >
                            <span>Actions</span>
                            <ChevronDown aria-hidden="true" size={18} strokeWidth={3} />
                        </button>

                        {showActionsMenu && (
                            <div className="modal-actions-menu">
                                {actionMenuItems.map((item: any) => (
                                    <button
                                        key={item.key}
                                        type="button"
                                        onClick={() => handleActionClick(item.key)}
                                    >
                                        <i className={item.icon}></i>
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Tabs ── */}
            <div className="modal-tabs">
                {(['patient', 'shoe', 'compression', 'notes'] as TabType[]).map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        className={activeTab === tab ? 'active' : ''}
                        onClick={() => setActiveTab(tab)}
                    >
                        <span
                            className={`patient-tab-status ${tab === 'shoe' || tab === 'compression' ? '' : 'hidden'}`}
                            aria-hidden="true"
                        >
                            {Array.from({ length: Math.max(orderProgress.total, 6) }).map(
                                (_, i) => (
                                    <i
                                        className={
                                            i < orderProgress.completed
                                                ? 'complete'
                                                : i === orderProgress.completed
                                                  ? 'warning'
                                                  : ''
                                        }
                                        key={i}
                                    />
                                ),
                            )}
                        </span>
                        <span>
                            {tab === 'patient'
                                ? 'Patient Details'
                                : tab === 'shoe'
                                  ? 'Shoe Order'
                                  : tab === 'compression'
                                    ? 'Compression Order'
                                    : 'Notes'}
                        </span>
                    </button>
                ))}
            </div>

            {/* ── Patient Details Tab ── */}
            {activeTab === 'patient' && (
                <div className="modal-content-grid">
                    {/* Primary Physician */}
                    <div className="modal-info-card">
                        <h3>Primary Physician</h3>

                        <ModalRow label="Name">
                            <p>
                                {physician.name}
                                {physician.specialty && ` | ${physician.specialty}`}
                            </p>
                        </ModalRow>
                        <ModalRow label="Phone" shaded>
                            <p>{physician.phone}</p>
                        </ModalRow>
                        <ModalRow label="Address">
                            <p>
                                {formatAddress(
                                    physician.address,
                                    undefined,
                                    physician.city,
                                    physician.state,
                                    physician.zip,
                                )}
                            </p>
                        </ModalRow>
                        <ModalRow label="NPI" shaded>
                            <p>{physician.npi}</p>
                        </ModalRow>
                        <ModalRow label="PECOS">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <p>Pecos Enrolled?</p>
                                <button
                                    type="button"
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                    }}
                                    onClick={handlePecosToggle}
                                    aria-label="Toggle PECOS enrollment"
                                >
                                    <i
                                        className={`fa-${pecosChecked ? 'solid' : 'regular'} fa-square`}
                                    ></i>
                                </button>
                            </div>
                        </ModalRow>
                    </div>

                    {/* Insurance Info */}
                    <div className="modal-info-card">
                        <h3>Insurance Info</h3>

                        <ModalRow label="Primary">
                            <p>{insurance.primary?.provider}</p>
                            <p>{insurance.primary?.phone}</p>
                            <p>Policy #{insurance.primary?.policyNumber}</p>
                            <p>
                                {insurance.primary?.effectiveFrom || ''} -{' '}
                                {insurance.primary?.effectiveTo || ''}
                            </p>
                        </ModalRow>

                        {insurance.secondary && (
                            <ModalRow label="Secondary" shaded>
                                <p>{insurance.secondary?.provider}</p>
                                <p>{insurance.secondary?.phone}</p>
                                <p>Policy #{insurance.secondary?.policyNumber}</p>
                                <p>
                                    {insurance.secondary?.effectiveFrom || ''} -{' '}
                                    {insurance.secondary?.effectiveTo || ''}
                                </p>
                            </ModalRow>
                        )}
                    </div>

                    {/* Primary Information */}
                    <div className="modal-info-card">
                        <h3>Primary Information</h3>

                        <ModalRow label="Name">
                            <p>{patientFullName}</p>
                        </ModalRow>
                        <ModalRow label="Address" shaded>
                            <p>
                                {formatAddress(
                                    patient.address || '',
                                    patient.address2 || '',
                                    patient.city || '',
                                    patient.state || '',
                                    patient.zip || '',
                                )}
                            </p>
                        </ModalRow>
                        <ModalRow label="Language">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {patient.languageFlag && (
                                    <img
                                        src={patient.languageFlag}
                                        width="24"
                                        height="16"
                                        style={{ borderRadius: 3 }}
                                        alt={`${patient.language} flag`}
                                    />
                                )}
                                <p>{patient.language}</p>
                            </div>
                        </ModalRow>
                        <ModalRow label="Phone" shaded>
                            <p>{patient.phone}</p>
                        </ModalRow>
                        {patient.alternatePhone && (
                            <ModalRow label="Alternate Phone">
                                <p>{patient.alternatePhone}</p>
                            </ModalRow>
                        )}
                        <ModalRow label="DOB" shaded>
                            <p>{patient.dob}</p>
                        </ModalRow>
                        <ModalRow label="Social Security">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <p>{showSSN ? patient.ssn : maskSSN(patient.ssn || '')}</p>
                                <button
                                    type="button"
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: 'var(--muted)',
                                    }}
                                    onClick={() => setShowSSN((v) => !v)}
                                    aria-label="Toggle SSN visibility"
                                >
                                    <i className={`fa-solid fa-eye${showSSN ? '' : '-slash'}`}></i>
                                </button>
                            </div>
                        </ModalRow>
                        <ModalRow label="Email" shaded>
                            <p>{patient.email}</p>
                        </ModalRow>
                    </div>
                </div>
            )}

            {/* ── Shoe Order Tab ── */}
            {activeTab === 'shoe' && (
                <div className="modal-tab-content">
                    <div className="modal-info-box">
                        <i className="fa-solid fa-circle-info"></i>
                        To select a toe filler: Please check "history of partial or complete
                        amputation of the foot" as a qualifying condition, and A5514 / Custom
                        Inserts
                    </div>

                    <form onSubmit={handleShoeSubmit}>
                        <div className="modal-content-grid">
                            <div className="modal-form-card">
                                <h3>Diagnosis</h3>
                                <label>Diagnosis</label>
                                <select
                                    value={shoeForm.diagnosis}
                                    onChange={(e) =>
                                        handleShoeFormChange('diagnosis', e.target.value)
                                    }
                                >
                                    <option value="">Select</option>
                                    {shoeFormOptions.diagnosis.map((o: any) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                                <label>Qualifying Conditions</label>
                                <select
                                    value={shoeForm.qualifying}
                                    onChange={(e) =>
                                        handleShoeFormChange('qualifying', e.target.value)
                                    }
                                >
                                    <option value="">Select</option>
                                    {shoeFormOptions.qualifying.map((o: any) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="modal-form-card">
                                <h3>Qualifying Conditions</h3>
                                <label>Left Foot Ailments</label>
                                <select
                                    value={shoeForm.leftFoot}
                                    onChange={(e) =>
                                        handleShoeFormChange('leftFoot', e.target.value)
                                    }
                                >
                                    <option value="">Select</option>
                                    {shoeFormOptions.leftFootAilments.map((o: any) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                                <label>Right Foot Ailments</label>
                                <select
                                    value={shoeForm.rightFoot}
                                    onChange={(e) =>
                                        handleShoeFormChange('rightFoot', e.target.value)
                                    }
                                >
                                    <option value="">Select</option>
                                    {shoeFormOptions.rightFootAilments.map((o: any) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                                <label>Abnormal Foot Characteristics</label>
                                <select
                                    value={shoeForm.abnormal}
                                    onChange={(e) =>
                                        handleShoeFormChange('abnormal', e.target.value)
                                    }
                                >
                                    <option value="">Select</option>
                                    {shoeFormOptions.abnormalCharacteristics.map((o: any) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="modal-form-card">
                                <h3>Order Details</h3>
                                <label>Shoe Selection</label>
                                <select
                                    value={shoeForm.shoeSelection}
                                    onChange={(e) =>
                                        handleShoeFormChange('shoeSelection', e.target.value)
                                    }
                                >
                                    <option value="">Select</option>
                                    {shoeFormOptions.shoeSelection.map((o: any) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                                <label>Select Insert Type</label>
                                <select
                                    value={shoeForm.insertType}
                                    onChange={(e) =>
                                        handleShoeFormChange('insertType', e.target.value)
                                    }
                                >
                                    <option value="">Select</option>
                                    {shoeFormOptions.insertTypes.map((o: any) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                                <label>Toe Filler</label>
                                <select
                                    value={shoeForm.toeFiller}
                                    onChange={(e) =>
                                        handleShoeFormChange('toeFiller', e.target.value)
                                    }
                                >
                                    <option value="">Select</option>
                                    {shoeFormOptions.toeFillers.map((o: any) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="modal-form-card" style={{ marginTop: 20 }}>
                            <h3>Additional Shoe / Insert Accommodations</h3>
                            <textarea
                                placeholder="Add any additional details (optional)"
                                value={shoeForm.accommodations}
                                onChange={(e) =>
                                    handleShoeFormChange('accommodations', e.target.value)
                                }
                            />
                        </div>

                        <div className="modal-footer">
                            <label className="modal-check-row">
                                <input
                                    type="checkbox"
                                    checked={shoeForm.acknowledgement}
                                    onChange={(e) =>
                                        handleShoeFormChange('acknowledgement', e.target.checked)
                                    }
                                />
                                Acknowledgement Statement: This patient needs special shoes (depth
                                or custom-molded shoes) because of his/her diabetes.
                            </label>
                            <button type="submit" className="modal-submit-btn">
                                Submit Form
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ── Compression Tab ── */}
            {activeTab === 'compression' && (
                <div className="modal-tab-content">
                    <h3 className="modal-section-title">Compression Prescription</h3>
                    <p className="modal-section-subtitle">
                        {patientFullName} ({patient.id})
                    </p>

                    <div className="modal-center-form">
                        <form onSubmit={handleCompressionSubmit}>
                            <div className="modal-form-card">
                                <h3>Prescription Details</h3>
                                <label>Diagnosis Code</label>
                                <select
                                    value={compressionForm.dxCode}
                                    onChange={(e) =>
                                        handleCompressionFormChange('dxCode', e.target.value)
                                    }
                                >
                                    <option value="">Select DX Code</option>
                                    {compressionFormOptions.dxCodes.map((o: any) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="modal-form-card">
                                <h3>Product Details</h3>
                                <label>Product</label>
                                <select
                                    value={compressionForm.product}
                                    onChange={(e) =>
                                        handleCompressionFormChange('product', e.target.value)
                                    }
                                >
                                    <option value="">Select Product</option>
                                    {compressionFormOptions.products.map((o: any) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                                <label>Side of Body</label>
                                <select
                                    value={compressionForm.side}
                                    onChange={(e) =>
                                        handleCompressionFormChange('side', e.target.value)
                                    }
                                >
                                    <option value="">Select</option>
                                    {compressionFormOptions.sides.map((o: any) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                                <label>Quantity</label>
                                <select
                                    value={compressionForm.quantity}
                                    onChange={(e) =>
                                        handleCompressionFormChange('quantity', e.target.value)
                                    }
                                >
                                    <option value="">Select</option>
                                    {compressionFormOptions.quantities.map((o: any) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="modal-footer">
                                <label className="modal-check-row">
                                    <input
                                        type="checkbox"
                                        checked={compressionForm.acknowledgement}
                                        onChange={(e) =>
                                            handleCompressionFormChange(
                                                'acknowledgement',
                                                e.target.checked,
                                            )
                                        }
                                    />
                                    I am ordering compression for the patient to help with
                                    lymphedema.
                                </label>
                                <button type="submit" className="modal-submit-btn">
                                    Submit Form
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {activeTab === 'notes' && workflowContext && (
                <div className="patient-unified-notes">
                    <Notes context={workflowContext} embedded onClose={handleClose} />
                </div>
            )}

            {/* ── Shoe Picker Overlay ── */}
            {showShoeOrderModal && (
                <div className="modal-overlay" onClick={() => setShowShoeOrderModal(false)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-header-left">
                                <h2 className="modal-title">Select Shoe</h2>
                            </div>
                            <div className="modal-header-right">
                                <button
                                    type="button"
                                    className="modal-close-btn"
                                    onClick={() => setShowShoeOrderModal(false)}
                                    aria-label="Close shoe picker"
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        </div>
                        <div
                            style={{
                                padding: '1.5rem',
                                textAlign: 'center',
                                color: 'var(--muted)',
                            }}
                        >
                            <i
                                className="fa-solid fa-shoe-prints"
                                style={{
                                    fontSize: '2rem',
                                    marginBottom: '0.75rem',
                                    display: 'block',
                                }}
                            ></i>
                            <p>Shoe catalog will be displayed here.</p>
                            <p style={{ fontSize: '0.85rem' }}>
                                Connect your shoe inventory data source to populate this panel.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientDetailsModal;
