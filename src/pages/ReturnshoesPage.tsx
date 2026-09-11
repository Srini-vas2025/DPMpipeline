import React, { useMemo, useState } from 'react';
import { useReturnOrders } from '../features/returnshoes/hooks/useReturnOrders';
import { useAuthStore } from '../store/useAuthStore';
import PaginationNumbers from '../components/common/PaginationNumbers';

const filterOptions: string[] = ['Memory Foam'];
const rowsPerPage = 10;

export default function ReturnShoesPage() {
    const user = useAuthStore((state) => state.user);

    const { status, data, total, error, refetch } = useReturnOrders(
        user?.physicianId ?? null,
        user?.practiceId ?? null,
        user?.locationId ?? null,
    );

    const [searchText, setSearchText] = useState<string>('');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const filteredData = useMemo(() => {
        return data.filter((row) => {
            const search = searchText.toLowerCase();
            const matchesSearch =
                row.patientName.toLowerCase().includes(search) ||
                row.productName.toLowerCase().includes(search) ||
                row.poNumber.toLowerCase().includes(search);
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
            prev.includes(filter)
                ? prev.filter((f) => f !== filter)
                : [...prev, filter],
        );
    };

    const removeFilter = (filter: string) => {
        setCurrentPage(1);
        setActiveFilters((prev) => prev.filter((f) => f !== filter));
    };

    const handleExport = () => {
        const headers = ['Patient', 'Expiration Date', 'Insole Type', 'PO Number', 'Product'];
        const rows = filteredData.map((row) => [
            row.patientName, row.expiry, row.insole, row.poNumber, row.productName,
        ]);
        const csv = [headers, ...rows]
            .map((r) => r.map((v) => `"${v}"`).join(','))
            .join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'return-shoes.csv';
        link.click();
        URL.revokeObjectURL(url);
    };
    
if (status === 'loading') {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>
                <i
                    className="fa-solid fa-spinner fa-spin"
                    style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.75rem' }}
                />
                <p>Loading return orders...</p>
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
                <p>{error ?? 'Failed to load return orders.'}</p>
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
                                    <label key={filter} className="filter-option">
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
                        <span className="btn-text">Export</span>
                        <i className="fas fa-file-export"></i>
                    </button>
                </div>

                <div className="filter-chips">
                    {activeFilters.map((filter) => (
                        <span key={filter} className="filter-chip">
                            {filter}
                            <button type="button" onClick={() => removeFilter(filter)}>×</button>
                        </span>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="data-table-wrap">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>PATIENT</th>
                            <th className="active-sort-header">
                                EXPIRATION DATE <i className="fas fa-caret-down"></i>
                            </th>
                            <th>INSOLE TYPE</th>
                            <th>PO Number </th>
                            <th>PRODUCT</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {visibleRows.length > 0 ? (
                            visibleRows.map((row) => (
                                <tr key={row.requestId}>
                                    <td>{row.patientName}</td>
                                    <td>{row.expiry}</td>
                                    <td>{row.insole}</td>
                                    <td>{row.poNumber}</td>
                                    <td>{row.productName}</td>
                                    <td className="table-action-cell">
                                        <button type="button" className="table-action-btn">
                                            Initiate Return
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="empty-table-row" colSpan={6}>
                                    {status === 'idle' ? 'No data loaded yet.' : 'No records found.'}
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
