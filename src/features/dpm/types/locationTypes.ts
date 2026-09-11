export interface Location {
    locationId?: number;
    practiceId?: number;
    objectId?: number;
    objectType?: string;
    name?: string;
    practiceName?: string;
    address?: string;
    address2?: string;
    city?: string;
    state?: string;
    zip?: string;
    phone?: string;
    fax?: string;
    status?: string;
    isActive?: boolean;
}
export interface UserPriveleges {
    userPrivelegeId?: number;
    personId?: number;
    roleId?: number;
    isActive?: boolean;
    practiceId?: number;
}

export interface PracticeUser {
    id?: string | number;
    name: string;
    address?: string;
    latitude?: number | null;
    longitude?: number | null;
    practiceUserId?: number;
    orgId?: number;
    practiceId?: number;
    personId?: number;
    physicianId?: number;
    practiceName?: string;
    first?: string;
    last?: string;
    email?: string;
    title?: string;
    userName?: string;
    phone?: string;
    phoneExtension?: string;
    status?: string;
    isActive?: boolean;
    objectType?: string;
    isSigningPhysician?: boolean;
    isAdministrator?: boolean;
    npi?: string;
    physicians?: PracticeUser[];
    assignedLocations?: Location[];
    roleIds?: string;
    locationId?: number;
    isLoggedInUserIsPhysician?: boolean;
    isLocationsLinked?: boolean;
    isPhysicianHasPayRollRole?: boolean;
    returnShoes?: boolean;
    isFitCompression?: boolean;
    userPriveleges?: UserPriveleges[];
}