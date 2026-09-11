import React, { useEffect, useState, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import TopBar from '../components/topBar';
import { useUIStore } from '../store/useUIStore';
import { useAuthStore } from '../store/useAuthStore';
import { useTasks } from '../features/tasks/hooks/useTasks';
import LocationModal from '../components/modals/Location';
import { useTaskFilterStore } from '../store/taskFilterStore';
import WorkflowModalHost from '../components/workflow/WorkflowModalHost';

const sidebarBreakpoint = 1024;

const MainLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLocationSet, setIsLocationSet] = useState(
        useAuthStore((state) => state.user)?.isLocationSet || false,
    );
    const showStatCards = location.pathname === '/tasks';
    const {
        alertVisible,
        setAlertVisible,
        modalOpen,
        closeModal,
        openModal,
        activeModal,
        modalObject,
    } = useUIStore();
    const { logout } = useAuthStore();
    const { tasks } = useTasks();
    const activeTaskFilters = useTaskFilterStore((state) => state.activeFilters);
    const setActiveTaskFilters = useTaskFilterStore((state) => state.setActiveFilters);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= sidebarBreakpoint);

    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > sidebarBreakpoint);

    const isStatCardSelected = (filters: string[]) =>
        activeTaskFilters.length === filters.length &&
        filters.every((filter) => activeTaskFilters.includes(filter));

    const handleStatCardClick = (filters: string[]) => {
        setActiveTaskFilters(isStatCardSelected(filters) ? [] : filters);
        if (location.pathname !== '/tasks') navigate('/tasks');
    };

    const countTasksFor = (filters: string[]) =>
        tasks.filter((task) => filters.includes(task.actionLabel)).length;

    // Sync sidebar open state on resize
    useEffect(() => {
        const handleResize = () => {
            const smallScreen = window.innerWidth <= sidebarBreakpoint;
            setIsMobile(smallScreen);
            setIsSidebarOpen(!smallScreen); // ← open on desktop, closed on mobile
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // MainLayout.tsx
    const handleLocation = () => setIsLocationSet(true);

    const mainContentRef = useRef<HTMLElement>(null); // ← add this ref

    // Keyboard: Escape closes modal, PageUp/Down scrolls
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                const closeButton = document.querySelector(
                    '.modal-close-btn, .confirm-arrival-overlay',
                ) as HTMLElement | null;
                closeButton?.click();
            }
            if (event.key === 'PageDown') {
                event.preventDefault();
                mainContentRef.current?.scrollBy({
                    // ← scroll the container, not window
                    top: window.innerHeight * 0.8,
                    behavior: 'smooth',
                });
            }
            if (event.key === 'PageUp') {
                event.preventDefault();
                mainContentRef.current?.scrollBy({
                    // ← same here
                    top: -window.innerHeight * 0.8,
                    behavior: 'smooth',
                });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSidebarToggle = () => setIsSidebarOpen((prev) => !prev);
    const handleSidebarClose = () => setIsSidebarOpen(false);

    return (
        <div className="master-page">
            {/* Mobile hamburger button */}
            {isMobile && (
                <button
                    type="button"
                    className="mobile-menu-toggle"
                    onClick={handleSidebarToggle}
                    aria-label="Toggle menu"
                >
                    {isSidebarOpen ? '✕' : '☰'}
                </button>
            )}

            {/* Sidebar — overlay + open class driven by isSidebarOpen */}
            <Sidebar
                isOpen={isSidebarOpen} // ← passes live state
                onClose={handleSidebarClose}
            />

            <main className="master-page-content" ref={mainContentRef}>
                <TopBar
                    alertText={alertVisible ? 'Global notification that you can close' : undefined}
                    onAlertClose={() => setAlertVisible(false)}
                    onCreatePatient={() => useUIStore.getState().openModal(null, 'patient-details')}
                    onLogout={logout}
                />
                <div className="page-content">
                    {showStatCards && (
                        <div className="stat-cards">
                            <button
                                type="button"
                                className={`stat-card${
                                    isStatCardSelected(['Fill Shoe Rx', 'Fill Compression Rx'])
                                        ? ' selected'
                                        : ''
                                }`}
                                aria-pressed={isStatCardSelected([
                                    'Fill Shoe Rx',
                                    'Fill Compression Rx',
                                ])}
                                onClick={() =>
                                    handleStatCardClick(['Fill Shoe Rx', 'Fill Compression Rx'])
                                }
                            >
                                <div className="stat-card-icon">
                                    <i className="fas fa-prescription-bottle-medical" />
                                </div>
                                <div className="stat-card-title">Pending RX</div>
                                <div className="stat-card-count">
                                    {countTasksFor(['Fill Shoe Rx', 'Fill Compression Rx'])}
                                </div>
                                <div className="stat-card-description">
                                    Orders pending your approval
                                </div>
                            </button>
                            <button
                                type="button"
                                className={`stat-card${
                                    isStatCardSelected(['Fit Shoes', 'Fit Compression'])
                                        ? ' selected'
                                        : ''
                                }`}
                                aria-pressed={isStatCardSelected(['Fit Shoes', 'Fit Compression'])}
                                onClick={() =>
                                    handleStatCardClick(['Fit Shoes', 'Fit Compression'])
                                }
                            >
                                <div className="stat-card-icon">
                                    <i className="fas fa-shoe-prints" />
                                </div>
                                <div className="stat-card-title">Need Fitting</div>
                                <div className="stat-card-count">
                                    {countTasksFor(['Fit Shoes', 'Fit Compression'])}
                                </div>
                                <div className="stat-card-description">
                                    Orders pending your fitting appointment paper work
                                </div>
                            </button>
                            <button
                                type="button"
                                className={`stat-card${
                                    isStatCardSelected(['Dispense Shoes', 'Proof of Delivery'])
                                        ? ' selected'
                                        : ''
                                }`}
                                aria-pressed={isStatCardSelected([
                                    'Dispense Shoes',
                                    'Proof of Delivery',
                                ])}
                                onClick={() =>
                                    handleStatCardClick(['Dispense Shoes', 'Proof of Delivery'])
                                }
                            >
                                <div className="stat-card-icon">
                                    <i className="fas fa-file-prescription" />
                                </div>
                                <div className="stat-card-title">Need Dispensing</div>
                                <div className="stat-card-count">
                                    {countTasksFor(['Dispense Shoes', 'Proof of Delivery'])}
                                </div>
                                <div className="stat-card-description">
                                    Orders pending dispensing and proof of delivery
                                </div>
                            </button>
                        </div>
                    )}
                    <Outlet />
                </div>
            </main>

            <WorkflowModalHost
                action={activeModal}
                isOpen={modalOpen}
                onClose={closeModal}
                onOpen={(action) => openModal(modalObject, action)}
                rawContext={modalObject}
            />
            {!isLocationSet && (
                <LocationModal isOpen={!isLocationSet} onClose={() => handleLocation()} />
            )}
            {/* Add more modals here for dispensing, upload, print, notes */}
        </div>
    );
};

export default MainLayout;
