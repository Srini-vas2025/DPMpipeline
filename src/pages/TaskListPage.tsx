/**
 * Tasks page — refactored to use the useTasks hook (TanStack Query).
 *
 * The component now only handles presentation and local UI state.
 * All data-fetching, caching, and error handling is delegated to useTasks.
 */
import React, { useState, useMemo } from 'react';
import { useTasks } from '../features/tasks/hooks/useTasks';
import { useUIStore } from '../store/useUIStore';
import type { Task } from '../features/tasks/types';
import TasksErrorState from '../components/common/taskError';
import TasksLoadingSkeleton from '../components/common/taskLoading';
import PaginationNumbers from '../components/common/PaginationNumbers';
import { useTaskFilterStore } from '../store/taskFilterStore';

const FILTER_OPTIONS = [
    'Confirm Shoes',
    'Dispense Shoes',
    'Fill Shoe Rx',
    'Fill Compression Rx',
    'Fit Shoes',
    'Fit Compression',
    'Set Appointment',
    'Order Compression',
    'Order Shoes',
    'Update Info',
    'Upload Documents',
    'View Notes',
];

const ROWS_PER_PAGE = 10;
type SortKey =
    'patientId' | 'patientFirst' | 'patientLast' | 'createdOn' | 'status' | 'expirayDate';
type SortDirection = 'asc' | 'desc';

const formatDate = (raw: string | null | undefined): string => {
    if (!raw) return '';

    // Handle "DD-MM-YYYY HH:mm:ss" format
    const ddmmyyyy = raw.match(/^(\d{2})-(\d{2})-(\d{4})/);
    const normalized = ddmmyyyy
        ? raw.replace(/^(\d{2})-(\d{2})-(\d{4})/, '$3-$2-$1') // → "2025-03-20 14:38:39"
        : raw;

    const date = new Date(normalized);
    if (isNaN(date.getTime())) return raw;

    return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
    });
};

const patientNameParts = (patient: string) => {
    const [first = '', ...lastParts] = patient.trim().split(/\s+/);
    return { first, last: lastParts.join(' ') };
};

const toTitleCase = (value: string) =>
    value.toLocaleLowerCase().replace(/\b\p{L}/gu, (letter) => letter.toLocaleUpperCase());

const sortableDate = (raw: string | null | undefined) => {
    if (!raw) return 0;
    const ddmmyyyy = raw.match(/^(\d{2})-(\d{2})-(\d{4})/);
    const normalized = ddmmyyyy ? raw.replace(/^(\d{2})-(\d{2})-(\d{4})/, '$3-$2-$1') : raw;
    const timestamp = new Date(normalized).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
};

/* ─── Main component ─────────────────────────────────────────────────────── */

