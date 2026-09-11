import { Check, ChevronDown, CircleAlert, X } from 'lucide-react';
import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { WorkflowContext } from '../../types/workflow';
import PatientModalMeta from '../workflow/PatientModalMeta';
import '../../styles/OrderShoesModal.css';
import '../../styles/ShoePrescriptionModal.css';

type PrescriptionSelectId =
    | 'insertType'
    | 'toeFiller'
    | 'leftAmputation'
    | 'leftUlcerHistory'
    | 'leftCallus'
    | 'leftForefoot'
    | 'leftDigital'
    | 'leftMidfoot'
    | 'rightAmputation'
    | 'rightUlcerHistory'
    | 'rightCallus'
    | 'rightForefoot'
    | 'rightDigital'
    | 'rightMidfoot';

type PrescriptionValues = Record<PrescriptionSelectId, string>;

export interface ShoePrescriptionDraft {
    acknowledged: boolean;
    notes: Record<NotePanelId, string>;
    qualifyingConditions: string[];
    values: PrescriptionValues;
}

interface ShoePrescriptionModalProps {
    context: WorkflowContext;
    initialDraft?: ShoePrescriptionDraft | null;
    onClose: () => void;
    onContinueFitting: () => void;
    onScheduleFitting: () => void;
    onSubmit?: (draft: ShoePrescriptionDraft) => Promise<void> | void;
}

const prescriptionDefaults: PrescriptionValues = {
    insertType: '',
    toeFiller: '',
    leftAmputation: '',
    leftUlcerHistory: '',
    leftCallus: '',
    leftForefoot: '',
    leftDigital: '',
    leftMidfoot: '',
    rightAmputation: '',
    rightUlcerHistory: '',
    rightCallus: '',
    rightForefoot: '',
    rightDigital: '',
    rightMidfoot: '',
};

const selectOptions: Record<PrescriptionSelectId, string[]> = {
    insertType: ['A5512 / Heat molded inserts', 'A5513 / Custom inserts', 'A5514 / Custom inserts'],
    toeFiller: ['Not required', 'Left foot', 'Right foot', 'Bilateral'],
    leftAmputation: ['None', 'Partial foot', 'Complete foot'],
    leftUlcerHistory: ['None', 'Previous ulceration', 'Active ulceration'],
    leftCallus: ['None', 'Pre-ulcerative callus', 'Diffuse callus'],
    leftForefoot: ['None', 'Hallux valgus', 'Forefoot deformity'],
    leftDigital: ['None', 'Hammertoes', 'Claw toes'],
    leftMidfoot: ['None', 'Pes planus', 'Charcot deformity'],
    rightAmputation: ['None', 'Partial foot', 'Complete foot'],
    rightUlcerHistory: ['None', 'Previous ulceration', 'Active ulceration'],
    rightCallus: ['None', 'Pre-ulcerative callus', 'Diffuse callus'],
    rightForefoot: ['None', 'Hallux valgus', 'Forefoot deformity'],
    rightDigital: ['None', 'Hammertoes', 'Claw toes'],
    rightMidfoot: ['None', 'Pes planus', 'Charcot deformity'],
};

const qualifyingConditionOptions = [
    'History of partial or complete amputation of the foot',
    'History of previous foot ulceration',
    'History of pre-ulcerative callus',
    'Peripheral neuropathy with evidence of callus formation',
    'Foot Deformity',
    'Poor Circulation',
];

const formPanels: Array<{
    fields: Array<
        | { id: PrescriptionSelectId; label: string; type?: 'single' }
        | { id: 'qualifyingConditions'; type: 'conditions' }
    >;
    title: string;
}> = [
    {
        title: 'Diagnosis',
        fields: [
            { id: 'qualifyingConditions', type: 'conditions' },
            { id: 'insertType', label: 'Select Insert Type' },
            { id: 'toeFiller', label: 'Toe Filler' },
        ],
    },
    {
        title: 'Left Foot Deformities',
        fields: [
            { id: 'leftAmputation', label: 'Amputation' },
            { id: 'leftUlcerHistory', label: 'Ulcer History' },
            { id: 'leftCallus', label: 'Callus' },
            { id: 'leftForefoot', label: 'Forefoot / Big Toe' },
            { id: 'leftDigital', label: 'Digital' },
            { id: 'leftMidfoot', label: 'Midfoot / Arch / Global' },
        ],
    },
    {
        title: 'Right Foot Deformities',
        fields: [
            { id: 'rightAmputation', label: 'Amputation' },
            { id: 'rightUlcerHistory', label: 'Ulcer History' },
            { id: 'rightCallus', label: 'Callus' },
            { id: 'rightForefoot', label: 'Forefoot / Big Toe' },
            { id: 'rightDigital', label: 'Digital' },
            { id: 'rightMidfoot', label: 'Midfoot / Arch / Global' },
        ],
    },
];

