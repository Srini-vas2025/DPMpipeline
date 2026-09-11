import React, { useEffect, useCallback } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        },
        [onClose],
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    //return (
    //    <div
    //        className="modal-overlay"
    //        onClick={(e) => {
    //            if (e.target === e.currentTarget) onClose();
    //        }}
    //        role="dialog"
    //        aria-modal="true"
    //        aria-label={title ?? 'Modal'}
    //    >
    //        <div className="modal-frame">{children}</div>
    //    </div>
    //);
    return (
        <div
            className="modal-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
            role="dialog"
            aria-modal="true"
            aria-label={title ?? 'Modal'}
        >
            {children}  {/* ← remove the modal-frame wrapper */}
        </div>
    );
};

export default Modal;
