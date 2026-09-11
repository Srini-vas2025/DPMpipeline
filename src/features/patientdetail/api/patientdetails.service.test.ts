import { describe, expect, it } from 'vitest';
import type { ApiPatientDetailsResponse } from '../types/patientmodal.api.types';
import { mapPatient } from './patientdetails.service';

const patientResponse = {
    data: {
        patientInfo: {
            assignedId: 134551,
            personId: 987654,
            firstName: 'Annie',
            lastName: 'Campbell',
            dob: '2020-01-01T00:00:00',
        },
    },
} as ApiPatientDetailsResponse;

describe('mapPatient', () => {
    it('maps the patient-facing identity fields from the patient details API', () => {
        const patient = mapPatient(patientResponse);

        expect(patient.id).toBe(134551);
        expect(patient.id).not.toBe(987654);
        expect(`${patient.firstName} ${patient.lastName}`).toBe('Annie Campbell');
        expect(patient.dob).toBe('01/01/2020');
    });
});
