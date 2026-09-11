import { CalendarPlus, ChevronDown, PhoneOff, Printer, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { WorkflowContext } from '../../types/workflow';
import PatientModalMeta from '../workflow/PatientModalMeta';
import InPersonFittingForm from './InPersonFittingForm';
import DispensingFormModal from './NewDispensingForm';
import type { ShoePrescriptionDraft } from './ShoePrescriptionModal';
import '../../styles/FittingDispensingModal.css';

export type FittingDispensingTab = 'fitting' | 'dispensing';

interface FittingDispensingModalProps {
    context: WorkflowContext;
    initialTab: FittingDispensingTab;
    onClose: () => void;
    onEditPrescription: () => void;
    onScheduleAppointment: () => void;
    prescription?: ShoePrescriptionDraft | null;
}

const tabDescription: Record<FittingDispensingTab, string> = {
    fitting: 'Record shoe selection, casting method, and standing measurements for the fitting.',
    dispensing:
        "Complete the supplier's objective assessment of the shoes and inserts at delivery.",
};

const tabs: FittingDispensingTab[] = ['fitting', 'dispensing'];

export default function FittingDispensingModal({
    context,
    initialTab,
    onClose,
    onEditPrescription,
    onScheduleAppointment,
    prescription,
}: FittingDispensingModalProps) {
    const [activeTab, setActiveTab] = useState<FittingDispensingTab>(initialTab);
    const [showActions, setShowActions] = useState(false);
    const [showCannotContactConfirmation, setShowCannotContactConfirmation] = useState(false);
    const [cannotContact, setCannotContact] = useState(false);
    const actionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!showActions) return;

        const closeActions = (event: MouseEvent) => {
            if (!actionsRef.current?.contains(event.target as Node)) setShowActions(false);
        };

        document.addEventListener('mousedown', closeActions);
        return () => document.removeEventListener('mousedown', closeActions);
    }, [showActions]);

    const handleTabKeyDown = (
        event: KeyboardEvent<HTMLButtonElement>,
        tab: FittingDispensingTab,
    ) => {
        const currentIndex = tabs.indexOf(tab);
        let nextIndex = currentIndex;

        if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
        else if (event.key === 'ArrowLeft')
            nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') nextIndex = 0;
        else if (event.key === 'End') nextIndex = tabs.length - 1;
        else return;

        event.preventDefault();
        const nextTab = tabs[nextIndex];
        setActiveTab(nextTab);
        document.getElementById(`${nextTab}-form-tab`)?.focus();
    };

    const handlePrint = () => {
        setShowActions(false);
        window.print();
    };

    const handleScheduleAppointment = () => {
        setShowActions(false);
        onScheduleAppointment();
    };

    const handleCannotContact = () => {
        setShowActions(false);
        setShowCannotContactConfirmation(true);
    };

    return (
        <div className="shoe-prototype fitting-dispensing-prototype">
            <section
                className="fitting-dispensing-modal"
                aria-labelledby="fitting-dispensing-title"
            >
                <button
                    aria-label="Close modal"
                    className="fitting-dispensing-close"
                    onClick={onClose}
                    type="button"
                >
                    <X aria-hidden="true" size={22} strokeWidth={2.8} />
                </button>

                <div className="fitting-dispensing-actions" ref={actionsRef}>
                    <button
                        aria-expanded={showActions}
                        aria-haspopup="menu"
                        className="fitting-dispensing-actions-button"
                        onClick={() => setShowActions((current) => !current)}
                        type="button"
                    >
                        Actions
                        <ChevronDown aria-hidden="true" size={16} strokeWidth={2.8} />
                    </button>

                    {showActions ? (
                        <div className="fitting-dispensing-actions-menu" role="menu">
                            <button onClick={handlePrint} role="menuitem" type="button">
                                <Printer aria-hidden="true" size={17} />
                                Print forms
                            </button>
                            <button
                                onClick={handleScheduleAppointment}
                                role="menuitem"
                                type="button"
                            >
                                <CalendarPlus aria-hidden="true" size={17} />
                                Schedule appointment
                            </button>
                            <button
                                className="danger"
                                disabled={cannotContact}
                                onClick={handleCannotContact}
                                role="menuitem"
                                type="button"
                            >
                                <PhoneOff aria-hidden="true" size={17} />
                                {cannotContact
                                    ? 'Marked as cannot contact'
                                    : 'Mark as cannot contact'}
                            </button>
                        </div>
                    ) : null}
                </div>

                <header className="fitting-dispensing-header">
                    <div className="modal-task-heading">
                        <h2 id="fitting-dispensing-title">Fitting &amp; Dispensing</h2>
                        <PatientModalMeta context={context} />
                    </div>
                    <div className="fitting-dispensing-header-copy">
                        <p>{tabDescription[activeTab]}</p>
                        {cannotContact ? (
                            <span role="status">
                                <PhoneOff aria-hidden="true" size={14} />
                                Patient marked as cannot contact
                            </span>
                        ) : null}
                    </div>
                </header>

                <nav
                    aria-label="Fitting and dispensing forms"
                    className="fitting-dispensing-tabs"
                    role="tablist"
                >
                    {tabs.map((tab) => {
                        const active = activeTab === tab;

                        return (
                            <button
                                aria-controls={`${tab}-form-panel`}
                                aria-selected={active}
                                className={active ? 'active' : ''}
                                id={`${tab}-form-tab`}
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                onKeyDown={(event) => handleTabKeyDown(event, tab)}
                                role="tab"
                                tabIndex={active ? 0 : -1}
                                type="button"
                            >
                                <span>
                                    {tab === 'fitting' ? 'In-Person Fitting' : 'Dispensing'}
                                </span>
                            </button>
                        );
                    })}
                </nav>

                <div className="fitting-dispensing-content">
                    <div
                        aria-labelledby="fitting-form-tab"
                        className="fitting-dispensing-tab-panel"
                        hidden={activeTab !== 'fitting'}
                        id="fitting-form-panel"
                        role="tabpanel"
                    >
                        <InPersonFittingForm
                            context={context}
                            embedded
                            onBack={onEditPrescription}
                            onClose={onClose}
                            prescription={prescription}
                        />
                    </div>
                    <div
                        aria-labelledby="dispensing-form-tab"
                        className="fitting-dispensing-tab-panel"
                        hidden={activeTab !== 'dispensing'}
                        id="dispensing-form-panel"
                        role="tabpanel"
                    >
                        <DispensingFormModal embedded onClose={onClose} patient={context} />
                    </div>
                </div>

                {showCannotContactConfirmation ? (
                    <div className="fitting-dispensing-confirmation-backdrop">
                        <section
                            aria-labelledby="cannot-contact-title"
                            aria-modal="true"
                            className="fitting-dispensing-confirmation"
                            role="alertdialog"
                        >
                            <div className="fitting-dispensing-confirmation-icon">
                                <PhoneOff aria-hidden="true" size={24} />
                            </div>
                            <h3 id="cannot-contact-title">Mark as cannot contact?</h3>
                            <p>
                                This will flag {context.patientName?.trim() || 'this patient'} as
                                unable to be reached for this workflow session.
                            </p>
                            <div>
                                <button
                                    className="secondary"
                                    onClick={() => setShowCannotContactConfirmation(false)}
                                    type="button"
                                >
                                    Cancel
                                </button>
                                <button
                                    className="danger"
                                    onClick={() => {
                                        setCannotContact(true);
                                        setShowCannotContactConfirmation(false);
                                    }}
                                    type="button"
                                >
                                    Mark as cannot contact
                                </button>
                            </div>
                        </section>
                    </div>
                ) : null}
            </section>
        </div>
    );
}
