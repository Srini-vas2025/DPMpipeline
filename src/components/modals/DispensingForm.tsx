import { useState } from 'react';

type DispensingFormProps = {
    onBack: () => void;
    onClose: () => void;
};

export default function DispensingForm({ onBack, onClose }: DispensingFormProps) {
    // form states
    const [checkedItems, setCheckedItems] = useState<number[]>([]);
    const [isCertified, setIsCertified] = useState(false);

    // checklist items
    const items = [
        'I observed the patient wearing therapeutic shoes and inserts.',
        'Proper fitting was determined by length, width, and volume as measured.',
        'Stability was established by observing the patient walking with no heel slippage.',
        'No redness or pressure areas after removing shoes and inserts.',
        'No modifications were needed.',
    ];

    // toggle checklist
    const toggleItem = (index: number) => {
        setCheckedItems((prev) =>
            prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index],
        );
    };

    return (
        <>
            {/* header */}
            <div className="modal-simple-header">
                <div className="modal-title-group">
                    <button type="button" className="modal-back-btn" onClick={onBack}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>

                    <h2 className="modal-title">Dispensing Form</h2>
                </div>

                <button type="button" className="modal-close-btn" onClick={onClose}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>

            {/* subtitle */}
            <p className="modal-subtitle-text">
                Complete Supplier’s objective assessments of the fit of shoes & inserts while
                patient is wearing shoes at the time of delivery.
            </p>

            {/* form grid */}
            <div className="form-modal-grid">
                <div className="form-modal-card">
                    <div className="form-modal-card-title">Patients: Steve Miller</div>

                    {items.map((item, index) => (
                        <div className="form-modal-row" key={item}>
                            <span>{item}</span>

                            <button
                                type="button"
                                className={`modal-check-box ${
                                    checkedItems.includes(index) ? 'active' : ''
                                }`}
                                onClick={() => toggleItem(index)}
                            >
                                <i className="fa-solid fa-check"></i>
                            </button>
                        </div>
                    ))}
                </div>

                <div className="form-modal-card">
                    <div className="form-modal-card-title">Additional Information (optional)</div>

                    <div className="form-modal-textarea-wrap">
                        <textarea
                            className="form-modal-textarea"
                            placeholder="If modifications were needed, mention here"
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* footer */}
            <div className="modal-footer">
                <label className="modal-check-row">
                    <input
                        type="checkbox"
                        checked={isCertified}
                        onChange={(e) => setIsCertified(e.target.checked)}
                    />
                    I certify that all assessments are true and accurate.
                </label>

                <button type="button" className="modal-submit-btn">
                    Submit Form
                </button>
            </div>
        </>
    );
}
