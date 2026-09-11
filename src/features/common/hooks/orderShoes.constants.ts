import type { FilterId } from './orderShoes.types';

export const filters: Array<{
    id: FilterId;
    label: string;
    options: Array<{ label: string; value: string }>;
}> = [
    {
        id: 'gender',
        label: 'Gender',
        options: [
            { label: 'Male', value: 'Male' },
            { label: 'Female', value: 'Female' },
        ],
    },
    {
        id: 'manufacturer',
        label: 'Manufacturer',
        options: [
            { label: 'Anodyne', value: 'Anodyne' },
            { label: 'Apex', value: 'APEX' },
            { label: 'Orthofeet', value: 'ORTHOFEET' },
            { label: 'Oasis Footwear', value: 'OASIS FOOTWEAR' },
            { label: 'Bell- Horn', value: 'BELL- HORN' },
            { label: 'New Balance', value: 'NEW BALANCE' },
            { label: 'Apis', value: 'APIS' },
            { label: 'Pedlite', value: 'PEDLITE' },
            { label: 'Hush Puppies', value: 'HUSH PUPPIES' },
            { label: 'Sure-Fit', value: 'SURE FIT' },
            { label: 'Dr Comfort', value: 'DR COMFORT' },
            { label: 'Drew', value: 'DREW' },
            { label: 'Propet', value: 'PROPET' },
        ],
    },
    {
        id: 'closureType',
        label: 'Closure Type',
        options: [
            { label: 'Lace', value: 'LACE' },
            { label: 'Velcro', value: 'VELCRO' },
        ],
    },
];

export const toeDigits = ['1', '2', '3', '4', '5'];

export const colorSwatches: Record<string, string> = {
    black: '#111111',
    'black stretch': '#111111',
    'black grey': '#1f2327',
    'grey black': '#3a3a3a',
    'black red': '#8f2926',
    whiskey: '#9a6238',
    'burnished brown': '#764d32',
    'teal lime': '#158c9b',
    navy: '#1c3857',
    white: '#ffffff',
    'grey blue': '#526173',
    'blue green': '#2d7f85',
    'purple pink': '#7d4d8a',
    blue: '#2d6fba',
    brown: '#8B4513',
    beige: '#F5F5DC',
    sand: '#C2B280',
    tan: '#D2B48C',
    grey: '#808080',
    red: '#D32F2F',
    pink: '#FFC0CB',
    burgandy: '#800020',
    camel: '#C19A6B',
    'dark brown': '#5C4033',
    'light blue': '#ADD8E6',
};
