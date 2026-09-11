import { Check, ChevronDown, Edit3, X } from 'lucide-react';
import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { ShoePrescriptionDraft } from './ShoePrescriptionModal';
import type { WorkflowContext } from '../../types/workflow';
import PatientModalMeta from '../workflow/PatientModalMeta';
import '../../styles/OrderShoesModal.css';
import '../../styles/InPersonFittingFormModal.css';

type FittingSelectId =
    'castingProcess' | 'leftFootWidth' | 'leftFootLength' | 'rightFootWidth' | 'rightFootLength';

const fittingDefaults: Record<FittingSelectId, string> = {
    castingProcess: '',
    leftFootWidth: '',
    leftFootLength: '',
    rightFootWidth: '',
    rightFootLength: '',
};

const fittingSelectOptions: Record<FittingSelectId, string[]> = {
    castingProcess: ['Foam impression', 'Digital scan', 'Plaster slipper cast'],
    leftFootWidth: ['Narrow', 'Medium', 'Wide', 'Extra Wide'],
    leftFootLength: ['7', '7.5', '8', '8.5', '9', '9.5', '10'],
    rightFootWidth: ['Narrow', 'Medium', 'Wide', 'Extra Wide'],
    rightFootLength: ['7', '7.5', '8', '8.5', '9', '9.5', '10'],
};

export interface InPersonFittingDraft {
    values: Record<FittingSelectId, string>;
}

interface InPersonFittingFormProps {
    context: WorkflowContext;
    embedded?: boolean;
    onBack: () => void;
    onClose: () => void;
    onSubmit?: (draft: InPersonFittingDraft) => Promise<void> | void;
    prescription?: ShoePrescriptionDraft | null;
}

