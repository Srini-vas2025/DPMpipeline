import {
    // Bell,
    // BriefcaseMedical,
    // CalendarDays,
    Check,
    // ClipboardCheck,
    // Download,
    // FilePenLine,
    Printer,
    // RefreshCcw,
    // RotateCcw,
    // User,
    // Users,
    X,
} from 'lucide-react';
import { useState } from 'react';
import type { ChangeEvent } from 'react';
// import type { LucideIconComponent } from '../../types/types';
import '../../styles/dispensingform.css';
import '../../styles/OrderShoesModal.css';
import apiClient from '../../lib/axios';
import { useAuthStore } from '../../store/useAuthStore';
import type { WorkflowContext } from '../../types/workflow';
import PatientModalMeta from '../workflow/PatientModalMeta';

const assessmentItems = [
    'I observed the patient wearing therapeutic shoes and inserts.',
    'Proper fitting was determined by length, width, and volume as measured.',
    'Stability was established by observing the patient wearing shoes and inserts walking with no heel slippage.',
    'Observed patient walking in shoes and inserts, after the shoes and inserts were removed there was no redness or area of pressure involved.',
    'No modifications for proper fit were needed.',
];
const noModificationsIndex = assessmentItems.length - 1;

// function NavItem({
//     icon: Icon,
//     label,
//     active = false,
//     count,
// }: {
//     active?: boolean;
//     count?: string;
//     icon: LucideIconComponent;
//     label: string;
// }) {
//     return (
//         <div className={`fitter-nav-item ${active ? 'active' : ''}`}>
//             <Icon size={22} strokeWidth={2} aria-hidden="true" />
//             <span>{label}</span>
//             {count ? <strong>{count}</strong> : null}
//         </div>
//     );
// }

function CheckTile({
    checked,
    id,
    label,
    onChange,
}: {
    checked: boolean;
    id: string;
    label: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <label className="dispense-check-row" htmlFor={id}>
            <span>{label}</span>
            <input checked={checked} id={id} onChange={onChange} type="checkbox" />
            <span className="dispense-check-box" aria-hidden="true">
                <Check size={21} strokeWidth={3.5} />
            </span>
        </label>
    );
}

