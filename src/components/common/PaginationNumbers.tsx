interface PaginationNumbersProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const getVisiblePages = (currentPage: number, totalPages: number): Array<number | string> => {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 4) {
        return [1, 2, 3, 4, 5, 'ellipsis-end', totalPages];
    }

    if (currentPage >= totalPages - 3) {
        return [
            1,
            'ellipsis-start',
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages,
        ];
    }

    return [
        1,
        'ellipsis-start',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        'ellipsis-end',
        totalPages,
    ];
};

export default function PaginationNumbers({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationNumbersProps) {
    const safeCurrentPage = Math.min(Math.max(currentPage, 1), Math.max(totalPages, 1));

    return (
        <div className="pagination-numbers" aria-label="Page navigation">
            {getVisiblePages(safeCurrentPage, totalPages).map((item) =>
                typeof item === 'number' ? (
                    <button
                        type="button"
                        key={item}
                        className={`pagination-number${safeCurrentPage === item ? ' active' : ''}`}
                        aria-current={safeCurrentPage === item ? 'page' : undefined}
                        aria-label={`Page ${item}`}
                        onClick={() => onPageChange(item)}
                    >
                        {item}
                    </button>
                ) : (
                    <span className="pagination-ellipsis" aria-hidden="true" key={item}>
                        …
                    </span>
                ),
            )}
        </div>
    );
}
