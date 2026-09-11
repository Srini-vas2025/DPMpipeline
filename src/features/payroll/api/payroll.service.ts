import apiClient from '../../../lib/axios';
import type { ApiPayrollRow } from '../types/payroll.types';

export const fetchPayroll = async (
    physicianId: string | number,
    practiceId: string | number,
    locationId: string | number,
    payrollSearch: string | number,

    //nextPayRollDate: string | null,
    //statusNo: string | number,
    searchString: string | number | null,
): Promise<{
    data: ApiPayrollRow[];
    datesDropdown: string[];
    payrollDate: string;
    totalAmount: number;
}> => {
    console.log(
        `/api/dpm/dpmPayroll?physicianId=${physicianId}&&practiceId=${practiceId}&&locationId=${locationId}&&payrollSearch=${payrollSearch}&&searchString=${searchString}`,
    );
    const { data } = await apiClient.get<{
        data: ApiPayrollRow[];
        datesDropdown: string[];
        payrollDate: string;
        totalAmount: number;
    }>(
        `/api/dpm/dpmPayroll?physicianId=${physicianId}&&practiceId=${practiceId}&&locationId=${locationId}&&payrollSearch=${payrollSearch}&&searchString=${searchString}`,
    );
    return data;
};