export default function DispensingFormModal({
    embedded = false,
    patient,
    onClose,
}: {
    embedded?: boolean;
    patient: WorkflowContext;
    onClose: () => void;
}) {
    const physicianId = useAuthStore((state) => state.user?.physicianId);
    const [checks, setChecks] = useState(() => assessmentItems.map(() => true));
    const [certified, setCertified] = useState(true);
    const [notes, setNotes] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const patientName = patient.patientName ?? 'Patient';
    const modificationsWereNeeded = !checks[noModificationsIndex];
    const notesRequired = modificationsWereNeeded;
    const notesComplete = !notesRequired || notes.trim().length > 0;
    const requiredAssessmentsComplete = checks.slice(0, noModificationsIndex).every(Boolean);
    const canSubmit = certified && requiredAssessmentsComplete && notesComplete;
    function toggleAssessment(index: number) {
        setChecks((currentChecks) =>
            currentChecks.map((checked, itemIndex) => (itemIndex === index ? !checked : checked)),
        );
    }
    const handleSubmit = async () => {
        if (!canSubmit || isSubmitting) return;

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            await apiClient.post('/api/dpm/submitDispensingForm', {
                personId: patient.personId,
                physicianId,
                doId: patient.doId,
                assessments: checks,
                certified,
                notes,
            });
            setSubmitted(true);
        } catch {
            setSubmitError('The dispensing form could not be submitted. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className={`shoe-prototype dispensing-prototype${embedded ? ' dispensing-prototype--embedded' : ''}`}
        >
            <section
                className={`dispensing-modal${embedded ? ' dispensing-modal--embedded' : ''}`}
                aria-label={submitted ? 'Dispensing form submitted' : undefined}
                aria-labelledby={submitted || embedded ? undefined : 'dispensing-modal-title'}
            >
                {submitted || embedded ? null : (
                    <button
                        className="dispensing-close"
                        onClick={() => onClose()}
                        type="button"
                        aria-label="Close modal"
                    >
                        <X size={20} strokeWidth={2.8} aria-hidden="true" />
                    </button>
                )}

                {submitted || embedded ? null : (
                    <header className="modal-task-header dispensing-modal-header">
                        <div className="modal-task-heading">
                            <h2 id="dispensing-modal-title">Dispensing Form</h2>
                            <PatientModalMeta context={patient} />
                        </div>
                        <p className="modal-task-description">
                            Complete Supplier's objective assessments of the fit of shoes & inserts
                            while patient is wearing shoes at the time of delivery.
                        </p>
                    </header>
                )}

                {submitted ? (
                    <section className="dispensing-success" aria-live="polite">
                        <div className="dispensing-success-mark" aria-hidden="true">
                            <Check size={48} strokeWidth={3.2} />
                        </div>
                        <div className="dispensing-success-copy">
                            <h2>Form submitted successfully</h2>
                            <p>The completed dispensing form is ready to print.</p>
                        </div>

                        <div className="dispensing-success-actions">
                            <button
                                className="dispense-print-button"
                                onClick={() => window.print()}
                                type="button"
                            >
                                <Printer size={20} aria-hidden="true" />
                                Print Form
                            </button>
                            <button
                                className="dispense-close-button"
                                onClick={onClose}
                                type="button"
                            >
                                Close
                            </button>
                        </div>

                        <div className="dispensing-print-card" aria-hidden="true">
                            <div>
                                <h4>Printable form summary</h4>
                                <p>Patient: {patientName}</p>
                            </div>
                            <ul>
                                {assessmentItems.map((item, index) => (
                                    <li key={item}>
                                        <span className={checks[index] ? 'complete' : ''}>
                                            {checks[index] ? 'Accepted' : 'Not accepted'}
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="dispensing-print-notes">
                                <strong>Additional Information:</strong>{' '}
                                {notes.trim() || 'No additional information provided.'}
                            </p>
                            <p className="dispensing-print-certification">
                                Acknowledgement accepted.
                            </p>
                        </div>
                    </section>
                ) : (
                    <>
                        <div className="dispensing-panel-grid">
                            <section
                                className="dispensing-panel"
                                aria-labelledby="patient-panel-title"
                            >
                                <h3 id="patient-panel-title">Patient: {patientName}</h3>
                                <div className="dispensing-panel-rule" />
                                <div className="dispensing-check-list">
                                    {assessmentItems.map((item, index) => (
                                        <CheckTile
                                            checked={checks[index]}
                                            id={`assessment-${index}`}
                                            key={item}
                                            label={item}
                                            onChange={() => toggleAssessment(index)}
                                        />
                                    ))}
                                </div>
                            </section>

                            <section
                                className="dispensing-panel"
                                aria-labelledby="additional-panel-title"
                            >
                                <h3 id="additional-panel-title">
                                    Additional Information (
                                    {notesRequired ? 'required' : 'optional'})
                                </h3>
                                <div className="dispensing-panel-rule" />
                                <textarea
                                    aria-label="Additional information"
                                    aria-required={notesRequired}
                                    onChange={(event) => setNotes(event.target.value)}
                                    placeholder={
                                        notesRequired
                                            ? 'Describe the modifications needed for proper fit'
                                            : 'If modifications for proper fit were needed, please specify below'
                                    }
                                    required={notesRequired}
                                    value={notes}
                                />
                            </section>
                        </div>

                        <footer className="dispensing-certification">
                            <label className="dispense-certify-check" htmlFor="certify-assessments">
                                <input
                                    checked={certified}
                                    id="certify-assessments"
                                    onChange={() =>
                                        setCertified((currentCertified) => !currentCertified)
                                    }
                                    type="checkbox"
                                />
                                <span>
                                    I certify that all of the following objective assessments are
                                    true and accurate.
                                </span>
                                <span className="dispense-check-box" aria-hidden="true">
                                    <Check size={22} strokeWidth={3.5} />
                                </span>
                            </label>
                            {submitError ? (
                                <p className="dispensing-submit-error" role="alert">
                                    {submitError}
                                </p>
                            ) : null}
                            <button
                                className="dispense-submit"
                                disabled={!canSubmit || isSubmitting}
                                onClick={handleSubmit}
                                type="button"
                            >
                                {isSubmitting ? 'Submitting…' : 'Submit Form'}
                            </button>
                        </footer>
                    </>
                )}
            </section>
        </div>
    );
}
