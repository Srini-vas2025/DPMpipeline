import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ApiPatientDetailsResponse } from '../features/patientdetail/types/patientmodal.api.types';
import PatientDetailsModal from './PatientDetailPage';

const apiResponse = vi.hoisted(
    () =>
        ({
            data: {
                patientInfo: {
                    assignedId: 134551,
                    personId: 987654,
                    firstName: 'Annie',
                    lastName: 'Campbell',
                    dob: '2020-01-01T00:00:00',
                },
                physician: {
                    name: 'Dr. Example',
                    phone: '',
                    address: '',
                    city: '',
                    state: '',
                    zip: '',
                    npi: '',
                },
                insuranceInfo: {
                    primary: null,
                    secondary: null,
                },
                orderProgress: {
                    completed: 1,
                    total: 6,
                },
            },
        }) as ApiPatientDetailsResponse,
);

vi.mock('../features/patientdetail/hooks/usePatientDetails', () => ({
    usePatientDetails: () => ({
        status: 'success',
        data: apiResponse,
        error: null,
        refetch: vi.fn(),
    }),
}));

describe('PatientDetailsModal identity header', () => {
    it('keeps the selected task patient ID while using API name and DOB', () => {
        render(
            <PatientDetailsModal
                personId={987654}
                workflowContext={{
                    patientName: 'Incorrect Task Name',
                    patientId: 'DPM-12345',
                    personId: 987654,
                    dob: '1999-12-31',
                }}
            />,
        );

        const identity = screen.getByLabelText('Patient details');
        expect(identity).toHaveTextContent('Annie Campbell|ID #DPM-12345|01/01/2020');
        expect(identity).not.toHaveTextContent('Incorrect Task Name');
        expect(identity).not.toHaveTextContent('134551');
        expect(identity).not.toHaveTextContent('987654');
    });

    it('falls back to the API patient ID without a task patient ID', () => {
        render(<PatientDetailsModal personId={987654} />);

        expect(screen.getByLabelText('Patient details')).toHaveTextContent('ID #134551');
    });
});
