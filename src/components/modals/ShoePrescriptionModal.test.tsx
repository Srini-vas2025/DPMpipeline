import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ShoePrescriptionModal from './ShoePrescriptionModal';

const renderPrescription = (onSubmit = vi.fn()) => {
    render(
        <ShoePrescriptionModal
            context={{ patientId: 'DPM-1005', patientName: 'Riley Thompson' }}
            onClose={vi.fn()}
            onContinueFitting={vi.fn()}
            onScheduleFitting={vi.fn()}
            onSubmit={onSubmit}
        />,
    );

    return onSubmit;
};

describe('ShoePrescriptionModal', () => {
    it('renders every field in the current prescription design', () => {
        renderPrescription();

        expect(screen.getByRole('heading', { name: 'New Shoe Prescription' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Diagnosis' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Left Foot Deformities' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Right Foot Deformities' })).toBeInTheDocument();
        expect(
            screen.getByRole('heading', { name: 'Additional Qualifications' }),
        ).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Poor Circulation' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Neuropathy' })).toBeInTheDocument();
        expect(screen.getAllByRole('combobox')).toHaveLength(14);
        expect(screen.getAllByRole('textbox')).toHaveLength(3);
        expect(
            screen.getByRole('button', { name: 'Qualifying Conditions Select' }),
        ).toBeInTheDocument();
    });

    it('submits selected qualifying conditions with the rest of the draft', async () => {
        const onSubmit = renderPrescription();

        fireEvent.click(screen.getByRole('button', { name: 'Qualifying Conditions Select' }));
        fireEvent.click(
            screen.getByRole('button', {
                name: 'History of partial or complete amputation of the foot',
            }),
        );
        fireEvent.change(screen.getByLabelText('Select Insert Type'), {
            target: { value: 'A5514 / Custom inserts' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Submit Form' }));

        await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                acknowledged: true,
                qualifyingConditions: ['History of partial or complete amputation of the foot'],
                values: expect.objectContaining({ insertType: 'A5514 / Custom inserts' }),
            }),
        );
    });
});
