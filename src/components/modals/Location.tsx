import React, { useEffect, useMemo } from 'react';
import { usePracticeLocations } from '../../features/dpm/hooks/useLocation';
//import { useUIStore } from '../../store/useUIStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/modalcard.css';
//import type { PracticeUser } from '../dpm/types/locationTypes';
//import { logger } from '../../utils/logger';
import CustomDropdown from '../common/customDropdown';
import {
    toDropdownOption //, type DropdownOption
} from '../../types/dropdownOption';
import TasksLoadingSkeleton from '../common/taskLoading';
import TasksErrorState from '../common/taskError';
interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
}

export default function LocationModal({ isOpen, onClose, title = 'location' }: LocationModalProps) {
    const navigate = useNavigate();
    const { relogin } = useAuthStore();
    const location = useLocation();
    const { practiceUser, isLoading, isError, refetch } = usePracticeLocations();
    const [selectedLocation, setSelectedLocation] = React.useState<number>(0);
    const [selectedPractice, setSelectedPractice] = React.useState<number>(0);
    const [selectedPhysicianId, setSelectedPhysicianId] = React.useState<number>(0);
    //const [fillterdPractice, setfillterdPractice] = React.useState<DropdownOption[]>([]);
    const [selectedLocationError, setSelectedLocationError] = React.useState<boolean | null>(null);
    const [selectedPracticeError, setSelectedPracticeError] = React.useState<boolean | null>(null);
    const [apiError, setApiError] = React.useState<string | null>(null);
    // Transform assignedlocations into dropdown options
    const locationOptions = useMemo(() => {
        if (
            !practiceUser ||
            !practiceUser.assignedLocations ||
            practiceUser.assignedLocations.length === 0
        ) {
            return [];
        }

        return practiceUser.assignedLocations.map((loc: any) =>
            toDropdownOption(loc.locationId, `${loc.name} - ${loc.practiceName}`),
        );
    }, [practiceUser]);

    const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/tasks';
    // close on escape
    useEffect(() => {
        if (!isOpen) return;

        //const handleKeyDown = (e: KeyboardEvent) => {
        //    if (e.key === 'Escape') {
        //        onClose();
        //    }
        //};

        //document.addEventListener('keydown', handleKeyDown);

        //return () => {
        //    document.removeEventListener('keydown', handleKeyDown);
        //};
    }, [isOpen, onClose]);
    const handleLocation = (value: number) => {

        setSelectedLocation(value);
        setSelectedPractice(
            practiceUser?.assignedLocations?.find((m) => m.locationId === value)?.practiceId || 0,
        );
    };
    const handlePractice = useMemo(() => {
        const rows = practiceUser?.physicians || [];
        const ddOptions = rows
            .filter((r) => r.practiceId === selectedPractice)
            .map((r) => toDropdownOption(r.physicianId || 0, `${r.first} ${r.last}`));
        return ddOptions;
    }, [selectedPractice, practiceUser]);

    useEffect(() => {
        if (locationOptions.length !== 1 || selectedLocation) return;

        const locationId = locationOptions[0].value as number;
        setSelectedLocation(locationId);
        setSelectedPractice(
            practiceUser?.assignedLocations?.find((item) => item.locationId === locationId)
                ?.practiceId || 0,
        );
    }, [locationOptions, practiceUser, selectedLocation]);

    useEffect(() => {
        if (handlePractice.length === 1 && !selectedPhysicianId) {
            setSelectedPhysicianId(handlePractice[0].value as number);
        }
    }, [handlePractice, selectedPhysicianId]);
    //const setPhysician = (value:number) => {
    //    //const prac = practiceUser?.physicians((r) => r.pract === value);

    //    setSelectedPhysicianId(practiceUser?.physicianId as number);
    //};

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setApiError(null);

        const location = selectedLocation;
        const practice = selectedPractice;
        let valid = true;

        if (!location) {
            setSelectedLocationError(true);
            valid = false;
        } else {
            setSelectedLocationError(false);
        }

        if (!practice || !selectedPhysicianId) {
            setSelectedPracticeError(true);
            valid = false;
        } else {
            setSelectedPracticeError(false);
        }

        if (!valid) return;

        /*setIsLoading(true);*/
        try {
            relogin(selectedPhysicianId ?? 0, selectedPractice ?? 0, selectedLocation ?? 0);
            onClose();
            navigate(from, { replace: false });
        } catch (err: unknown) {
            const axiosErr = err as {
                response?: { practiceUser?: { message?: string }; status?: number };
            };
            const status = axiosErr.response?.status;

            if (status === 401 || status === 400) {
                setApiError('Please try again.');
            } else if (status === 403) {
                setApiError('Contact your administrator.');
            } else if (!navigator.onLine) {
                setApiError('No internet connection. Please check your network.');
            } else {
                setApiError('Unable to connect to the server. Please try again later.');
            }

            //logger.error(err instanceof Error ? err : new Error('request failed'), {
            //    status,
            //});
        } finally {
            //setIsLoading(false);
        }
    };
    // Show loading/error states

    if (isLoading) return <TasksLoadingSkeleton />;
    if (isError) return <TasksErrorState onRetry={refetch} />;

    return (
        <div className="modal-overlay location-modal-overlay">
            <div className="location-modal-card">
                {/* heading */}
                <h2 className="location-modal-title">
                    Welcome back, {practiceUser?.last} {practiceUser?.first}!
                </h2>

                {/* subtitle */}
                <p className="location-modal-subtitle">
                    Please select your {title} and signing physician:
                </p>
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

                {/* form */}
                <form
                    className="location-modal-form"
                    onSubmit={(e: React.SyntheticEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        handleSubmit(e);
                    }}
                >
                    {/* location */}
                    <div className="login-input-group location-dropdown-group">
                        <label>Location</label>
                        <CustomDropdown
                            value={selectedLocation}
                            options={locationOptions}
                            onChange={(value) => {
                                handleLocation(value as number);
                                setSelectedPhysicianId(0);
                                setApiError(null);
                            }}
                        />
                        {selectedLocationError && (
                            <p className="error-message show">Please select location.</p>
                        )}
                    </div>

                    {/* physician */}
                    <div className="login-input-group location-dropdown-group">
                        <label>Physician</label>
                        <CustomDropdown
                            value={selectedPhysicianId}
                            options={handlePractice}
                            onChange={(value) => {
                                setSelectedPhysicianId(value as number);
                                setApiError(null);
                            }}
                        />
                        {selectedPracticeError && (
                            <p className="error-message show">Please select a physician.</p>
                        )}
                    </div>

                    {/* submit */}
                    <button
                        type="submit"
                        className="login-submit-btn"
                        disabled={
                            !selectedLocation || !selectedPractice || !selectedPhysicianId
                        }
                    >
                        Load dashboard
                    </button>
                </form>
            </div>
        </div>
    );
}
