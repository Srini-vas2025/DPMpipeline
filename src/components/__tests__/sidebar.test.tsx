/**
 * Unit test — Sidebar component.
 *
 * Verifies all navigation items render correctly within a router context.
 * Uses @testing-library/react for DOM assertions.
 */
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from '../sidebar';

vi.mock('../../hooks/usePermissions', () => ({
    usePermissions: () => ({ hasRole: () => true }),
}));

const renderSidebar = () =>
    render(
        <MemoryRouter initialEntries={['/tasks']}>
            <Sidebar />
        </MemoryRouter>,
    );

describe('Sidebar', () => {
    it('renders all navigation labels', () => {
        renderSidebar();
        expect(screen.getByText('Tasks')).toBeInTheDocument();
        expect(screen.getByText('Appointments')).toBeInTheDocument();
        expect(screen.getByText('All Orders')).toBeInTheDocument();
        expect(screen.getByText('Reorder List')).toBeInTheDocument();
        expect(screen.getByText('Confirm Arrival')).toBeInTheDocument();
        expect(screen.getByText('Return Shoes')).toBeInTheDocument();
        expect(screen.getByText('Payroll')).toBeInTheDocument();
    });

    it('places Appointments directly above Payroll', () => {
        renderSidebar();

        const labels = screen
            .getAllByRole('button')
            .map((button) => button.querySelector('.side-nav-items-label')?.textContent);

        expect(labels.slice(-2)).toEqual(['Appointments', 'Payroll']);
    });

    it('marks the active nav link correctly', () => {
        renderSidebar();
        const tasksButton = screen.getByText('Tasks').closest('button');
        expect(tasksButton).toHaveClass('active');
        expect(tasksButton).toHaveAttribute('aria-current', 'page');
        expect(document.querySelector('.nav-selection-indicator')).toHaveStyle({
            '--active-nav-index': '0',
        });
    });

    it('uses a solid active icon and regular inactive icons', () => {
        renderSidebar();

        const activeIcon = screen.getByText('Tasks').closest('button')?.querySelector('.nav-icon');
        expect(activeIcon).toHaveClass('nav-icon-fa-solid');
        expect(activeIcon).not.toHaveClass('nav-icon-fa-regular');

        for (const label of [
            'Appointments',
            'All Orders',
            'Reorder List',
            'Confirm Arrival',
            'Return Shoes',
            'Payroll',
        ]) {
            const icon = screen.getByText(label).closest('button')?.querySelector('.nav-icon');
            const usesRegularStyle =
                icon?.classList.contains('nav-icon-fa-regular') ||
                icon?.classList.contains('fa-regular');

            expect(usesRegularStyle).toBe(true);
            expect(icon).not.toHaveClass('nav-icon-fa-solid');
            expect(icon).not.toHaveClass('fa-solid');
        }
    });
});
