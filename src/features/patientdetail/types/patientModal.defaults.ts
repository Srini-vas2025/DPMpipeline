// ─────────────────────────────────────────────────────────────
//  Patient Details Modal – Default / Mock Data
//  Use these for storybook, dev, or as fallback defaults
// ─────────────────────────────────────────────────────────────

import type {
    PatientInfo,
    Physician,
    InsuranceInfo,
    OrderProgress,
    ShoeFormOptions,
    CompressionFormOptions,
    ActionMenuItem,
    ShoeFormValues,
    CompressionFormValues,
} from './patientmodal.api.types';

export const DEFAULT_PATIENT: PatientInfo = {
    id: '12232424',
    firstName: 'Nick CHARY',
    lastName: 'Holroyd',
    address: '65 Pin Oak Dr.',
    city: 'Scituate',
    state: 'MA',
    zip: '02066',
    language: 'English',
    languageFlag: 'https://flagcdn.com/us.svg',
    phone: '512-557-5646',
    alternatePhone: '512-557-5646',
    dob: '02 / 25 / 1982',
    ssn: '123-45-6789',
    email: 'nickholroyd@gmail.com',
};

export const DEFAULT_PHYSICIAN: Physician = {
    name: 'Edward Alquero Chary',
    specialty: 'MD | Family Medicine',
    phone: '(112) 233-4455',
    address: '1818 S Australian Ave',
    city: 'West Palm Beach',
    state: 'FL',
    zip: '33409',
    npi: '1122334455',
    pecosEnrolled: false,
};

export const DEFAULT_INSURANCE: InsuranceInfo = {
    primary: {
        provider: 'United Healthcare',
        phone: '(112) 233-4455',
        policyNumber: 'MTN967342791',
        effectiveFrom: '07/01/2018',
        effectiveTo: '12/31/2024',
    },
    secondary: {
        provider: 'United Healthcare',
        phone: '(112) 233-4455',
        policyNumber: 'MTN967342791',
        effectiveFrom: '07/01/2018',
        effectiveTo: '12/31/2024',
    },
};

export const DEFAULT_ORDER_PROGRESS: OrderProgress = {
    total: 6,
    completed: 2,
};

export const DEFAULT_SHOE_FORM_OPTIONS: ShoeFormOptions = {
    diagnosis: [
        { value: 'E11.65', label: 'E11.65 – Type 2 Diabetes with Hyperglycemia' },
        { value: 'E11.40', label: 'E11.40 – Type 2 Diabetes with Neuropathy' },
    ],
    qualifying: [
        { value: 'peripheral_neuropathy', label: 'Peripheral Neuropathy with Evidence of Callus' },
        { value: 'partial_amputation', label: 'History of Partial or Complete Amputation of Foot' },
        { value: 'foot_ulcer', label: 'History of Pre-ulcerative Callus' },
    ],
    leftFootAilments: [
        { value: 'bunion', label: 'Bunion' },
        { value: 'hammertoe', label: 'Hammertoe' },
        { value: 'plantar_fasciitis', label: 'Plantar Fasciitis' },
    ],
    rightFootAilments: [
        { value: 'bunion', label: 'Bunion' },
        { value: 'hammertoe', label: 'Hammertoe' },
        { value: 'plantar_fasciitis', label: 'Plantar Fasciitis' },
    ],
    abnormalCharacteristics: [
        { value: 'flat_foot', label: 'Flat Foot' },
        { value: 'high_arch', label: 'High Arch' },
        { value: 'wide_foot', label: 'Wide Foot' },
    ],
    shoeSelection: [
        { value: 'depth_shoe', label: 'Depth Shoe' },
        { value: 'custom_molded', label: 'Custom Molded Shoe' },
    ],
    insertTypes: [
        { value: 'A5512', label: 'A5512 / Prefab Inserts' },
        { value: 'A5514', label: 'A5514 / Custom Inserts' },
    ],
    toeFillers: [
        { value: 'full', label: 'Full Toe Filler' },
        { value: 'partial', label: 'Partial Toe Filler' },
    ],
};

export const DEFAULT_COMPRESSION_FORM_OPTIONS: CompressionFormOptions = {
    dxCodes: [
        { value: 'I89.0', label: 'I89.0 – Lymphedema, NEC' },
        { value: 'I83.0', label: 'I83.0 – Varicose Veins' },
        { value: 'I87.2', label: 'I87.2 – Venous Insufficiency' },
    ],
    products: [
        { value: 'sleeve', label: 'Compression Sleeve' },
        { value: 'stocking', label: 'Compression Stocking' },
        { value: 'bandage', label: 'Compression Bandage' },
    ],
    sides: [
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
        { value: 'both', label: 'Both' },
    ],
    quantities: [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
    ],
};

export const DEFAULT_ACTION_MENU_ITEMS: ActionMenuItem[] = [
    { key: 'inperson', label: 'In-Person Fitting Form', icon: 'fa-solid fa-user-doctor' },
    { key: 'dispensing', label: 'Dispensing Form', icon: 'fa-solid fa-file-signature' },
    { key: 'proofOfDelivery', label: 'Proof of Delivery', icon: 'fa-solid fa-truck' },
    { key: 'uploadForms', label: 'Upload Forms', icon: 'fa-solid fa-upload' },
    //{ key: 'print', label: 'Print Documents', icon: 'fa-solid fa-print' },
    { key: 'notes', label: 'Notes', icon: 'fa-solid fa-note-sticky' },
];

export const DEFAULT_SHOE_FORM: ShoeFormValues = {
    diagnosis: '',
    qualifying: '',
    leftFoot: '',
    rightFoot: '',
    abnormal: '',
    shoeSelection: '',
    insertType: '',
    toeFiller: '',
    accommodations: '',
    acknowledgement: false,
};

export const DEFAULT_COMPRESSION_FORM: CompressionFormValues = {
    dxCode: '',
    product: '',
    side: '',
    quantity: '',
    acknowledgement: true,
};
