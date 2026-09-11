import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCartArrowDown,
    faCartShopping,
    faClipboardCheck,
    faListCheck,
    faMoneyCheckDollar,
    faShoePrints,
} from '@fortawesome/free-solid-svg-icons';
import { NAV_ITEMS } from '../types';
import { ROUTE_ROLES } from '../types/roles';
import { usePermissions } from '../hooks/usePermissions';

interface SidebarProps {
    onNavClick?: () => void;
    isOpen?: boolean;
    onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavClick, isOpen = false, onClose }) => {
    const { hasRole } = usePermissions();
    const navigate = useNavigate();
    const location = useLocation();

    const visibleItems = NAV_ITEMS.filter((item) => {
        const allowedRoles = ROUTE_ROLES[item.path] ?? [];
        return allowedRoles.length === 0 || hasRole(...allowedRoles);
    });
    const activeIndex = visibleItems.findIndex((item) => location.pathname === item.path);

    return (
        <>
            {/* Overlay — clicking it closes the sidebar on mobile */}
            <div className={`sidebar-overlay ${isOpen ? 'show' : ''}`} onClick={onClose} />

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-logo">
                    <img alt="Softgait Logo" src="/assets/images/softgait-logo-full.png" />
                </div>

                <nav className="sidebar-nav">
                    {activeIndex >= 0 && (
                        <span
                            className="nav-selection-indicator"
                            style={{ '--active-nav-index': activeIndex } as React.CSSProperties}
                            aria-hidden="true"
                        />
                    )}
                    {visibleItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.id}
                                type="button"
                                className={`side-nav-item ${isActive ? 'active' : ''}`}
                                aria-current={isActive ? 'page' : undefined}
                                onClick={() => {
                                    navigate(item.path);
                                    onNavClick?.();
                                    if (window.innerWidth <= 768) {
                                        onClose?.();
                                    }
                                }}
                            >
                                {item.id === 'patient-nav' ? (
                                    <FontAwesomeIcon
                                        icon={faListCheck}
                                        className={`nav-icon ${
                                            isActive ? 'nav-icon-fa-solid' : 'nav-icon-fa-regular'
                                        }`}
                                        aria-hidden="true"
                                    />
                                ) : item.id === 'appointments-nav' ? (
                                    <i
                                        className={`${
                                            isActive ? 'fa-solid' : 'fa-regular'
                                        } fa-calendar-days nav-icon nav-icon-solid`}
                                        aria-hidden="true"
                                    />
                                ) : item.id === 'equipment-nav' ? (
                                    <FontAwesomeIcon
                                        icon={faCartShopping}
                                        className={`nav-icon ${
                                            isActive ? 'nav-icon-fa-solid' : 'nav-icon-fa-regular'
                                        }`}
                                        aria-hidden="true"
                                    />
                                ) : item.id === 'orders-nav' ? (
                                    <FontAwesomeIcon
                                        icon={faCartArrowDown}
                                        className={`nav-icon ${
                                            isActive ? 'nav-icon-fa-solid' : 'nav-icon-fa-regular'
                                        }`}
                                        aria-hidden="true"
                                    />
                                ) : item.id === 'inventory-nav' ? (
                                    <FontAwesomeIcon
                                        icon={faClipboardCheck}
                                        className={`nav-icon ${
                                            isActive ? 'nav-icon-fa-solid' : 'nav-icon-fa-regular'
                                        }`}
                                        aria-hidden="true"
                                    />
                                ) : item.id === 'fitter-nav' ? (
                                    <FontAwesomeIcon
                                        icon={faShoePrints}
                                        className={`nav-icon ${
                                            isActive ? 'nav-icon-fa-solid' : 'nav-icon-fa-regular'
                                        }`}
                                        aria-hidden="true"
                                    />
                                ) : item.id === 'reports-nav' ? (
                                    <FontAwesomeIcon
                                        icon={faMoneyCheckDollar}
                                        className={`nav-icon ${
                                            isActive ? 'nav-icon-fa-solid' : 'nav-icon-fa-regular'
                                        }`}
                                        aria-hidden="true"
                                    />
                                ) : null}
                                <span className="side-nav-items-label">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
