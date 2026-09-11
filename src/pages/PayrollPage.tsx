import React, { useMemo, useState } from 'react';
import { usePayroll } from '../features/payroll/hooks/usePayroll';
import { useAuthStore } from '../store/useAuthStore';
import PaginationNumbers from '../components/common/PaginationNumbers';

const filterOptions: string[] = ['Dispensing and Modifications', 'In-Person Fittings'];
const rowsPerPage = 10;

export default function PayrollPage() {
    const user = useAuthStore((state) => state.user);


    const [payrollType, setPayrollType] = useState<string>('450');
    const [company, setCompany] = useState<string>('All');
    const [searchText, setSearchText] = useState<string>('');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchString, setSearchString] = useState<string>('');


    const { status, data, total, error, datesDropdown, payrollDate, totalAmount, refetch } =
        usePayroll(
            user?.physicianId ?? null,
            user?.practiceId ?? null,
            user?.locationId ?? null,
            payrollType ?? null,
            searchString ?? null,
        );
    //const search = searchString === '' ? '' : searchString;

    const filteredData = useMemo(() => {
        return data.filter((row) => {
            const searchValue = searchText.toLowerCase();
            const matchesSearch =
                row.patientName.toLowerCase().includes(searchValue) ||
                row.work.toLowerCase().includes(searchValue) ||
                row.date.toLowerCase().includes(searchValue);
            const matchesFilter = activeFilters.length === 0 || activeFilters.includes(row.work);
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
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    const handleExport = () => {
        const headers = [
            'Patient',
            'Description of Work',
            'Date',
            'Allocated Time',
            'Compensation',
            'Pay Date',
        ];
        const rows = filteredData.map((row) => [
            row.patientName,
            row.work,
            row.date,
            row.allocatedTime,
            row.compensation,
            row.payDate,
        ]);
        const csvContent = [headers, ...rows]
            .map((row) => row.map((v) => `"${v}"`).join(','))
            .join('\n');
        const file = new Blob([csvContent], { type: 'text/csv' });
        const fileUrl = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = 'payroll-table.csv';
        link.click();
        URL.revokeObjectURL(fileUrl);
    };

    if (status === 'loading') {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>
                <i
                    className="fa-solid fa-spinner fa-spin"
                    style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.75rem' }}
                />
                <p>Loading payroll...</p>
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
                <p>{error ?? 'Failed to load payroll.'}</p>
                <button
                    type="button"
                    className="secondary-action-btn"
                    onClick={() => refetch()}
                    style={{ marginTop: '1rem' }}
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <>
            {/* Payroll filters */}
            <div className="payroll-header">
                <div className="payroll-filters">
                    <label className="payroll-filter-card">
                        <span className="payroll-filter-label">Payroll &nbsp;</span>
                        <select
                            className="payroll-select"
                            value={payrollType}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                setPayrollType(e.target.value)
                            }
                        >
                            <option value="450">Pending Commissions</option>
                            <option value="451">Payable Commissions</option>
                            {datesDropdown.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="payroll-filter-card">
                        <span className="payroll-filter-label">Company</span>
                        <select
                            className="payroll-select"
                            value={company}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                setCompany(e.target.value)
                            }
                        >
                            <option>All</option>
                            <option>Company A</option>
                            <option>Company B</option>
                        </select>
                    </label>
                </div>

                <div className="payroll-history-search">
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder="Search Historical"
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === 'Enter') {
                                setSearchString((e.target as HTMLInputElement).value);
                            }
                        }}
                    />
                </div>
            </div>

            {/* Payroll summary */}
            <div className="payroll-summary-section">
                <h2 className="payroll-summary-title">Payroll Summary</h2>
                <div className="payroll-summary-card">
                    <p>
                        <span>Payroll Date:</span>{' '}
                        <strong>
                            {payrollDate !== null ? new Date(payrollDate).toLocaleDateString() : ''}
                        </strong>
                    </p>
                    <p>
                        <span>Total Paycheck Amount: </span>
                        <strong>{formatter.format(totalAmount)}</strong>
                    </p>
                </div>
            </div>

            {/* Header */}
            <div className="data-table-header">
                <p className="data-table-count">
                    Viewing {visibleRows.length} out of {total.toLocaleString()} Records
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
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>PATIENT</th>
                            <th>DESCRIPTION OF WORK</th>
                            <th>DATE</th>
                            <th>ALLOCATED TIME</th>
                            <th>COMPENSATION</th>
                            <th>PAY DATE</th>
                        </tr>
                    </thead>

                    <tbody>
                        {visibleRows.length > 0 ? (
                            visibleRows.map((row) => (
                                <tr key={row.doId}>
                                    <td>{row.patientName}</td>
                                    <td>{row.work}</td>
                                    <td>{row.date}</td>
                                    <td>{row.allocatedTime}</td>
                                    <td>{formatter.format(row.compensation)}</td>
                                    <td>{row.payDate !== '01/01/1' ? row.payDate : ''}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="empty-table-row" colSpan={6}>
                                    {status === 'idle'
                                        ? 'No data loaded yet.'
                                        : 'No payroll records found.'}
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
