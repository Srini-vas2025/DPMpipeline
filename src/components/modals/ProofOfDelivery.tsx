import type { WorkflowContext } from '../../types/workflow';
import PatientModalMeta from '../workflow/PatientModalMeta';

type ProofOfDeliveryProps = {
    context: WorkflowContext;
    onBack: () => void;
    onClose: () => void;
    onSubmit?: () => void;
};

export default function ProofOfDelivery({
    context,
    onBack,
    onClose,
    onSubmit,
}: ProofOfDeliveryProps) {
    return (
        <>
            {/* header */}
            <div className="modal-simple-header">
                <div className="modal-title-group">
                    <button type="button" className="modal-back-btn" onClick={onBack}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>

                    <div className="modal-task-heading">
                        <h2 className="modal-title">Proof of Delivery</h2>
                        <PatientModalMeta context={context} />
                    </div>
                </div>

                <button
                    type="button"
                    className="modal-close-btn upload-forms-close"
                    aria-label="Close"
                    onClick={onClose}
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>

            {/* subtitle */}
            <p className="modal-subtitle-text">
                Ask the patient to digitally sign to complete, or download the forms to sign
                manually.
            </p>

            {/* signature */}
            <div className="signature-body">
                <div className="signature-area">
                    <div className="signature-placeholder">
                        <span className="signature-x">×</span>
                        <span className="signature-text">Sign Here</span>
                    </div>

                    <div className="signature-line"></div>
                </div>
            </div>

            {/* footer */}
            <div className="signature-footer">
                <button className="download-btn">Download & Print Forms</button>

                <button className="modal-submit-btn" onClick={onSubmit}>
                    Submit Form
                </button>
            </div>
        </>
    );
}
