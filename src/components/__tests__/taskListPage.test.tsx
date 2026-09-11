import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TaskListPage from '../../pages/TaskListPage';
import * as tasksHook from '../../features/tasks/hooks/useTasks';
import { useUIStore } from '../../store/useUIStore';
import { useTaskFilterStore } from '../../store/taskFilterStore';

// Mock the hooks
vi.mock('../../features/tasks/hooks/useTasks');
vi.mock('../../store/useUIStore');
vi.mock('../../store/taskFilterStore');
vi.mock('../../components/common/taskError', () => ({
  default: ({ onRetry }: { onRetry: () => void }) =>
    React.createElement('div', { 'data-testid': 'error-state' },
      React.createElement('button', { onClick: onRetry }, 'Retry')
    ),
}));
vi.mock('../../components/common/taskLoading', () => ({
  default: () => React.createElement('div', { 'data-testid': 'loading-skeleton' }, 'Loading...'),
}));

const mockTasks = [
    {
        patient: 'John Doe',
        status: 'Pending',
        product: 'Shoes',
        actionLabel: 'Confirm Shoes',
        actionModal: 'confirm-shoes',
        createdOn: '20-03-2025 14:38:39',
        expirayDate: '25-03-2025',
        expDanger: false,
        progress: [
            { color: 'green', tooltip: 'Ordered' },
            { color: 'green', tooltip: 'Confirmed' },
            { color: null, tooltip: 'Shipped' },
        ],
    },
    {
        patient: 'Jane Smith',
        status: 'Completed',
        product: 'Compression',
        actionLabel: 'Fit Compression',
        actionModal: 'fit-compression',
        createdOn: '18-03-2025 10:15:20',
        expirayDate: '28-03-2025',
        expDanger: false,
        progress: [
            { color: 'green', tooltip: 'Ordered' },
            { color: 'green', tooltip: 'Confirmed' },
            { color: 'green', tooltip: 'Shipped' },
        ],
    },
];

const createQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });

const renderWithProviders = (component: React.ReactElement) => {
    const queryClient = createQueryClient();
    return render(
        <QueryClientProvider client={queryClient} >{component}</QueryClientProvider>
    );
};

