import React, { useEffect, useState } from "react";
import '../../styles/LoginModal.css';

type ResetPasswordModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onBackToLogin: () => void;
};

export default function ResetPasswordModal({
    isOpen,
    onClose,
    onBackToLogin,
}: ResetPasswordModalProps) {
    // email input
    const [email, setEmail] = useState("");

    // close on escape
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    // submit form
    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        alert("Reset link sent");
    };

    if (!isOpen) return null;

    return (
        <div
            className="login-modal-overlay"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="login-modal-card reset-modal-card">
                <div className="reset-modal-content">
                    <h2 className="reset-title">Reset your password</h2>

                    <p className="reset-description">
                        We’ll email you a link to reset your password.
                    </p>

                    <form onSubmit={handleSubmit} className="login-modal-form">
                        <div className="login-input-group">
                            <label htmlFor="reset-email">Email</label>

                            <input
                                id="reset-email"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="login-submit-btn">
                            Send reset link
                        </button>

                        <p className="back-to-login-text">
                            or{" "}
                            <span
                                className="back-to-login-link"
                                onClick={onBackToLogin}
                            >
                                go back to login
                            </span>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}