const TasksPage: React.FC = () => {
    const { tasks, isLoading, isError, refetch } = useTasks();
    //const { stats } = useTaskStats();
    const { openModal } = useUIStore();

    const [searchText, setSearchText] = useState('');
    // const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortKey, setSortKey] = useState<SortKey>('patientLast');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    const activeFilters = useTaskFilterStore((s) => s.activeFilters);
    const setActiveFilters = useTaskFilterStore((s) => s.setActiveFilters);

    /* ── filtering ── */
    const filtered = useMemo(() => {
        let rows = tasks;
        if (searchText) {
            const q = searchText.toLowerCase();
            rows = rows.filter(
                (r) =>
                    r.patient.toLowerCase().includes(q) ||
                    r.status.toLowerCase().includes(q) ||
                    r.product.toLowerCase().includes(q),
            );
        }
        if (activeFilters.length) {
            rows = rows.filter((r) => activeFilters.includes(r.actionLabel));
            console.log(activeFilters);
        }
        return rows;
    }, [tasks, searchText, activeFilters]);

    // const filtered = useMemo(() => {
    //     
    //     let rows = tasks;
    //     if (searchText) {
    //         
    //         const q = searchText.toLowerCase();
    //         rows = rows.filter(
    //             (r) =>
    //                 r.patient.toLowerCase().includes(q) ||
    //                 r.status.toLowerCase().includes(q) ||
    //                 r.product.toLowerCase().includes(q),
    //         );
    //     }
    //     if (activeFilters.length) {
    //         
    //         if (selectedStat === 'Pending RX') {
    //             
    //             console.log('SAMPLE TASKS:', tasks.slice(0, 10));
    //         }
    //         rows = rows.filter((r) => activeFilters.includes(r.actionLabel));
    //     }
    //     return rows;
    // }, [tasks, searchText, activeFilters]);

    /* ── sorting ── */
    const sorted = useMemo(() => {
        const valueFor = (task: Task): string | number => {
            const name = patientNameParts(task.patient);
            switch (sortKey) {
                case 'patientFirst':
                    return name.first;
                case 'patientLast':
                    return name.last;
                case 'createdOn':
                    return sortableDate(task.createdOn);
                case 'expirayDate':
                    return sortableDate(task.expirayDate);
                default:
                    return task[sortKey] ?? '';
            }
        };

        return [...filtered].sort((a, b) => {
            const aValue = valueFor(a);
            const bValue = valueFor(b);
            const comparison =
                typeof aValue === 'number' && typeof bValue === 'number'
                    ? aValue - bValue
                    : String(aValue).localeCompare(String(bValue), undefined, {
                          numeric: true,
                          sensitivity: 'base',
                      });
            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }, [filtered, sortKey, sortDirection]);

    const handleSort = (key: SortKey) => {
        setCurrentPage(1);
        if (key === sortKey) {
            setSortDirection((direction) => (direction === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const renderSortHeader = (key: SortKey, label: string) => {
        const active = sortKey === key;
        return (
            <th
                className={active ? 'active-sort-header sortable-header' : 'sortable-header'}
                onClick={() => handleSort(key)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleSort(key);
                    }
                }}
                aria-sort={active ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                tabIndex={0}
            >
                {label}{' '}
                <i
                    aria-hidden="true"
                    className={`fas fa-caret-${
                        active ? (sortDirection === 'asc' ? 'up' : 'down') : 'down'
                    }${active ? '' : ' muted-sort-icon'}`}
                />
            </th>
        );
    };

    /* ── pagination ── */
    const totalPages = Math.max(1, Math.ceil(sorted.length / ROWS_PER_PAGE));
    const visiblePage = Math.min(currentPage, totalPages);
    const visibleRows = sorted.slice(
        (visiblePage - 1) * ROWS_PER_PAGE,
        visiblePage * ROWS_PER_PAGE,
    );

    const handleFilterChange = (filter: string) => {
        const current = Array.isArray(activeFilters) ? activeFilters : [];

        const exists = current.includes(filter);

        const updated = exists ? current.filter((x) => x !== filter) : [...current, filter];

        setActiveFilters(updated);

        setCurrentPage(1);
    };

    const removeFilter = (filter: string) => {
        const updated = activeFilters.filter((f) => f !== filter);
        setActiveFilters(updated);
    };

    const handleExport = () => console.log('Export table');

    const handleRowClick = (task: Task) => openModal(task, 'patient-details');

    const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>, task: Task) => {
        event.stopPropagation();
        if (task.actionModal) openModal(task, task.actionModal);
    };

    const goToPrevPage = () => setCurrentPage(Math.max(1, visiblePage - 1));
    const goToNextPage = () => setCurrentPage(Math.min(totalPages, visiblePage + 1));
    if (isLoading) return <TasksLoadingSkeleton />;
    if (isError) return <TasksErrorState onRetry={refetch} />;
    return (
        <>
            {/* Table Header */}
            <div className="data-table-header">
                <p className="data-table-count">
                    You have <span>{filtered.length}</span> tasks that need attention.
                </p>
            </div>

            {/* Search and Filter */}
            <div className="data-table-toolbar">
                <div className="data-table-search">
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchText}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setSearchText(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                {/* Table Actions */}
                <div className="data-table-actions task-table-actions">
                    <div className="filter-wrapper">
                        <button
                            type="button"
                            className="secondary-action-btn filter-action-btn"
                            onClick={() => setIsFilterOpen((prev) => !prev)}
                            aria-label="Filter Results"
                        >
                            <span className="btn-text">Filter Results</span>
                            <i className="fas fa-filter"></i>
                        </button>

                        {isFilterOpen && (
                            <div className="filter-card">
                                {FILTER_OPTIONS.map((filter) => (
                                    <label className="filter-option" key={filter}>
                                        <input
                                            type="checkbox"
                                            checked={activeFilters.includes(filter)}
                                            onChange={() => handleFilterChange(filter)}
                                        />
                                        <span>{filter}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        className="secondary-action-btn task-toolbar-export-btn"
                        onClick={handleExport}
                        aria-label="Export Table"
                    >
                        <span className="btn-text">Export Table</span>
                        <i className="fas fa-file-export"></i>
                    </button>
                </div>

                {/* Filter Chips */}
                <div className="filter-chips">
                    {activeFilters.map((filter) => (
                        <span className="filter-chip" key={filter}>
                            {filter}
                            <button type="button" onClick={() => removeFilter(filter)}>
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            {/* Data Table */}
            <div className="data-table-wrap">
                <table className="data-table task-list-table">
                    <thead>
                        <tr>
                            {renderSortHeader('patientId', 'Patient ID')}
                            {renderSortHeader('patientFirst', 'Patient First')}
                            {renderSortHeader('patientLast', 'Patient Last')}
                            {renderSortHeader('createdOn', 'Order Started')}
                            {renderSortHeader('status', 'Status')}
                            {renderSortHeader('expirayDate', 'Exp. Date')}
                            <th aria-label="Actions"></th>
                        </tr>
                    </thead>

                    <tbody>
                        {visibleRows.length > 0 ? (
                            visibleRows.map((task, index) => {
                                const name = patientNameParts(task.patient);
                                return (
                                    <tr
                                        key={index}
                                        className="clickable-table-row"
                                        onClick={() => handleRowClick(task)}
                                    >
                                        <td>
                                            <button
                                                type="button"
                                                className="patient-id-link"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleRowClick(task);
                                                }}
                                            >
                                                {task.patientId}
                                            </button>
                                        </td>
                                        <td>{toTitleCase(name.first)}</td>
                                        <td>{toTitleCase(name.last)}</td>
                                        <td>{formatDate(task.createdOn)}</td>
                                        <td className="task-status">{toTitleCase(task.status)}</td>
                                        <td className={task.expDanger ? 'danger-text' : ''}>
                                            {formatDate(task.expirayDate)}
                                        </td>
                                        <td className="table-action-cell">
                                            {task.actionLabel ? (
                                                <button
                                                    type="button"
                                                    className="table-action-btn"
                                                    onClick={(event) =>
                                                        handleActionClick(event, task)
                                                    }
                                                >
                                                    {task.actionLabel}
                                                </button>
                                            ) : null}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td className="empty-table-row" colSpan={7}>
                                    No tasks found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="table-pagination">
                <button
                    type="button"
                    className="pagination-btn"
                    onClick={goToPrevPage}
                    disabled={visiblePage === 1}
                >
                    <i className="fa-solid fa-caret-left"></i>
                    <span>PREV</span>
                </button>

                <PaginationNumbers
                    currentPage={visiblePage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />

                <button
                    type="button"
                    className="pagination-btn"
                    onClick={goToNextPage}
                    disabled={visiblePage === totalPages || totalPages === 0}
                >
                    <span>NEXT</span>
                    <i className="fa-solid fa-caret-right"></i>
                </button>
            </div>
        </>
    );
};

export default TasksPage;
