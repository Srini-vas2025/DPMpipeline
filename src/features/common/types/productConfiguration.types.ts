export interface ConfigurationOptionResponse {
    configurationOptionId: number;
    parentConfigurationOptionId?: number | null;
    optionName: string;
    displayOrder: number;
    isSelected: boolean;
    children: ConfigurationOptionResponse[];
}

export interface ConfigurationItemResponse {
    configurationItemId: number;
    itemName: string;
    itemDescription?: string | null;
    displayOrder: number;
    isRequired: boolean;
    options: ConfigurationOptionResponse[];
}

export interface ConfigurationCategoryResponse {
    configurationCategoryId: number;
    categoryName: string;
    displayOrder: number;
    items: ConfigurationItemResponse[];
}

export interface ProductConfigurationResponse {
    productId: number;
    categories: ConfigurationCategoryResponse[];
}

export interface ShoeOrderRequest {

    // DoctorOrderAll
    doId: number;

    dealerId: number;

    secondDealerId: number;

    isReturned?: boolean | null;

    is3DScan?: boolean | null;

    personId: number;

    statusNo: number;

    isFittingAppointment: boolean;

    autoSend: boolean;

    productId: number;

    priorAuthNo?: string | null;

    isOnHold: boolean;

    isEmailSent: boolean;

    attentionTo?: string | null;

    physicianId: number;

    isOneTimeReorder: boolean;

    isIncomplete: boolean;

    expiryDate: string;

    requiresPriorAuth: boolean;

    isDeductible: boolean;

    priorAuthType: number;

    isDoFilledByFitter: boolean;

    cbaGroupId: number;

    previousStatusNo: number;

    isRxonly: boolean;

    isMedicalRecordsIncluded: boolean;

    isClaimProcessVerified: boolean;

    cgmType?: string | null;

    cgmModel?: string | null;

    isRevise: boolean;

    snfHospice?: string | null;

    doPriorAuthType: number;

    isIncludedReports?: string | null;

    effectDate?: string | null;

    patientAdvocate: number;

    educatorId: number;

    patientNote?: string | null;

    payrollType?: string | null;

    tracking_Number?: string | null;

    isExamining: boolean;

    requestId: number;

    isDpmClient: boolean;


    // =====================================================
    // Shoe related objects
    // =====================================================

    doShoesDetails?: Doshoe;

    shoeStyles?: ProductStyle;

    subProducts?: ProductRequestAll;

    requestShoes?: ProductRequestShoes;


    // =====================================================
    // DPM Configuration
    // =====================================================

    configurations: RequestConfigurationItem[];
}


// =========================================================
// Doshoe
// =========================================================

// export interface Doshoe {
//     doShoeId?: number;
//     doId?: number;
//     shoeId?: number;
//     shoeStyleId?: number;

//     sizeId?: number;
//     widthId?: number;

//     size?: string | null;
//     width?: string | null;

//     quantity?: number;
// }
export interface Doshoe {
    doshoesId?: number;
    doId: number;
    toeFiller: number;
    isActive?: boolean | null;
    createdBy?: number | null;
    dateCreated?: string | null;
    modifiedBy?: number | null;
    dateModified?: string | null;
    timeStamp?: string | null;
}
// =========================================================
// Product Style
// =========================================================

export interface ProductStyle {
    productStyleId: number;
    manufacturerId?: number;
    description?: string | null;
    styleName?: string | null;
    image?: string | null;
    closuretypeId?: number | null;
    genderId: number;
    colourId?: number | null;
    active?: string | null;
    createdBy?: number | null;
    dateCreated?: string | null;
    modifiedBy?: number | null;
    dateModified?: string | null;
    timeStamp?: string | null;
    price?: number | null;
    color: string | null;
    gender: string | null;
}
// =========================================================
// Product Request All
// =========================================================

export interface ProductRequestAll {
    RequestId: number;
    OrderId: number;
    DoId: number;
    PersonId: number;
    StatusNo: number;
    ProductId: number;

    requestedShoes?: ProductRequestShoes;
}
// =========================================================
// Product Request Shoes
// =========================================================

export interface ProductRequestShoes {
    ProductrequestShoesId?: number;
    ProductrequestId: number;

    StyleId: number;
    SizeId: number;
    WidthId: number;

    Insoles: number;
    ArrivalDate?: string | null;
    BulkShipmentNo: number;
    DispensedDate?: string | null;
    ToeFiller: number;
    DealerId: number;
    Rating: number;

    WidthText?: string | null;
    SizeText?: string | null;
}


// =========================================================
// Configuration
// =========================================================

export interface RequestConfigurationItem {

    configurationOptionId: number;

    optionValue?: string | null;
}