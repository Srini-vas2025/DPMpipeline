import type { WorkflowContext } from '../../types/workflow';
import PatientModalMeta from '../workflow/PatientModalMeta';

type UploadFormsProps = {
    context: WorkflowContext;
    onClose: () => void;
};

// upload boxes
const uploadBoxes = [
    'In-Person Fitting Documents',
    'Dispensing Documents',
    'Medical Records',
    'Product Prescriptions',
    'Other Documents',
];

// uploaded forms
const uploadedForms = [
    {
        documentType: 'In-Person Fitting Document',
        uploadDate: '7/23/25',
        filename: 'Fittingform.doc',
    },
    {
        documentType: 'Dispensing Document',
        uploadDate: '7/23/25',
        filename: 'Missing Patient Info',
    },
    {
        documentType: 'Medical Records',
        uploadDate: '7/23/25',
        filename: 'Missing Documents',
    },
    {
        documentType: 'Product Prescriptions',
        uploadDate: '7/23/25',
        filename: 'Pending Returns',
    },
];

export default function UploadForms({ context, onClose }: UploadFormsProps) {
    return (
        <>
            <div className="modal-simple-header">
                <div className="modal-title-group">
                    <div className="modal-task-heading">
                        <h2 className="modal-title">Upload Forms</h2>
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

            <div className="upload-forms-content">
                <div className="upload-forms-grid">
                    {uploadBoxes.map((box) => (
                        <div className="upload-box" key={box}>
                            <i className="fa-solid fa-upload upload-icon"></i>
                            <p>{box}</p>

                            <button type="button" className="upload-select-btn">
                                Select
                            </button>
                        </div>
                    ))}
                </div>

                <div className="upload-table-card">
                    <table className="upload-table">
                        <thead>
                            <tr>
                                <th>
                                    DOCUMENT TYPE{' '}
                                    <i className="fas fa-caret-down muted-sort-icon"></i>
                                </th>

                                <th>
                                    UPLOAD DATE{' '}
                                    <i className="fas fa-caret-down muted-sort-icon"></i>
                                </th>

                                <th>
                                    FILENAME <i className="fas fa-caret-down muted-sort-icon"></i>
                                </th>

                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {uploadedForms.map((form) => (
                                <tr key={form.documentType}>
                                    <td>{form.documentType}</td>
                                    <td>{form.uploadDate}</td>
                                    <td>{form.filename}</td>

                                    <td className="upload-action-cell">
                                        <button type="button" className="upload-view-btn">
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
