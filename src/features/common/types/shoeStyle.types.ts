export type ShoeColorVariant = {
    id: string;
    image: string;
    label: string;
    swatch: string;
};

export type ShoeProduct = {
    color: string;
    colorVariants?: ShoeColorVariant[];
    gender: 'Male' | 'Female' | '';
    id: string;
    image: string;
    sku: string;
    sourceUrl: string;
    title: string;
    isFavourite: boolean;
    recentlyUsed: number;
    closureType: string;
    stylename: string;
    description: string;
    manufacturer: string;
    createdBy: number;
};
export type ShoeProductDetails = {
    styleId: number;
    gender: 'Male' | 'Female';
    styleName: string;
    manufacturer: string;
    color: string;
    size: string;
    sizeId: number;
    widthName: string;
    widthId: number;
    image: string;
    dealerId: number;
};
export type ModificationData = Record<string, string[]>;
export interface ConfigurationOptionPayload {
    configurationOptionId: number;
    optionValue: string;
}
export interface CompleteShoeOrderRequest {
    personId: string | number;
    doId: string | number;
    size: string;
    width: string;
    color: string;
    trackingNumber: string;
    // Split sizes
    isSplitSize: boolean;
    rightFootSize: string;
    leftFootSize: string;
    rightFootWidth: string;
    leftFootWidth: string;

