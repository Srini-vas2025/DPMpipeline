import React from 'react';
import type { WorkflowContext } from '../../types/workflow';

interface ConfirmArrivalCardProps {
    context: WorkflowContext;
    onBack: () => void;
    onClose: () => void;
    onConfirm?: () => void;
}

const ConfirmArrivalCard: React.FC<ConfirmArrivalCardProps> = ({
    onBack,
    onClose,
    onConfirm,
}) => {
    const handleConfirm = () => {
        onBack?.();
        onConfirm?.();
        onClose();
    };

    return (
        <div className="confirm-arrival-overlay" onClick={onClose}>
            <div className="confirm-arrival-card" onClick={(e) => e.stopPropagation()}>
                <h2 className="confirm-arrival-title">Confirm Arrival</h2>

                <p
                    style={{
                        margin: '16px 0 0',
                        color: '#496b7a',
                        fontSize: '15px',
                        lineHeight: 1.5,
                    }}
                >
                    Has the order arrived? This will update the order status.
                </p>

                <div className="confirm-arrival-actions">
                    <button type="button" className="confirm-arrival-btn no-btn" onClick={onClose}>
                        No
                    </button>

                    <button
                        type="button"
                        className="confirm-arrival-btn yes-btn"
                        onClick={handleConfirm}
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmArrivalCard;