describe('TaskListPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Default mock for useTaskFilterStore
        (useTaskFilterStore as any).mockImplementation((selector:any) =>
            selector({
                activeFilters: [],
                setActiveFilters: vi.fn(),
            })
        );

        // Default mock for useUIStore
        (useUIStore as any).mockImplementation((selector:any) =>
            selector({
                openModal: vi.fn(),
            })
        );
    });

    describe('Loading State', () => {
        it('should display loading skeleton when loading', () => {
            (tasksHook.useTasks as any).mockReturnValue({
                tasks: [],
                isLoading: true,
                isError: false,
                refetch: vi.fn(),
            });

            renderWithProviders(<TaskListPage />);
            expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
        });
    });

    describe('Error State', () => {
        it('should display error state when there is an error', () => {
            const mockRefetch = vi.fn();
            (tasksHook.useTasks as any).mockReturnValue({
                tasks: [],
                isLoading: false,
                isError: true,
                refetch: mockRefetch,
            });

            renderWithProviders(<TaskListPage />);
            expect(screen.getByTestId('error-state')).toBeInTheDocument();
        });

        it('should call refetch when retry button is clicked', async () => {
            const mockRefetch = vi.fn();
            (tasksHook.useTasks as any).mockReturnValue({
                tasks: [],
                isLoading: false,
                isError: true,
                refetch: mockRefetch,
            });

            const user = userEvent.setup();
            renderWithProviders(<TaskListPage />);
            const retryButton = screen.getByText('Retry');
            await user.click(retryButton);
            expect(mockRefetch).toHaveBeenCalled();
        });
    });

    describe('Rendering Tasks', () => {
        beforeEach(() => {
            (tasksHook.useTasks as any).mockReturnValue({
                tasks: mockTasks,
                isLoading: false,
                isError: false,
                refetch: vi.fn(),
            });
        });

        it('should render task table with headers', () => {
            renderWithProviders(<TaskListPage />);
            expect(screen.getByText('PATIENT')).toBeInTheDocument();
            expect(screen.getByText('STATUS')).toBeInTheDocument();
            expect(screen.getByText('PRODUCT')).toBeInTheDocument();
        });

        it('should display all tasks in the table', () => {
            renderWithProviders(<TaskListPage />);
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
            expect(screen.getByText('Shoes')).toBeInTheDocument();
            expect(screen.getByText('Compression')).toBeInTheDocument();
        });

        it('should display task count message', () => {
            renderWithProviders(<TaskListPage />);
            expect(screen.getByText(/You have.*tasks that need attention/)).toBeInTheDocument();
        });
    });

    describe('Search Functionality', () => {
        beforeEach(() => {
            (tasksHook.useTasks as any).mockReturnValue({
                tasks: mockTasks,
                isLoading: false,
                isError: false,
                refetch: vi.fn(),
            });
        });

        it('should filter tasks by patient name', async () => {
            const user = userEvent.setup();
            renderWithProviders(<TaskListPage />);

            const searchInput = screen.getByPlaceholderText('Search');
            await user.type(searchInput, 'John');

            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
        });

        it('should filter tasks by status', async () => {
            const user = userEvent.setup();
            renderWithProviders(<TaskListPage />);

            const searchInput = screen.getByPlaceholderText('Search');
            await user.type(searchInput, 'Pending');

            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        it('should filter tasks by product', async () => {
            const user = userEvent.setup();
            renderWithProviders(<TaskListPage />);

            const searchInput = screen.getByPlaceholderText('Search');
            await user.type(searchInput, 'Shoes');

            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.queryByText('Compression')).not.toBeInTheDocument();
        });

        it('should reset pagination when search text changes', async () => {
            const user = userEvent.setup();
            renderWithProviders(<TaskListPage />);

            const searchInput = screen.getByPlaceholderText('Search');
            await user.type(searchInput, 'John');

            // Verify that it shows the filtered result (pagination reset to page 1)
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
    });

    describe('Filter Functionality', () => {
        beforeEach(() => {
            const mockSetActiveFilters = vi.fn();
            (useTaskFilterStore as any).mockImplementation((selector:any) =>
                selector({
                    activeFilters: [],
                    setActiveFilters: mockSetActiveFilters,
                })
            );

            (tasksHook.useTasks as any).mockReturnValue({
                tasks: mockTasks,
                isLoading: false,
                isError: false,
                refetch: vi.fn(),
            });
        });

        it('should open filter panel when filter button is clicked', async () => {
            const user = userEvent.setup();
            renderWithProviders(<TaskListPage />);

            const filterButton = screen.getByLabelText('Filter Results');
            await user.click(filterButton);

            expect(screen.getByText('Confirm Shoes')).toBeInTheDocument();
        });

        it('should close filter panel when filter button is clicked again', async () => {
            const user = userEvent.setup();
            renderWithProviders(<TaskListPage />);

            const filterButton = screen.getByLabelText('Filter Results');
            await user.click(filterButton);
            expect(screen.getByText('Confirm Shoes')).toBeInTheDocument();

            await user.click(filterButton);
            expect(screen.queryByText('Confirm Shoes')).not.toBeInTheDocument();
        });
    });

    describe('Table Row Interaction', () => {
        beforeEach(() => {
            (tasksHook.useTasks as any).mockReturnValue({
                tasks: mockTasks,
                isLoading: false,
                isError: false,
                refetch: vi.fn(),
            });
        });

        it('should call openModal when a table row is clicked', async () => {
            const mockOpenModal = vi.fn();
            (useUIStore as any).mockImplementation((selector:any) =>
                selector({
                    openModal: mockOpenModal,
                })
            );

            const user = userEvent.setup();
            renderWithProviders(<TaskListPage />);

            const patientRow = screen.getByText('John Doe').closest('tr');
            await user.click(patientRow!);

            expect(mockOpenModal).toHaveBeenCalledWith(mockTasks[0], 'patient-details');
        });
    });

    describe('Export Functionality', () => {
        beforeEach(() => {
            (tasksHook.useTasks as any).mockReturnValue({
                tasks: mockTasks,
                isLoading: false,
                isError: false,
                refetch: vi.fn(),
            });
            vi.spyOn(console, 'log').mockImplementation((message) => {
                console.error('Export called:', message);
            });
        });

        it('should have export button', () => {
            renderWithProviders(<TaskListPage />);
            const exportButtons = screen.getAllByText(/Export Table/);
            expect(exportButtons.length).toBeGreaterThan(0);
        });
    });

    describe('Date Formatting', () => {
        beforeEach(() => {
            (tasksHook.useTasks as any).mockReturnValue({
                tasks: mockTasks,
                isLoading: false,
                isError: false,
                refetch: vi.fn(),
            });
        });

        it('should format dates correctly from DD-MM-YYYY HH:mm:ss format', () => {
            renderWithProviders(<TaskListPage />);
            // The date "20-03-2025" should be displayed (formatted)
            expect(screen.getByText('03/20/2025')).toBeInTheDocument();
        });
    });
});