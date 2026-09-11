import React, { useState } from 'react';

interface LoginProps {
    onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        let formIsValid = true;

        // Email validation
        if (!emailPattern.test(trimmedEmail)) {
            setEmailError(true);
            formIsValid = false;
        } else {
            setEmailError(false);
        }

        // Password validation
        if (trimmedPassword === '') {
            setPasswordError(true);
            formIsValid = false;
        } else {
            setPasswordError(false);
        }

        // If everything is valid, move to main page
        if (formIsValid) {
            // Store login state in localStorage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('user', email);
            onLoginSuccess();
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

                <form id="loginForm" onSubmit={handleSubmit}>
                    <div className="input-container">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {passwordError && (
                            <p className="error-message show">Please enter your password.</p>
                        )}
                        <a href="#forgot" className="forgot-password">
                            Forgot password?
                        </a>
                    </div>

                    <button type="submit" className="login-btn">
                        Log in
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
