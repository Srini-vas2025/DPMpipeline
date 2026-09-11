import React, { useEffect, useRef, useState } from 'react';
import { X, Bell, User, UserPlus } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

interface TopBarProps {
    alertText?: string;
    onAlertClose?: () => void;
    onCreatePatient?: () => void;
    onLogout?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ alertText, onAlertClose, onCreatePatient, onLogout }) => {
    const { user } = useAuthStore();
    const [openMenu, setOpenMenu] = useState<'alerts' | 'account' | null>(null);
    const actionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const closeMenus = (event: MouseEvent) => {
            if (!actionsRef.current?.contains(event.target as Node)) setOpenMenu(null);
        };
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpenMenu(null);
        };

        document.addEventListener('mousedown', closeMenus);
        document.addEventListener('keydown', closeOnEscape);
        return () => {
            document.removeEventListener('mousedown', closeMenus);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, []);

    return (
        <div className="topbar-wrapper">
            {/* topbar row */}
            <div className="topbar-main-row">
                {/* left section */}
                <div className="topbar-left">
                    <div className="topbar-welcome">Welcome back, {user?.username}</div>

                    {alertText ? (
                        <div className="topbar-alert" role="status">
                            <span>{alertText}</span>
                            <button
                                aria-label="Close notification"
                                className="topbar-alert-close"
                                onClick={onAlertClose}
                                type="button"
                            >
                                <X size={18} strokeWidth={2.5} aria-hidden="true" />
                            </button>
                        </div>
                    ) : null}
                </div>

                {/* right actions */}
                <div className="topbar-right">
                    <button className="topbar-btn" onClick={onCreatePatient} type="button">
                        Create New Patient
                    </button>

                    <button
                        className="topbar-btn-icon"
                        aria-label="Create New Patient"
                        onClick={onCreatePatient}
                        type="button"
                    >
                        <UserPlus size={18} strokeWidth={2.2} />
                    </button>

                    <div className="topbar-actions" ref={actionsRef}>
                        <div className="topbar-menu">
                            <button
                                type="button"
                                className="topbar-menu-trigger"
                                aria-label="Alerts"
                                aria-expanded={openMenu === 'alerts'}
                                aria-haspopup="menu"
                                onClick={() =>
                                    setOpenMenu((current) =>
                                        current === 'alerts' ? null : 'alerts',
                                    )
                                }
                            >
                                <Bell size={24} strokeWidth={2.2} aria-hidden="true" />
                            </button>
                            {openMenu === 'alerts' ? (
                                <div className="topbar-dropdown alerts-dropdown" role="menu">
                                    <div className="topbar-dropdown-title">Alerts</div>
                                    <p className="topbar-empty-state">No alerts at this time</p>
                                </div>
                            ) : null}
                        </div>

                        <div className="topbar-menu">
                            <button
                                type="button"
                                className="topbar-menu-trigger"
                                aria-label="Account"
                                aria-expanded={openMenu === 'account'}
                                aria-haspopup="menu"
                                onClick={() =>
                                    setOpenMenu((current) =>
                                        current === 'account' ? null : 'account',
                                    )
                                }
                            >
                                <User size={24} strokeWidth={2.4} aria-hidden="true" />
                            </button>
                            {openMenu === 'account' ? (
                                <div className="topbar-dropdown account-dropdown" role="menu">
                                    <div className="topbar-dropdown-title">Account</div>
                                    {user?.username ? (
                                        <div className="topbar-account-name">{user.username}</div>
                                    ) : null}
                                    <button
                                        type="button"
                                        className="topbar-logout-btn"
                                        role="menuitem"
                                        onClick={() => {
                                            setOpenMenu(null);
                                            onLogout?.();
                                        }}
                                    >
                                        Log out
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