function FittingSelect({
    id,
    label,
    onChange,
    value,
}: {
    id: FittingSelectId;
    label: string;
    onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    value: string;
}) {
    return (
        <label className="fitting-field" htmlFor={id}>
            <span>{label}</span>
            <span className={`fitting-select ${value ? 'selected' : ''}`}>
                <select id={id} name={id} onChange={onChange} value={value}>
                    <option value="">Select</option>
                    {fittingSelectOptions[id].map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <ChevronDown size={15} strokeWidth={2.6} aria-hidden="true" />
            </span>
        </label>
    );
}

function MiniTable({ rows, title }: { rows: string[][]; title: string }) {
    return (
        <section className="fitting-mini-section">
            <h4>{title}</h4>
            <div className="fitting-answer-list">
                {rows.map(([label, answer]) => (
                    <div className="fitting-answer-row" key={label}>
                        <span>{label}</span>
                        <strong>{answer}</strong>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default function InPersonFittingFormModal({
    context,
    embedded = false,
    onBack,
    onClose,
    onSubmit,
    prescription,
}: InPersonFittingFormProps) {
    const [values, setValues] = useState(fittingDefaults);
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const requiredSelectionsComplete = Object.values(values).every(Boolean);
    const answer = (value: string | undefined) => value || 'Not provided';
    const diagnosisRows = [
        ['Qualifying Condition', prescription?.qualifyingConditions.join(', ') || 'Not provided'],
        ['Insert Type', answer(prescription?.values.insertType)],
        ['Toe Filler', answer(prescription?.values.toeFiller)],
    ];
    const leftDeformityRows = [
        ['Amputation', answer(prescription?.values.leftAmputation)],
        ['Ulcer History', answer(prescription?.values.leftUlcerHistory)],
        ['Callus', answer(prescription?.values.leftCallus)],
        ['Forefoot / Big Toe', answer(prescription?.values.leftForefoot)],
        ['Digital', answer(prescription?.values.leftDigital)],
        ['Midfoot / Arch / Global', answer(prescription?.values.leftMidfoot)],
    ];
    const rightDeformityRows = [
        ['Amputation', answer(prescription?.values.rightAmputation)],
        ['Ulcer History', answer(prescription?.values.rightUlcerHistory)],
        ['Callus', answer(prescription?.values.rightCallus)],
        ['Forefoot / Big Toe', answer(prescription?.values.rightForefoot)],
        ['Digital', answer(prescription?.values.rightDigital)],
        ['Midfoot / Arch / Global', answer(prescription?.values.rightMidfoot)],
    ];
    const notes = [
        {
            title: 'Additional Qualifications',
            text: answer(prescription?.notes.additionalQualifications),
        },
        {
            title: 'Poor Circulation',
            text: answer(prescription?.notes.poorCirculation),
        },
        { title: 'Neuropathy', text: answer(prescription?.notes.neuropathy) },
    ];

    function updateSelection(event: ChangeEvent<HTMLSelectElement>) {
        const id = event.target.name as FittingSelectId;

        setValues((currentValues) => ({
            ...currentValues,
            [id]: event.target.value,
        }));
    }

    async function handleSubmit() {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            await onSubmit?.({ values });
            setSubmitted(true);
        } catch {
            setSubmitError('The fitting form could not be submitted. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div
            className={`shoe-prototype fitting-prototype${embedded ? ' fitting-prototype--embedded' : ''}`}
        >
            <section
                className={`fitting-modal${submitted ? ' submitted' : ''}${embedded ? ' fitting-modal--embedded' : ''}`}
                aria-labelledby={embedded ? undefined : 'fitting-modal-title'}
            >
                {embedded ? null : (
                    <button
                        className="fitting-close"
                        onClick={onClose}
                        type="button"
                        aria-label="Close modal"
                    >
                        <X size={21} strokeWidth={2.8} aria-hidden="true" />
                    </button>
                )}

                {embedded ? null : (
                    <header className="fitting-header">
                        <h2 id="fitting-modal-title">In Person Fitting Form</h2>
                        <PatientModalMeta context={context} />
                    </header>
                )}

                {submitted ? (
                    <section className="fitting-success" aria-live="polite">
                        <div className="fitting-success-mark" aria-hidden="true">
                            <Check size={46} strokeWidth={3.2} />
                        </div>
                        <h3>Fitting form submitted.</h3>
                        <p>The patient fitting details have been saved to the order.</p>
                        <button className="fitting-submit" onClick={onClose} type="button">
                            Close
                        </button>
                    </section>
                ) : (
                    <>
                        <div className="fitting-content-grid">
                            <section
                                className="fitting-summary-panel"
                                aria-labelledby="fitting-summary-title"
                            >
                                <div className="fitting-summary-heading">
                                    <h3 id="fitting-summary-title">
                                        Diagnosis / Qualifying Conditions
                                    </h3>
                                    <button
                                        className="fitting-edit-button"
                                        onClick={onBack}
                                        type="button"
                                    >
                                        Edit
                                        <Edit3 size={13} strokeWidth={2.4} aria-hidden="true" />
                                    </button>
                                </div>

                                <div className="fitting-summary-columns">
                                    <div className="fitting-summary-column">
                                        <MiniTable rows={diagnosisRows} title="Diagnosis" />
                                        {notes.map((note) => (
                                            <section
                                                className="fitting-note-section"
                                                key={note.title}
                                            >
                                                <h4>{note.title}</h4>
                                                <p>{note.text}</p>
                                            </section>
                                        ))}
                                    </div>
                                    <div className="fitting-summary-column">
                                        <MiniTable
                                            rows={leftDeformityRows}
                                            title="Left Foot Deformities"
                                        />
                                        <MiniTable
                                            rows={rightDeformityRows}
                                            title="Right Foot Deformities"
                                        />
                                    </div>
                                </div>
                            </section>

                            <div className="fitting-side-panels">
                                <section
                                    className="fitting-card"
                                    aria-labelledby="shoe-selection-title"
                                >
                                    <h3 id="shoe-selection-title">Shoe Selection</h3>
                                    <div className="fitting-card-rule" />
                                    <FittingSelect
                                        id="castingProcess"
                                        label="Casting Process"
                                        onChange={updateSelection}
                                        value={values.castingProcess}
                                    />
                                </section>

                                <section
                                    className="fitting-card"
                                    aria-labelledby="measurements-title"
                                >
                                    <h3 id="measurements-title">Patient Measurements (Standing)</h3>
                                    <div className="fitting-card-rule" />
                                    <div className="fitting-measurement-fields">
                                        <FittingSelect
                                            id="leftFootWidth"
                                            label="Left Foot Width"
                                            onChange={updateSelection}
                                            value={values.leftFootWidth}
                                        />
                                        <FittingSelect
                                            id="leftFootLength"
                                            label="Left Foot Length"
                                            onChange={updateSelection}
                                            value={values.leftFootLength}
                                        />
                                        <FittingSelect
                                            id="rightFootWidth"
                                            label="Right Foot Width"
                                            onChange={updateSelection}
                                            value={values.rightFootWidth}
                                        />
                                        <FittingSelect
                                            id="rightFootLength"
                                            label="Right Foot Length"
                                            onChange={updateSelection}
                                            value={values.rightFootLength}
                                        />
                                    </div>
                                </section>
                            </div>
                        </div>

                        <footer className="fitting-footer">
                            {submitError ? (
                                <p className="fitting-submit-error" role="alert">
                                    {submitError}
                                </p>
                            ) : null}
                            <button
                                className="fitting-submit"
                                disabled={!requiredSelectionsComplete || isSubmitting}
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
