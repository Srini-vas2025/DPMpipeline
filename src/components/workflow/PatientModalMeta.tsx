import { formatWorkflowDob, type WorkflowContext } from '../../types/workflow';

interface PatientModalMetaProps {
    context: WorkflowContext;
}

export default function PatientModalMeta({ context }: PatientModalMetaProps) {
    const patientName = context.patientName?.trim() || 'Patient';
    const patientId = context.patientId ?? context.personId ?? '—';
    const dob = formatWorkflowDob(context.dob) || '—';

    return (
        <div className="modal-patient-meta" aria-label="Patient details">
            <span>{patientName}</span>
            <i aria-hidden="true">|</i>
            <span>ID #{patientId}</span>
            <i aria-hidden="true">|</i>
            <span>{dob}</span>
        </div>
    );
}
