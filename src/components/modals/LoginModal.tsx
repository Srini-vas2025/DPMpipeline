import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/LoginModal.css';
import softgaitLogoSM from '../../assets/images/softgait-logo-small.jpg';
import { useAuthStore } from '../../store/useAuthStore';
import { loginUser } from '../../features/auth/api/authService';
import { logger } from '../../utils/logger';
import { AppRole } from '../../types/roles';
import { disableDemoMode, enableDemoMode } from '../../lib/demoMode';

type LoginModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onForgotPassword: () => void;
};

export default function LoginModal({ isOpen, onClose, onForgotPassword }: LoginModalProps) {
    // navigation
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuthStore();

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [emailError, setEmailError] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);
    const [apiError, setApiError] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/tasks';

    const handleDemoLogin = () => {
        enableDemoMode();

        login({
            username: 'demo@softgait.local',
            name: 'Demo Admin',
            roles: [AppRole.Admin],
            physicianId: 101,
            practiceId: 201,
            locationId: 301,
            id: 1,
            isLocationSet: true,
        });
        navigate(from, { replace: true });
    };

    // close on escape
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    // submit form
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setApiError(null);

        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        let valid = true;

        if (!emailPattern.test(trimmedEmail)) {
            setEmailError(true);
            valid = false;
        } else {
            setEmailError(false);
        }

        if (trimmedPassword === '') {
            setPasswordError(true);
            valid = false;
        } else {
            setPasswordError(false);
        }

        if (!valid) return;

        setIsLoading(true);
        try {
            disableDemoMode();
            const result = await loginUser({ username: trimmedEmail, password: trimmedPassword });

            // If the API token carries no role claims and we are in DEV,
            // fall back to the manually-selected role for testing convenience.
            const rolesFromApi = result.user.roles.length > 0 ? result.user.roles : [];

            login({ ...result.user, roles: rolesFromApi }, result.token);
            navigate(from, { replace: true });
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string }; status?: number } };
            const status = axiosErr.response?.status;

            if (status === 401 || status === 400) {
                setApiError('Invalid email or password. Please try again.');
            } else if (status === 403) {
                setApiError('Your account has been deactivated. Contact your administrator.');
            } else if (!navigator.onLine) {
                setApiError('No internet connection. Please check your network.');
            } else {
                setApiError('Unable to connect to the server. Please try again later.');
            }

            logger.error(err instanceof Error ? err : new Error('Login failed'), {
                email: trimmedEmail,
                status,
            });
        } finally {
            setIsLoading(false);
        }
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
            <div className="login-modal-card">
                <img className="login-modal-logo" src={softgaitLogoSM} alt="Softgait Logo" />

                <form className="login-modal-form" onSubmit={handleSubmit}>
                    <div className="login-input-group">
                        <label htmlFor="login-email">Email</label>

                        <input
                            id="login-email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setEmail(e.target.value);
                                setApiError(null);
                            }}
                            disabled={isLoading}
                        />
                        {emailError && (
                            <p className="error-message show">
                                Please enter a valid email address.
                            </p>
                        )}
                    </div>

                    <div className="login-input-group">
                        <div className="password-row">
                            <label htmlFor="login-password">Password</label>

                            <span className="forgot-password-link" onClick={onForgotPassword}>
                                Forgot password?
                            </span>
                        </div>

                        <input
                            id="login-password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setApiError(null);
                            }}
                            disabled={isLoading}
                        />
                        {passwordError && (
                            <p className="error-message show">Please enter your password.</p>
                        )}
                    </div>
                    {apiError && (
                        <div
                            style={{
                                background: '#fef3f2',
                                border: '1px solid #fecdca',
                                borderRadius: 8,
                                padding: '10px 14px',
                                marginBottom: 16,
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 8,
                            }}
                        >
                            <i
                                className="fas fa-circle-exclamation"
                                style={{ color: '#d92d20', marginTop: 2 }}
                            />
                            <span style={{ fontSize: 14, color: '#b42318' }}>{apiError}</span>
                        </div>
                    )}
                    <button type="submit" className="login-submit-btn" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <i className="fas fa-circle-notch fa-spin" /> &nbsp;Signing in…
                            </>
                        ) : (
                            'Log in'
                        )}
                    </button>
                    {import.meta.env.DEV && (
                        <>
                            <div className="login-demo-divider" aria-hidden="true">
                                <span>or</span>
                            </div>
                            <button
                                type="button"
                                className="login-demo-btn"
                                onClick={handleDemoLogin}
                                disabled={isLoading}
                            >
                                Continue as demo admin
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