    // Partial toe filler
    rightPartialToeFiller: string[];
    leftPartialToeFiller: string[];
    product: ShoeProduct;
    // Modifications
    modifications: ModificationData;
    additionalModifications: ModificationData;
    addModifications: boolean;
    // Added for SaveRequestConfiguration
    requestId: string | number;
    createdBy: string | number;
    configurations: ConfigurationOptionPayload[];
}
/*


export const shoeProducts: ShoeProduct[] = [
    {
        id: 'anodyne-mens-casual-comfort',
        title: "Anodyne Men's Casual Comfort",
        sku: 'M064 Black',
        color: 'Black',
        gender: 'Men',
        image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/M064_Black_01-430x430.avif',
        sourceUrl: 'https://shop.quantummedicalsupply.com/product/anodyne-mens-casual-comfort/',
        colorVariants: [
            {
                id: 'black',
                label: 'Black',
                image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/M064_Black_01-430x430.avif',
                swatch: '#111111',
            },
            {
                id: 'whiskey',
                label: 'Whiskey',
                image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/M064_Whiskey_01.avif',
                swatch: '#9a6238',
            },
        ],
    },
    {
        id: 'anodyne-mens-casual-dress-lace',
        title: "Anodyne Men's Casual Dress - Lace",
        sku: 'M030 Black',
        color: 'Black',
        gender: 'Men',
        image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/M030_Black_01-430x430.avif',
        sourceUrl: 'https://shop.quantummedicalsupply.com/product/anodyne-mens-casual-dress-lace/',
        colorVariants: [
            {
                id: 'black',
                label: 'Black',
                image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/M030_Black_01-430x430.avif',
                swatch: '#111111',
            },
            {
                id: 'whiskey',
                label: 'Whiskey',
                image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/M030_Whiskey_01.avif',
                swatch: '#9a6238',
            },
        ],
    },
    {
        id: 'anodyne-mens-casual-dress-velcro',
        title: "Anodyne Men's Casual Dress - Velcro",
        sku: 'M052 Black',
        color: 'Black',
        gender: 'Men',
        image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/M052_Black_01-430x430.avif',
        sourceUrl:
            'https://shop.quantummedicalsupply.com/product/anodyne-mens-casual-dress-velcro/',
        colorVariants: [
            {
                id: 'black',
                label: 'Black',
                image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/M052_Black_01-430x430.avif',
                swatch: '#111111',
            },
            {
                id: 'whiskey',
                label: 'Whiskey',
                image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/M052_Whiskey_01.avif',
                swatch: '#9a6238',
            },
        ],
    },
    {
        id: 'anodyne-mens-casual-comfort-stretch',
        title: "Anodyne Men's No.88 Casual Comfort Stretch",
        sku: 'M066 Black Stretch',
        color: 'Black Stretch',
        gender: 'Men',
        image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/M066_Black-Stretch_01-430x430.avif',
        sourceUrl:
            'https://shop.quantummedicalsupply.com/product/anodyne-mens-casual-comfort-stretch/',
    },
    {
        id: 'anodyne-no-12-mens-casual-oxford',
        title: "Anodyne No. 12 Men's Casual Oxford",
        sku: 'M012 Burnished Brown',
        color: 'Burnished Brown',
        gender: 'Men',
        image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/M012_Burnished-Brown_01-430x430.avif',
        sourceUrl:
            'https://shop.quantummedicalsupply.com/product/anodyne-no-12-mens-casual-oxford/',
    },
    {
        id: 'anodyne-no-22-mens-sport-runner-w-heel-assist',
        title: "Anodyne No. 22 Men's Sport Runner w/ Heel Assist",
        sku: 'MHA022 Grey Black',
        color: 'Grey Black',
        gender: 'Men',
        image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/MHA022_GreyBlack_01-430x430.avif',
        sourceUrl:
            'https://shop.quantummedicalsupply.com/product/anodyne-no-22-mens-sport-runner-w-heel-assist/',
        colorVariants: [
            {
                id: 'grey-black',
                label: 'Grey Black',
                image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/MHA022_GreyBlack_01-430x430.avif',
                swatch: '#3a3a3a',
            },
            {
                id: 'black-red',
                label: 'Black Red',
                image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/MHA022_Black-Red_01-1-430x430.avif',
                swatch: '#9a241f',
            },
        ],
    },
    {
        id: 'anodyne-no-23-sport-runner',
        title: "Anodyne No. 23 Women's Sport Runner",
        sku: 'W023 Teal Lime',
        color: 'Teal Lime',
        gender: 'Women',
        image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/W023_Teal-Lime_01-430x430.avif',
        sourceUrl: 'https://shop.quantummedicalsupply.com/product/anodyne-no-23-sport-runner/',
    },
    {
        id: 'anodyne-no-24-mens-sport-move',
        title: "Anodyne No. 24 Men's Sport Move",
        sku: 'M024 Navy',
        color: 'Navy',
        gender: 'Men',
        image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/M024_Navy_01-430x430.avif',
        sourceUrl: 'https://shop.quantummedicalsupply.com/product/anodyne-no-24-mens-sport-move/',
    },
    {
        id: 'anodyne-no-27-womens-casual-sneaker',
        title: "Anodyne No. 27 Women's Casual Sneaker",
        sku: 'W027 White',
        color: 'White',
        gender: 'Women',
        image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/W027_White_01-430x430.avif',
        sourceUrl:
            'https://shop.quantummedicalsupply.com/product/anodyne-no-27-womens-casual-sneaker/',
    },
    {
        id: 'anodyne-no-27-womens-casual-sneaker-w-heel-assist',
        title: "Anodyne No. 27 Women's Casual Sneaker w/ Heel Assist",
        sku: 'WHA027 White',
        color: 'White',
        gender: 'Women',
        image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/WHA027_White_01-430x430.avif',
        sourceUrl:
            'https://shop.quantummedicalsupply.com/product/anodyne-no-27-womens-casual-sneaker-w-heel-assist/',
    },
    {
        id: 'anodyne-no-28-mens-casual-oxford',
        title: "Anodyne No. 28 Men's Casual Oxford",
        sku: 'M028 Burnished Brown',
        color: 'Burnished Brown',
        gender: 'Men',
        image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/M028_Burnished-Brown_01-430x430.avif',
        sourceUrl:
            'https://shop.quantummedicalsupply.com/product/anodyne-no-28-mens-casual-oxford/',
    },
    {
        id: 'anodyne-no-31-womens-sport-walker-w-heel-assist',
        title: "Anodyne No. 31 Women's Sport Walker w/ Heel Assist",
        sku: 'WHA031 White',
        color: 'White',
        gender: 'Women',
        image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/WHA031_White_01-430x430.avif',
        sourceUrl:
            'https://shop.quantummedicalsupply.com/product/anodyne-no-31-womens-sport-walker-w-heel-assist/',
    },
    {
        id: 'no-33-womens-casual-mary-jane',
        title: "Anodyne No. 33 Women's Casual Mary Jane",
        sku: 'W033 Black Stretch',
        color: 'Black Stretch',
        gender: 'Women',
        image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/W033_Black-Stretch_01-430x430.avif',
        sourceUrl: 'https://shop.quantummedicalsupply.com/product/no-33-womens-casual-mary-jane/',
    },
    {
        id: 'anodyne-no-31-womens-casual-sneaker-w-heel-assist',
        title: "Anodyne No. 35 Women's Sport Move",
        sku: 'W035 White',
        color: 'White',
        gender: 'Women',
        image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/W035_White_01-430x430.avif',
        sourceUrl:
            'https://shop.quantummedicalsupply.com/product/anodyne-no-31-womens-casual-sneaker-w-heel-assist/',
    },
    {
        id: 'anodyne-no-38-mens-sport-walker-w-heel-assist',
        title: "Anodyne No. 38 Men's Sport Walker w/ Heel Assist",
        sku: 'MHA038 White',
        color: 'White',
        gender: 'Men',
        image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/MHA038_White_01-430x430.avif',
        sourceUrl:
            'https://shop.quantummedicalsupply.com/product/anodyne-no-38-mens-sport-walker-w-heel-assist/',
    },
    {
        id: 'anodyne-no-45-womens-sport-jogger-w-heel-assist',
        title: "Anodyne No. 45 Women's Sport Jogger w/ Heel Assist",
        sku: 'WHA045 Purple Pink',
        color: 'Purple Pink',
        gender: 'Women',
        image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/WHA045_Purple-Pink_01-430x430.avif',
        sourceUrl:
            'https://shop.quantummedicalsupply.com/product/anodyne-no-45-womens-sport-jogger-w-heel-assist/',
    },
    {
        id: 'anodyne-no-46-mens-sport-jogger-w-heel-assist',
        title: "Anodyne No. 46 Men's Sport Jogger w/ Heel Assist",
        sku: 'MHA046 Black Grey',
        color: 'Black Grey',
        gender: 'Men',
        image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/MHA046_Black-Grey_01-430x430.avif',
        sourceUrl:
            'https://shop.quantummedicalsupply.com/product/anodyne-no-46-mens-sport-jogger-w-heel-assist/',
    },
    {
        id: 'anodyne-no-46-mens-sport-jogger-w-heel-assist-2',
        title: "Anodyne No. 46 Men's Sport Jogger w/ Heel Assist",
        sku: 'MHA046 Grey Blue',
        color: 'Grey Blue',
        gender: 'Men',
        image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/MHA046_Grey-Blue_01-430x430.avif',
        sourceUrl:
            'https://shop.quantummedicalsupply.com/product/anodyne-no-46-mens-sport-jogger-w-heel-assist-2/',
        colorVariants: [
            {
                id: 'grey-blue',
                label: 'Grey Blue',
                image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/MHA046_Grey-Blue_01-430x430.avif',
                swatch: '#526173',
            },
            {
                id: 'blue-green',
                label: 'Blue Green',
                image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/MHA046_Blue-Green_01-430x430.avif',
                swatch: '#2d7f85',
            },
        ],
    },
    {
        id: 'anodyne-no-48-mens-sport-dash',
        title: "Anodyne No. 48 Men's Sport Dash",
        sku: 'M048 Black',
        color: 'Black',
        gender: 'Men',
        image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/M048_Black_01-1-430x430.avif',
        sourceUrl: 'https://shop.quantummedicalsupply.com/product/anodyne-no-48-mens-sport-dash/',
    },
    {
        id: 'anodyne-no-59-womens-sport-dash',
        title: "Anodyne No. 59 Women's Sport Dash",
        sku: 'W059 Blue',
        color: 'Blue',
        gender: 'Women',
        image: 'https://shop.quantummedicalsupply.com/wp-content/uploads/2026/02/W059_Blue_01-1-430x430.avif',
        sourceUrl: 'https://shop.quantummedicalsupply.com/product/anodyne-no-59-womens-sport-dash/',
    },
];

export function findShoeProduct() {
    return shoeProducts;
}


*/