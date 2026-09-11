/**
 * Login page — auth feature.
 *
 * Authenticates against POST /api/Auth/login via authService.
 * On success, the JWT is decoded and roles are extracted before
 * storing the user in the Zustand auth store.
 *
 * The DEV role-override selector is retained so you can still
 * impersonate different roles locally without a real account.
 */
import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';
import { loginUser } from '../api/authService';
import { logger } from '../../../utils/logger';

//const ALL_ROLES = Object.values(AppRole);

const LoginPage: React.FC = () => {
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
            const result = await loginUser({ username: trimmedEmail, password: trimmedPassword });

            // If the API token carries no role claims and we are in DEV,
            // fall back to the manually-selected role for testing convenience.
            const rolesFromApi = result.user.roles.length > 0 ? result.user.roles : [];
            result.user.isLocationSet=false;
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

    return (
        <div className="background-container">
            <div className="login-box">
                <img
                    className="softgait-logo-sm"
                    src="/assets/images/softgait-logo-small.jpg"
                    alt="Softgait Logo"
                />

                {/* API-level error banner */}
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

                <form id="loginForm" onSubmit={handleSubmit}>
                    <div className="input-container">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => {
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

                    <div className="input-container">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
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
                        <a href="#forgot" className="forgot-password">
                            Forgot password?
                        </a>
                    </div>

                    {/* Role override — DEV only, hidden in production builds */}
                    {/*import.meta.env.DEV && (
                        <div className="input-container">
                            <label
                                htmlFor="role"
                                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                            >
                                Role Override
                                <span
                                    style={{
                                        fontSize: 10,
                                        fontWeight: 700,
                                        background: '#e8f4f8',
                                        color: '#103E52',
                                        padding: '1px 6px',
                                        borderRadius: 4,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                    }}
                                >
                                    Dev only
                                </span>
                            </label>
                            <select
                                id="role"
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value as AppRole)}
                                disabled={isLoading}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    borderRadius: 8,
                                    border: '1px solid #d0d5dd',
                                    fontSize: 14,
                                    background: '#fff',
                                    cursor: 'pointer',
                                }}
                            >
                                {ALL_ROLES.map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                            <p style={{ fontSize: 12, color: '#98a2b3', marginTop: 4 }}>
                                Applied when the API token contains no role claims.
                            </p>
                        </div>
                    )*/}

                    <button
                        type="submit"
                        className="login-btn"
                        disabled={isLoading}
                        style={{
                            opacity: isLoading ? 0.7 : 1,
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {isLoading ? (
                            <>
                                <i className="fas fa-circle-notch fa-spin" /> &nbsp;Signing in…
                            </>
                        ) : (
                            'Log in'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
