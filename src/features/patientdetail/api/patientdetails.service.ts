import apiClient from '../../../lib/axios';
import type {
    PatientInfo,
    Physician,
    InsuranceInfo,
    OrderProgress,
    ApiPatientDetailsResponse,
} from '../types/patientmodal.api.types';

export const fetchPatientDetails = async (
    personId: string | number,
    signal?: AbortSignal,
): Promise<ApiPatientDetailsResponse> => {
    const { data } = await apiClient.get<ApiPatientDetailsResponse>(
        `/api/patientdetails/main/${personId}`,
        { signal },
    );
    return data;
};

// ── Mappers ───────────────────────────────────────────────────

export const mapPatient = (response: ApiPatientDetailsResponse): PatientInfo => {
    const p = response.data.patientInfo;
    const formatDate = (raw: string | null | undefined): string => {
        if (!raw) return '';
        const date = new Date(raw);
        if (Number.isNaN(date.getTime())) return raw;
        return date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
        });
    };

    return {
        // personId is the internal lookup key used by the endpoint. assignedId is
        // the patient-facing ID returned by the patient details API.
        id: p.assignedId ?? p.personId,
        firstName: p.firstName ?? '',
        lastName: p.lastName ?? '',
        address: p.address ?? '',
        address2: p.address2 ?? undefined,
        city: p.city ?? '',
        state: p.state ?? '',
        zip: p.zip ?? '',
        language: p.language ?? 'English',
        languageFlag: 'https://flagcdn.com/us.svg',
        phone: p.phone ?? '',
        alternatePhone: p.alternatePhone ?? undefined,
        dob: formatDate(p.dob),
        ssn: p.ssn ?? '',
        email: p.email ?? '',
    };
};

export const mapPhysician = (response: ApiPatientDetailsResponse): Physician => {
    const p = response.data.physician;
    return {
        name: p.name ?? '',
        specialty: p.specialty ?? undefined,
        phone: p.phone ?? '',
        address: p.address ?? '',
        city: p.city ?? '',
        state: p.state ?? '',
        zip: p.zip ?? '',
        npi: p.npi ?? '',
        pecosEnrolled: p.pecosEnrolled ?? false,
    };
};

export const mapInsurance = (response: ApiPatientDetailsResponse): InsuranceInfo => {
    const { primary, secondary } = response.data.insuranceInfo;
    return {
        primary: primary
            ? {
                  provider: primary.providerName ?? '',
                  phone: primary.phone ?? '',
                  policyNumber: primary.policyNo ?? '',
                  effectiveFrom: primary.effectiveFrom ?? '',
                  effectiveTo: primary.effectiveTo ?? '',
              }
            : {
                  provider: '',
                  phone: '',
                  policyNumber: '',
                  effectiveFrom: '',
                  effectiveTo: '',
              },
        secondary: secondary
            ? {
                  provider: secondary.providerName ?? '',
                  phone: secondary.phone ?? '',
                  policyNumber: secondary.policyNo ?? '',
                  effectiveFrom: secondary.effectiveFrom ?? '',
                  effectiveTo: secondary.effectiveTo ?? '',
              }
            : undefined,
    };
};

export const mapOrderProgress = (response: ApiPatientDetailsResponse): OrderProgress => ({
    total: response.data.orderProgress.total,
    completed: response.data.orderProgress.completed,
});
