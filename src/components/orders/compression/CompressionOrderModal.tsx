import { useState } from 'react';
import type { WorkflowContext } from '../../../types/workflow';
import PatientModalMeta from '../../workflow/PatientModalMeta';

type Props = {
    isOpen: boolean;
    context: WorkflowContext;
    onClose: () => void;
};

export default function CompressionOrderModal({ isOpen, context, onClose }: Props) {
    // order step
    const [step, setStep] = useState(1);

    // selected products
    const [cart, setCart] = useState<{ [key: string]: boolean }>({
        A6530: false,
        A6583: false,
    });

    if (!isOpen) return null;

    // toggle product
    const toggleCart = (code: string) => {
        setCart((prev) => ({
            ...prev,
            [code]: !prev[code],
        }));
    };

    const allSelected = Object.values(cart).every(Boolean);

    return (
        <div className="confirm-arrival-overlay" onClick={onClose}>
            <div className="order-modal-card" onClick={(e) => e.stopPropagation()}>
                {/* header */}
                <div className="modal-header-grid">
                    <div className="modal-task-heading">
                        {step > 1 && (
                            <button className="back-btn" onClick={() => setStep(step - 1)}>
                                ← Back
                            </button>
                        )}

                        <h3 className="modal-title">Order Compression</h3>
                        <PatientModalMeta context={context} />
                    </div>

                    <div />

                    <div className="modal-close" onClick={onClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </div>
                </div>

                {/* step 1 */}
                {step === 1 && (
                    <div className="compression-order-flow">
                        <h4 className="compression-section-title">Products Requested:</h4>

                        <div className="compression-table-wrapper">
                            <table className="compression-products-table">
                                <thead>
                                    <tr>
                                        <th>HCPCS</th>
                                        <th>DESCRIPTION</th>
                                        <th className="text-right">SIDE OF BODY</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>A6530</td>
                                        <td>Compression stocking, below knee 18-30</td>
                                        <td className="text-right">Left, Right</td>
                                    </tr>

                                    <tr>
                                        <td>A6530</td>
                                        <td>Compression stocking, below knee 18-30</td>
                                        <td className="text-right">Left, Right</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="compression-divider"></div>

                        <div className="compression-footer">
                            <button
                                type="button"
                                className="primary-btn"
                                onClick={() => setStep(2)}
                            >
                                Continue to Measurements
                            </button>
                        </div>
                    </div>
                )}

                {/* step 2 */}
                {step === 2 && (
                    <div className="product-flow">
                        <div className="left">
                            <input className="search-input" placeholder="Search" />

                            <h5>Products Required</h5>

                            {['A6530', 'A6583'].map((code) => (
                                <div className="required-item" key={code}>
                                    <span>{code}</span>

                                    <input
                                        type="checkbox"
                                        checked={cart[code]}
                                        onChange={() => toggleCart(code)}
                                    />
                                </div>
                            ))}

                            <button
                                className={`primary-btn full ${!allSelected ? 'disabled' : ''}`}
                                disabled={!allSelected}
                                onClick={() => setStep(3)}
                            >
                                Continue to Order
                            </button>
                        </div>

                        <div className="right">
                            <h5>All Matching Products</h5>

                            {['A6530', 'A6583'].map((code) => (
                                <div
                                    className="product-card"
                                    key={code}
                                    onClick={() => toggleCart(code)}
                                >
                                    <div className="product-code">{code}</div>

                                    <div className="product-title">Compreflex Standard Knee</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* step 3 */}
                {step === 3 && (
                    <>
                        <h4 className="section-title">Products Selected</h4>

                        {Object.entries(cart)
                            .filter(([, value]) => value)
                            .map(([code]) => (
                                <div key={code} className="summary-card">
                                    {code}
                                </div>
                            ))}

                        <div className="footer-right">
                            <button className="primary-btn" onClick={() => setStep(4)}>
                                Place Order
                            </button>
                        </div>
                    </>
                )}

                {/* step 4 */}
                {step === 4 && (
                    <div className="loader">
                        <div className="spinner" />
                    </div>
                )}

                {/* step 5 */}
                {step === 5 && (
                    <div className="success">
                        ✔ Order Confirmed
                        <button className="primary-btn" onClick={onClose}>
                            Okay
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