const notePanels = [
    {
        id: 'additionalQualifications',
        label: 'Additional Qualifications',
    },
    {
        id: 'poorCirculation',
        label: 'Poor Circulation',
    },
    {
        id: 'neuropathy',
        label: 'Neuropathy',
    },
] as const;

type NotePanelId = (typeof notePanels)[number]['id'];

function QualifyingConditionsField({
    selectedValues,
    onToggle,
}: {
    onToggle: (option: string) => void;
    selectedValues: string[];
}) {
    const [isOpen, setIsOpen] = useState(false);
    const selectionLabel =
        selectedValues.length === 0
            ? 'Select'
            : `${selectedValues.length} condition${selectedValues.length === 1 ? '' : 's'} selected`;

    return (
        <div className="prescription-field">
            <span id="qualifying-conditions-label">Qualifying Conditions</span>
            <div className="prescription-multi-wrap">
                <button
                    aria-controls="qualifying-conditions-options"
                    aria-expanded={isOpen}
                    aria-labelledby="qualifying-conditions-label qualifying-conditions-value"
                    className={`prescription-select prescription-multi-trigger${selectedValues.length ? ' selected' : ''}`}
                    onClick={() => setIsOpen((current) => !current)}
                    type="button"
                >
                    <span id="qualifying-conditions-value">{selectionLabel}</span>
                    <ChevronDown size={16} aria-hidden="true" />
                </button>
                {isOpen ? (
                    <div
                        className="qualifying-conditions-list qualifying-conditions-popover"
                        id="qualifying-conditions-options"
                    >
                        <p>Please select all that apply:</p>
                        <div className="qualifying-conditions-options">
                            {qualifyingConditionOptions.map((option) => {
                                const selected = selectedValues.includes(option);

                                return (
                                    <button
                                        className={selected ? 'selected' : ''}
                                        key={option}
                                        onClick={() => onToggle(option)}
                                        type="button"
                                        aria-pressed={selected}
                                    >
                                        <span>{option}</span>
                                        <i aria-hidden="true">
                                            {selected ? (
                                                <Check size={14} strokeWidth={3.2} />
                                            ) : null}
                                        </i>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function PrescriptionSelect({
    id,
    label,
    onChange,
    value,
}: {
    id: PrescriptionSelectId;
    label: string;
    onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    value: string;
}) {
    return (
        <label className="prescription-field" htmlFor={id}>
            <span>{label}</span>
            <span className={`prescription-select ${value ? 'selected' : ''}`}>
                <select id={id} name={id} onChange={onChange} value={value}>
                    <option value="">Select</option>
                    {selectOptions[id].map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <ChevronDown size={16} aria-hidden="true" />
            </span>
        </label>
    );
}

export default function ShoePrescriptionModal({
    context,
    initialDraft,
    onClose,
    onContinueFitting,
    onScheduleFitting,
    onSubmit,
}: ShoePrescriptionModalProps) {
    const [values, setValues] = useState<PrescriptionValues>(
        initialDraft?.values ?? prescriptionDefaults,
    );
    const [qualifyingConditions, setQualifyingConditions] = useState<string[]>(
        initialDraft?.qualifyingConditions ?? [],
    );
    const [notes, setNotes] = useState<Record<NotePanelId, string>>(
        initialDraft?.notes ?? {
            additionalQualifications: '',
            poorCirculation: '',
            neuropathy: '',
        },
    );
    const [acknowledged, setAcknowledged] = useState(initialDraft?.acknowledged ?? true);
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    function updateSelection(event: ChangeEvent<HTMLSelectElement>) {
        const id = event.target.name as PrescriptionSelectId;

        setValues((currentValues) => ({
            ...currentValues,
            [id]: event.target.value,
        }));
    }

    function toggleQualifyingCondition(option: string) {
        setQualifyingConditions((currentConditions) =>
            currentConditions.includes(option)
                ? currentConditions.filter((condition) => condition !== option)
                : [...currentConditions, option],
        );
    }

    async function handleSubmit() {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            await onSubmit?.({ acknowledged, notes, qualifyingConditions, values });
            setSubmitted(true);
        } catch {
            setSubmitError('The form could not be submitted. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="shoe-prototype prescription-prototype">
            <section
                className={`prescription-modal ${submitted ? 'submitted' : ''}`}
                aria-labelledby="prescription-modal-title"
            >
                <button
                    className="prescription-close"
                    onClick={onClose}
                    type="button"
                    aria-label="Close modal"
                >
                    <X size={21} strokeWidth={2.8} aria-hidden="true" />
                </button>

                <header className="prescription-header">
                    <h2 id="prescription-modal-title">New Shoe Prescription</h2>
                    <PatientModalMeta context={context} />
                    {submitted ? null : (
                        <div className="prescription-alert" role="note">
                            <CircleAlert size={14} aria-hidden="true" />
                            <span>
                                To select a toe filler: Please check "history of partial or complete
                                amputation of the foot" as a qualifying condition, and A5514 /
                                Custom Inserts
                            </span>
                        </div>
                    )}
                </header>

                {submitted ? (
                    <>
                        <section className="prescription-success" aria-live="polite">
                            <h3>Your form has been submitted.</h3>
                            <p>
                                Would you like to set the fitting appointment, or continue the
                                fitting process?
                            </p>
                        </section>

                        <footer className="prescription-success-actions">
                            <button
                                className="prescription-secondary-action"
                                onClick={onClose}
                                type="button"
                            >
                                Close
                            </button>
                            <div>
                                <button
                                    className="prescription-submit"
                                    onClick={onContinueFitting}
                                    type="button"
                                >
                                    Continue fitting process
                                </button>
                                <button
                                    className="prescription-submit"
                                    onClick={onScheduleFitting}
                                    type="button"
                                >
                                    Set fitting appointment
                                </button>
                            </div>
                        </footer>
                    </>
                ) : (
                    <>
                        <div className="prescription-panel-grid">
                            {formPanels.map((panel) => (
                                <section className="prescription-panel" key={panel.title}>
                                    <h3>{panel.title}</h3>
                                    <div className="prescription-panel-rule" />
                                    <div className="prescription-fields">
                                        {panel.fields.map((field) =>
                                            field.type === 'conditions' ? (
                                                <QualifyingConditionsField
                                                    key={field.id}
                                                    selectedValues={qualifyingConditions}
                                                    onToggle={toggleQualifyingCondition}
                                                />
                                            ) : (
                                                <PrescriptionSelect
                                                    id={field.id}
                                                    key={field.id}
                                                    label={field.label}
                                                    onChange={updateSelection}
                                                    value={values[field.id]}
                                                />
                                            ),
                                        )}
                                    </div>
                                </section>
                            ))}
                        </div>

                        <div className="prescription-panel-grid">
                            {notePanels.map((panel) => (
                                <section
                                    className="prescription-panel prescription-notes-panel"
                                    key={panel.id}
                                >
                                    <h3>{panel.label}</h3>
                                    <div className="prescription-panel-rule" />
                                    <textarea
                                        aria-label={panel.label}
                                        onChange={(event) =>
                                            setNotes((currentNotes) => ({
                                                ...currentNotes,
                                                [panel.id]: event.target.value,
                                            }))
                                        }
                                        placeholder="Add any additional details (optional)"
                                        value={notes[panel.id]}
                                    />
                                </section>
                            ))}
                        </div>

                        <footer className="prescription-footer">
                            <label className="prescription-acknowledgement">
                                <span>
                                    Acknowledgement Statement: This patient needs special shoes
                                    (depth or custom-molded shoes) because of his/her diabetes.
                                </span>
                                <input
                                    checked={acknowledged}
                                    onChange={() => setAcknowledged((current) => !current)}
                                    type="checkbox"
                                />
                                <span className="prescription-check-box" aria-hidden="true">
                                    <Check size={18} strokeWidth={3.3} />
                                </span>
                            </label>
                            {submitError ? (
                                <p className="prescription-submit-error" role="alert">
                                    {submitError}
                                </p>
                            ) : null}
                            <button
                                className="prescription-submit"
                                disabled={!acknowledged || isSubmitting}
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
