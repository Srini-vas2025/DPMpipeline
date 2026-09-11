import React, { useMemo, useState } from 'react';
import { useConfirmArrival } from '../features/confirmArrival/hooks/useConfirmArrival';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import type { ConfirmArrivalRow } from '../features/confirmArrival/types/confirmArrival.types';
import PaginationNumbers from '../components/common/PaginationNumbers';

const filterOptions: string[] = ['Ordered', 'Order Confirmed', 'Foam Box Mailed', 'Shoes Mailed'];
const rowsPerPage = 10;

export default function ConfirmArrivalPage() {
    const user = useAuthStore((state) => state.user);

    const { status, data, total, error, refetch } = useConfirmArrival(
        user?.physicianId ?? null,
        user?.practiceId ?? null,
        user?.locationId ?? null,
    );

    const [searchText, setSearchText] = useState<string>('');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    //const [selectedRow, setSelectedRow] = useState<ConfirmArrivalRow | null>(null); // ← track selected row
    const { openModal } = useUIStore();
    const filteredData = useMemo(() => {
        return data.filter((row) => {
            const searchValue = searchText.toLowerCase();
            const matchesSearch =
                row.patientName.toLowerCase().includes(searchValue) ||
                row.poNumber.toLowerCase().includes(searchValue) ||
                row.manufacturer.toLowerCase().includes(searchValue) ||
                row.style.toLowerCase().includes(searchValue) ||
                row.status.toLowerCase().includes(searchValue);
            const matchesFilter =
                activeFilters.length === 0 || activeFilters.includes(row.filterStatus);
            return matchesSearch && matchesFilter;
        });
    }, [data, searchText, activeFilters]);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const visibleRows = filteredData.slice(startIndex, startIndex + rowsPerPage);

    const handleFilterChange = (filter: string) => {
        setCurrentPage(1);
        setActiveFilters((prev) =>
            prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter],
        );
    };

    const removeFilter = (filter: string) => {
        setCurrentPage(1);
        setActiveFilters((prev) => prev.filter((f) => f !== filter));
    };

    const handleExport = () => {
        const headers = [
            'Patient',
            'PO',
            'Manufacturer',
            'Style',
            'Size',
            'Width',
            'Status',
            'Last Updated',
            'Expires',
        ];
        const rows = filteredData.map((row) => [
            row.patientName,
            row.poNumber,
            row.manufacturer,
            row.style,
            row.size,
            row.width,
            row.status,
            row.lastUpdated,
            row.expires,
        ]);
        const csvContent = [headers, ...rows]
            .map((row) => row.map((v) => `"${v}"`).join(','))
            .join('\n');
        const file = new Blob([csvContent], { type: 'text/csv' });
        const fileUrl = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = 'confirm-arrival-table.csv';
        link.click();
        URL.revokeObjectURL(fileUrl);
    };

    // ← open modal with the clicked row
    const handleOpenConfirm = (row: ConfirmArrivalRow) => {
        openModal(row, 'confirm-arrival');
    };

    //// ← called when user clicks Yes in the modal
    //const handleConfirmArrival = (requestId: number) => {
    //    console.log('Confirmed arrival for requestId:', requestId);
    //    // TODO: call your API here e.g. await confirmArrivalApi(requestId)
    //    //setSelectedRow(null);
    //    refetch(); // refresh the table
    //};

    if (status === 'loading') {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>
                <i
                    className="fa-solid fa-spinner fa-spin"
                    style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.75rem' }}
                />
                <p>Loading confirm arrivals...</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--danger, #e53e3e)' }}>
                <i
                    className="fa-solid fa-circle-exclamation"
                    style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.75rem' }}
                />
                <p>{error ?? 'Failed to load confirm arrivals.'}</p>
                <button
                    type="button"
                    className="secondary-action-btn"
                    onClick={refetch}
                    style={{ marginTop: '1rem' }}
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <>
            {/* Header */}
            <div className="data-table-header">
                <p className="data-table-count">
                    Viewing {visibleRows.length} out of {total.toLocaleString()} Orders
                </p>

                <button
                    type="button"
                    className="secondary-action-btn desktop-export-btn"
                    onClick={handleExport}
                >
                    <span>Export Table</span>
                    <i className="fas fa-file-export"></i>
                </button>
            </div>

            {/* Toolbar */}
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

                <div className="data-table-actions">
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
                                {filterOptions.map((filter) => (
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
                        className="secondary-action-btn mobile-export-btn"
                        onClick={handleExport}
                        aria-label="Export Table"
                    >
                        <span className="btn-text">Export Table</span>
                        <i className="fas fa-file-export"></i>
                    </button>
                </div>

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

            {/* Table */}
            <div className="data-table-wrap">
                <table className="data-table wide-table">
                    <thead>
                        <tr>
                            <th>
                                PATIENT <i className="fas fa-caret-down muted-sort-icon"></i>
                            </th>
                            <th>
                                PO <i className="fas fa-caret-down muted-sort-icon"></i>
                            </th>
                            <th>
                                MANUFACTURER <i className="fas fa-caret-down muted-sort-icon"></i>
                            </th>
                            <th>
                                STYLE <i className="fas fa-caret-down muted-sort-icon"></i>
                            </th>
                            <th>
                                SIZE <i className="fas fa-caret-down muted-sort-icon"></i>
                            </th>
                            <th>
                                WIDTH <i className="fas fa-caret-down muted-sort-icon"></i>
                            </th>
                            <th>
                                STATUS <i className="fas fa-caret-down muted-sort-icon"></i>
                            </th>
                            <th>
                                LAST UPDATED <i className="fas fa-caret-down muted-sort-icon"></i>
                            </th>
                            <th className="active-sort-header">
                                EXPIRES <i className="fas fa-caret-down"></i>
                            </th>
                            <th>
                                ACTION <i className="fas fa-caret-down muted-sort-icon"></i>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {visibleRows.length > 0 ? (
                            visibleRows.map((row) => (
                                <tr key={row.requestId}>
                                    <td>{row.patientName}</td>
                                    <td>{row.poNumber}</td>
                                    <td>{row.manufacturer}</td>
                                    <td>{row.style}</td>
                                    <td>{row.size}</td>
                                    <td>{row.width}</td>
                                    <td>{row.status}</td>
                                    <td>{row.lastUpdated}</td>
                                    <td>{row.expires}</td>
                                    <td className="table-action-cell">
                                        <button
                                            type="button"
                                            className="table-action-btn confirm-arrival-action-btn"
                                            onClick={() => handleOpenConfirm(row)} // ← pass the row
                                        >
                                            Confirm Arrival
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="empty-table-row" colSpan={10}>
                                    {status === 'idle' ? 'No data loaded yet.' : 'No orders found.'}
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
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                >
                    <i className="fa-solid fa-caret-left"></i>
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
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                >
                    <span>NEXT</span>
                    <i className="fa-solid fa-caret-right"></i>
                </button>
            </div>
        </>
    );
}
