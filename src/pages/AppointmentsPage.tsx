import { useMemo, useState } from 'react';
import PaginationNumbers from '../components/common/PaginationNumbers';
import { useTasks } from '../features/tasks/hooks/useTasks';
import {
    formatAppointmentDate,
    formatAppointmentTime,
    parseAppointmentDateTime,
} from '../features/appointments/utils';

type AppointmentType = 'Fitting' | 'Dispensing';

type AppointmentRow = {
    id: string;
    date: string;
    time: string;
    patient: string;
    patientId: string;
    appointmentType: AppointmentType;
    product: string;
    orderStatus: string;
};

const rowsPerPage = 10;
const appointmentTypes: AppointmentType[] = ['Fitting', 'Dispensing'];

const escapeCsvValue = (value: string) => `"${value.replaceAll('"', '""')}"`;

export default function AppointmentsPage() {
    const { tasks, isLoading, isError, refetch } = useTasks();
    const [searchText, setSearchText] = useState('');
    const [activeTypes, setActiveTypes] = useState<AppointmentType[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const appointments = useMemo(
        () =>
            tasks
                .flatMap<AppointmentRow>((task) => {
                    const taskAppointments: Array<{
                        type: AppointmentType;
                        value: string;
                    }> = [
                        { type: 'Fitting', value: task.fittingApptDate },
                        { type: 'Dispensing', value: task.dispensingApptDate },
                    ];

                    return taskAppointments.flatMap(({ type, value }) => {
                        const parsed = parseAppointmentDateTime(value);
                        if (!parsed) return [];

                        return [
                            {
                                id: `${task.id}-${type.toLowerCase()}`,
                                date: parsed.date,
                                time: parsed.time,
                                patient: task.patient,
                                patientId: task.patientId,
                                appointmentType: type,
                                product: task.product,
                                orderStatus: task.status,
                            },
                        ];
                    });
                })
                .sort((a, b) =>
                    `${a.date}T${a.time || '23:59'}`.localeCompare(
                        `${b.date}T${b.time || '23:59'}`,
                    ),
                ),
        [tasks],
    );

    const filteredAppointments = useMemo(() => {
        const searchValue = searchText.trim().toLocaleLowerCase();

        return appointments.filter((appointment) => {
            const matchesSearch =
                !searchValue ||
                [
                    appointment.patient,
                    appointment.patientId,
                    appointment.appointmentType,
                    appointment.product,
                    appointment.orderStatus,
                    formatAppointmentDate(appointment.date),
                    formatAppointmentTime(appointment.time),
                ].some((value) => value.toLocaleLowerCase().includes(searchValue));
            const matchesType =
                activeTypes.length === 0 || activeTypes.includes(appointment.appointmentType);

            return matchesSearch && matchesType;
        });
    }, [activeTypes, appointments, searchText]);

    const totalPages = Math.ceil(filteredAppointments.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const visibleAppointments = filteredAppointments.slice(startIndex, startIndex + rowsPerPage);

    const toggleType = (type: AppointmentType) => {
        setCurrentPage(1);
        setActiveTypes((current) =>
            current.includes(type) ? current.filter((item) => item !== type) : [...current, type],
        );
    };

    const handleExport = () => {
        const headers = [
            'Date',
            'Time',
            'Patient',
            'Patient ID',
            'Appointment Type',
            'Product',
            'Order Status',
        ];
        const rows = filteredAppointments.map((appointment) => [
            formatAppointmentDate(appointment.date),
            formatAppointmentTime(appointment.time),
            appointment.patient,
            appointment.patientId,
            appointment.appointmentType,
            appointment.product,
            appointment.orderStatus,
        ]);
        const csvContent = [headers, ...rows]
            .map((row) => row.map(escapeCsvValue).join(','))
            .join('\n');
        const file = new Blob([csvContent], { type: 'text/csv' });
        const fileUrl = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = 'appointments.csv';
        link.click();
        URL.revokeObjectURL(fileUrl);
    };

    if (isLoading) {
        return (
            <div className="table-page-state">
                <i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
                <p>Loading appointments...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="table-page-state table-page-error">
                <i className="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
                <p>Failed to load appointments.</p>
                <button type="button" className="secondary-action-btn" onClick={() => refetch()}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="data-table-header">
                <p className="data-table-count">
                    Viewing {visibleAppointments.length} out of{' '}
                    {filteredAppointments.length.toLocaleString()} Appointments
                </p>

                <button
                    type="button"
                    className="secondary-action-btn desktop-export-btn"
                    onClick={handleExport}
                    disabled={filteredAppointments.length === 0}
                >
                    <span>Export Table</span>
                    <i className="fas fa-file-export" aria-hidden="true"></i>
                </button>
            </div>

            <div className="data-table-toolbar">
                <div className="data-table-search">
                    <i className="fas fa-search" aria-hidden="true"></i>
                    <input
                        type="search"
                        placeholder="Search appointments"
                        aria-label="Search appointments"
                        value={searchText}
                        onChange={(event) => {
                            setSearchText(event.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                <div className="data-table-actions">
                    <div className="filter-wrapper">
                        <button
                            type="button"
                            className="secondary-action-btn filter-action-btn"
                            aria-expanded={isFilterOpen}
                            onClick={() => setIsFilterOpen((current) => !current)}
                        >
                            <span className="btn-text">Filter Results</span>
                            <i className="fas fa-filter" aria-hidden="true"></i>
                        </button>

                        {isFilterOpen && (
                            <div className="filter-card">
                                {appointmentTypes.map((type) => (
                                    <label className="filter-option" key={type}>
                                        <input
                                            type="checkbox"
                                            checked={activeTypes.includes(type)}
                                            onChange={() => toggleType(type)}
                                        />
                                        <span>{type}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        className="secondary-action-btn mobile-export-btn"
                        onClick={handleExport}
                        disabled={filteredAppointments.length === 0}
                    >
                        <span className="btn-text">Export Table</span>
                        <i className="fas fa-file-export" aria-hidden="true"></i>
                    </button>
                </div>

                <div className="filter-chips">
                    {activeTypes.map((type) => (
                        <span className="filter-chip" key={type}>
                            {type}
                            <button
                                type="button"
                                aria-label={`Remove ${type} filter`}
                                onClick={() => toggleType(type)}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            <div className="data-table-wrap">
                <table className="data-table appointments-table">
                    <thead>
                        <tr>
                            <th className="active-sort-header">
                                DATE <i className="fas fa-caret-down" aria-hidden="true"></i>
                            </th>
                            <th>TIME</th>
                            <th>PATIENT</th>
                            <th>PATIENT ID</th>
                            <th>APPOINTMENT TYPE</th>
                            <th>PRODUCT</th>
                            <th>ORDER STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleAppointments.length > 0 ? (
                            visibleAppointments.map((appointment) => (
                                <tr key={appointment.id}>
                                    <td>{formatAppointmentDate(appointment.date)}</td>
                                    <td>{formatAppointmentTime(appointment.time)}</td>
                                    <td>{appointment.patient}</td>
                                    <td>{appointment.patientId}</td>
                                    <td>
                                        <span className="appointment-type-badge">
                                            {appointment.appointmentType}
                                        </span>
                                    </td>
                                    <td>{appointment.product}</td>
                                    <td>{appointment.orderStatus}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="empty-table-row" colSpan={7}>
                                    {appointments.length === 0
                                        ? 'No appointments scheduled.'
                                        : 'No appointments match your search.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="table-pagination">
                <button
                    type="button"
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((current) => Math.max(1, current - 1))}
                >
                    <i className="fa-solid fa-caret-left" aria-hidden="true"></i>
                    <span>PREV</span>
                </button>

                <PaginationNumbers
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />

                <button
                    type="button"
                    className="pagination-btn"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage((current) => Math.min(totalPages, current + 1))}
                >
                    <span>NEXT</span>
                    <i className="fa-solid fa-caret-right" aria-hidden="true"></i>
                </button>
            </div>
        </>
    );
}
