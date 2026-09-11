import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import FittingDispensingModal from './FittingDispensingModal';

vi.mock('./InPersonFittingForm', () => ({
    default: () => <div>Fitting form content</div>,
}));

vi.mock('./NewDispensingForm', () => ({
    default: () => <div>Dispensing form content</div>,
}));

const renderModal = (onScheduleAppointment = vi.fn()) =>
    render(
        <FittingDispensingModal
            context={{ patientName: 'Riley Thompson', patientId: 'DPM-1005' }}
            initialTab="fitting"
            onClose={vi.fn()}
            onEditPrescription={vi.fn()}
            onScheduleAppointment={onScheduleAppointment}
        />,
    );

const openActions = () => fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

afterEach(() => {
    vi.restoreAllMocks();
});

describe('FittingDispensingModal actions', () => {
    it('prints both forms from the actions menu', () => {
        const print = vi.spyOn(window, 'print').mockImplementation(() => undefined);
        renderModal();

        openActions();
        fireEvent.click(screen.getByRole('menuitem', { name: 'Print forms' }));

        expect(print).toHaveBeenCalledOnce();
    });

    it('opens the scheduling flow through the supplied callback', () => {
        const onScheduleAppointment = vi.fn();
        renderModal(onScheduleAppointment);

        openActions();
        fireEvent.click(screen.getByRole('menuitem', { name: 'Schedule appointment' }));

        expect(onScheduleAppointment).toHaveBeenCalledOnce();
    });

    it('confirms and displays the cannot-contact status', () => {
        renderModal();

        openActions();
        fireEvent.click(screen.getByRole('menuitem', { name: 'Mark as cannot contact' }));

        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
        fireEvent.click(
            screen.getByRole('button', { name: 'Mark as cannot contact', hidden: true }),
        );

        expect(screen.getByRole('status')).toHaveTextContent('Patient marked as cannot contact');
    });
});
