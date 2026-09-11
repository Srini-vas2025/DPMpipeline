import { useState } from 'react';
import type { ActionType } from '../../features/patientdetail/types/patientmodal.api.types';
import PatientDetailsModal from '../../pages/PatientDetailPage';
import { toWorkflowContext, WORKFLOW_TITLES, type WorkflowAction } from '../../types/workflow';
import Modal from '../modal';
import ConfirmArrivalCard from '../modals/ConfirmArrivalCard';
import FittingDispensingModal from '../modals/FittingDispensingModal';
import OrderShoesModal from '../modals/OrderShoesModal';
import ProofOfDelivery from '../modals/ProofOfDelivery';
import ShoePrescriptionModal, { type ShoePrescriptionDraft } from '../modals/ShoePrescriptionModal';
import UploadForms from '../modals/UploadForms';
import CompressionOrderModal from '../orders/compression/CompressionOrderModal';

interface WorkflowModalHostProps {
    action: WorkflowAction | null;
    isOpen: boolean;
    onClose: () => void;
    onOpen: (action: WorkflowAction) => void;
    rawContext: unknown;
}

const patientActionMap: Record<ActionType, WorkflowAction> = {
    details: 'patient-details',
    dispensing: 'dispensing',
    inperson: 'in-person-fitting',
    notes: 'notes',
    proofOfDelivery: 'proof-of-delivery',
    uploadForms: 'upload-forms',
};

export default function WorkflowModalHost({
    action,
    isOpen,
    onClose,
    onOpen,
    rawContext,
}: WorkflowModalHostProps) {
    const context = toWorkflowContext(rawContext);
    const contextKey = String(
        context.personId ?? context.patientId ?? context.requestId ?? 'unknown-patient',
    );
    const [shoePrescriptionState, setShoePrescriptionState] = useState<{
        contextKey: string;
        draft: ShoePrescriptionDraft;
    } | null>(null);
    const shoePrescriptionDraft =
        shoePrescriptionState?.contextKey === contextKey ? shoePrescriptionState.draft : null;

    if (!action) return null;

    const backToPatient = () => onOpen('patient-details');

    let content;

    switch (action) {
        case 'patient-details':
            content = (
                <PatientDetailsModal
                    key={action}
                    initialTab="patient"
                    onActionClick={(patientAction) => onOpen(patientActionMap[patientAction])}
                    onClose={onClose}
                    personId={context.personId}
                    workflowContext={context}
                />
            );
            break;
        case 'shoe-prescription':
            content = (
                <ShoePrescriptionModal
                    context={context}
                    initialDraft={shoePrescriptionDraft}
                    onClose={onClose}
                    onContinueFitting={() => onOpen('in-person-fitting')}
                    onScheduleFitting={() => onOpen('notes')}
                    onSubmit={(draft) => setShoePrescriptionState({ contextKey, draft })}
                />
            );
            break;
        case 'compression-prescription':
            content = (
                <PatientDetailsModal
                    key={action}
                    initialTab="compression"
                    onActionClick={(patientAction) => onOpen(patientActionMap[patientAction])}
                    onClose={onClose}
                    personId={context.personId}
                    workflowContext={context}
                />
            );
            break;
        case 'in-person-fitting':
            content = (
                <FittingDispensingModal
                    context={context}
                    initialTab="fitting"
                    onClose={onClose}
                    onEditPrescription={() => onOpen('shoe-prescription')}
                    onScheduleAppointment={() => onOpen('notes')}
                    prescription={shoePrescriptionDraft}
                />
            );
            break;
        case 'dispensing':
            content = (
                <FittingDispensingModal
                    context={context}
                    initialTab="dispensing"
                    onClose={onClose}
                    onEditPrescription={() => onOpen('shoe-prescription')}
                    onScheduleAppointment={() => onOpen('notes')}
                    prescription={shoePrescriptionDraft}
                />
            );
            break;
        case 'proof-of-delivery':
            content = (
                <div
                    className="modal-card large-modal"
                    onClick={(event) => event.stopPropagation()}
                >
                    <ProofOfDelivery context={context} onBack={backToPatient} onClose={onClose} />
                </div>
            );
            break;
        case 'upload-forms':
            content = (
                <div
                    className="modal-card large-modal"
                    onClick={(event) => event.stopPropagation()}
                >
                    <UploadForms context={context} onClose={onClose} />
                </div>
            );
            break;
        case 'notes':
            content = (
                <PatientDetailsModal
                    key={action}
                    initialTab="notes"
                    onActionClick={(patientAction) => onOpen(patientActionMap[patientAction])}
                    onClose={onClose}
                    personId={context.personId}
                    workflowContext={context}
                />
            );
            break;
        case 'confirm-arrival':
            content = (
                <ConfirmArrivalCard context={context} onBack={backToPatient} onClose={onClose} />
            );
            break;
        case 'order-shoes':
            content = <OrderShoesModal context={context} onClose={onClose} />;
            break;
        case 'order-compression':
            content = <CompressionOrderModal context={context} isOpen onClose={onClose} />;
            break;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={WORKFLOW_TITLES[action]}>
            {content}
        </Modal>
    );
}
