import type { ModificationData, ShoeProduct } from '../../../features/common/types/shoeStyle.types';
import type { ShoeOrderRequest } from '../../../features/common/types/productConfiguration.types';

export type UserAccount = {
    userPasswordId: number;
    userName?: string | null;
    password?: string | null;
    personId: number;
    fromTime?: string | null;
    toTime?: string | null;
    personRoleId: number[];
    orgId: number;
    UniversalFitterDpmPassword?: string | null;
    physicianId: number;
    practiceId: number;
    locationId: number;
    Person: Record<string, unknown>;
};

export type SaveShoeRequestDto = {
    request: ShoeOrderRequest;
    user: UserAccount;
};

export type FilterId = 'closureType' | 'gender' | 'manufacturer';

export type SizeOption = {
    id: number;
    size: string;
};

export type WidthOption = {
    id: number;
    width: string;
};

export type ShoeOrderFormData = {
    product?: ShoeProduct;
    size?: string;
    width?: string;
    color?: string;
    isSplitSize?: boolean;
    rightFootSize?: string;
    leftFootSize?: string;
    rightFootWidth?: string;
    leftFootWidth?: string;
    rightPartialToeFiller?: string[];
    leftPartialToeFiller?: string[];
    modifications?: ModificationData;
    additionalModifications?: ModificationData;
    addModifications?: boolean;
    trackingNumber?: string;
    sizeId: number;
    widthId: number;
    styleId: number;
    dealerId?: number;
};
