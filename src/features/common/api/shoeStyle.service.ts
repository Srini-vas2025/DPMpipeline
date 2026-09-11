// ─────────────────────────────────────────────────────────────
//  All Orders – API Service
// ─────────────────────────────────────────────────────────────
import apiClient from '../../../lib/axios';
import type { ShoeProduct, ShoeProductDetails, CompleteShoeOrderRequest } from '../types/shoeStyle.types';
import type { ProductConfigurationResponse, Doshoe } from '../types/productConfiguration.types';
import type { SaveShoeRequestDto } from '../types/orderShoes.types';

export const fetchShoeStyles = async (
    gender?: string,
    manufacturer?: string,
    closerType?: string,
    signal?: AbortSignal,
): Promise<ShoeProduct[]> => {
    if (gender !== '' || manufacturer !== '' || closerType !== '') {
        const { data } = await apiClient.get<any>(
            `/api/order/getshoestyles??gender=${gender}&manufacturer=${manufacturer}&closerType=${closerType}`,
            {
                signal,
            },
        );
        return data?.data as ShoeProduct[];
    } else {
        return [];
    }
};

export const fetchUserShoeStyles = async (
    physicianId: string | number,
    gender?: string,
    manufacturer?: string,
    closerType?: string,
    signal?: AbortSignal,
): Promise<ShoeProduct[]> => {
    const { data } = await apiClient.get<any>(
        `/api/order/getUserShoestyles?physicianId=${physicianId}&gender=${gender}&manufacturer=${manufacturer}&closerType=${closerType}`,
        {
            signal,
        },
    );
    return data?.data as ShoeProduct[];
};

export const saveFavoriteUserShoeStyles = async (
    createdBy: number,
    model: ShoeProduct,
    signal?: AbortSignal,
): Promise<any> => {
    model.createdBy = createdBy;
    const { data } = await apiClient.post<any>(
        `/api/dpm/saveUserFavouriteStyles`,
        {
            id: model.id,
            createdBy: model.createdBy,
        },
        {
            signal,
        },
    );
    return data?.data;
};

export const fetchAllShoeStyles = async (
    physicianId: string | number,
    gender?: string,
    manufacturer?: string,
    closerType?: string,
    signal?: AbortSignal,
): Promise<ShoeProduct[]> => {

    const { data } = await apiClient.get<any>(
        `/api/order/getShoestyles?physicianId=${physicianId}&gender=${gender}&manufacturer=${manufacturer}&closerType=${closerType}`,
        {
            signal,
        },
    );
    return data?.data as ShoeProduct[];

};
export const fetchShoeProductDetails = async (
    styleId: string | number,
    manfacturer: string,
    gender: string,
    signal?: AbortSignal,
): Promise<ShoeProductDetails[]> => {

    const response = await apiClient.get(
        `/api/order/getshoeproductdetails?styleId=${styleId}&manfacturer=${manfacturer}&gender=${gender}`,
        { signal }
    );
    debugger;
    console.log(response.data?.data);
    return response.data?.data  as ShoeProductDetails[];
};

export const submitOrder = async (request: CompleteShoeOrderRequest): Promise<any> => {
    const { data } = await apiClient.post<any>(`/api/order/completeshoeorder`, request);
    return data;
};
export const fetchProductConfiguration = async (
    productId: string | number,
    requestId: string | number,
    signal?: AbortSignal,
): Promise<ProductConfigurationResponse> => {
    const response = await apiClient.get(
        `/api/ProductConfiguration/productConfiguration?productId=${productId}&requestId=${requestId}`,
        { signal },
    );

    return response.data as ProductConfigurationResponse;
};
export const fetchToeFiller = async (doId: number): Promise<Doshoe> => {
    const response = await apiClient.get(`/api/order/getToeFiller?doId=${doId}`);
    return response.data.data;
};
// ─────────────────────────────────────────────────────────────
//  Save selected product configuration options
// ─────────────────────────────────────────────────────────────

/*
 * Shape the backend expects for saving the patient's selected
 * modification / additional-modification options:
 *
 *   {
 *     "requestId": 1001,
 *     "createdBy": 1,
 *     "configurations": [
 *       { "configurationOptionId": 101, "optionValue": "Yes" },
 *       ...
 *     ]
 *   }
 *
 * Exported here so callers (e.g. OrderShoesModal) can build a
 * strictly-typed payload instead of casting through
 * CompleteShoeOrderRequest.
 */
export interface ConfigurationOptionPayload {
    configurationOptionId: number;
    optionValue: string;
}

export interface SaveConfigurationRequest {
    requestId: number;
    createdBy: number;
    configurations: ConfigurationOptionPayload[];
    /*
     * Not part of the confirmed payload shape — included so the
     * tracking number collected in the "no scan" flow isn't
     * silently dropped. Confirm the actual field name/placement
     * with the backend and adjust (or remove) as needed.
     */
}


/*
 * Endpoint confirmed: /api/ProductConfiguration/SaveRequestConfiguration
 */
export const saveProductConfiguration = async (
    request: SaveConfigurationRequest,
    signal?: AbortSignal,
): Promise<any> => {
    const { data } = await apiClient.post<any>(
        `/api/ProductConfiguration/SaveRequestConfiguration`,
        request,
        { signal },
    );
    return data;
};

export const saveShoeRequest = async (
    payload: SaveShoeRequestDto,
    signal?: AbortSignal,
): Promise<any> => {
    const { data } = await apiClient.post<any>(
        `/api/ProductRequest/saveshoerequest`,
        payload,
        { signal },
    );

    return data;
};