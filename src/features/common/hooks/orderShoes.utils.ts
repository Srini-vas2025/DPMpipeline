import shoeImageFallback from '../../../assets/images/shoe-img.png';
import type {
    ProductConfigurationResponse,
    ConfigurationItemResponse,
    ConfigurationOptionResponse,
    RequestConfigurationItem,
} from '../../../features/common/types/productConfiguration.types';
import type {    ModificationData,
} from '../../../features/common/types/shoeStyle.types';
import { colorSwatches } from '../../../features/common/hooks/orderShoes.constants';

export const resolveShoeImage = (image?: string, sourceUrl?: string): string => {
    const candidate = image?.trim() || sourceUrl?.trim();
    if (!candidate) return shoeImageFallback;

    const filename = candidate.split(/[\\/]/).pop()?.split(/[?#]/)[0].toLowerCase();
    if (filename?.endsWith('.jpg')) {
        return new URL(`/assets/shoes/${encodeURIComponent(filename)}`, window.location.origin).href;
    }
    if (/^(?:https?:|data:|blob:)/i.test(candidate)) {
        return candidate;
    }

    const configuredBase = String(import.meta.env.VITE_APP_SHOE_SOURCE ?? '').trim();
    const apiBase = String(import.meta.env.VITE_API_BASE_URL ?? '').trim();
    const assetBase = configuredBase || apiBase || 'https://sandbox.softgait.com';
    const base = new URL(assetBase, window.location.origin).toString();

    try {
        return new URL(candidate, base.endsWith('/') ? base : `${base}/`).toString();
    } catch {
        return shoeImageFallback;
    }
};

export function swatchForColor(color: string) {
    return colorSwatches[color.toLowerCase()] || '#103e52';
}

export function checkColorForSwatch(hexColor: string) {
    const normalized = hexColor.replace('#', '');
    const red = Number.parseInt(normalized.slice(0, 2), 16);
    const green = Number.parseInt(normalized.slice(2, 4), 16);
    const blue = Number.parseInt(normalized.slice(4, 6), 16);
    const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
    return luminance > 0.62 ? '#103e52' : '#ffffff';
}

export function sortConfigurationOptions(options: ConfigurationOptionResponse[]): ConfigurationOptionResponse[] {
    return [...options].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
}

export function normalizeConfigurationOptions(options: ConfigurationOptionResponse[] = []): ConfigurationOptionResponse[] {
    if (!options.length) return [];

    const hasNestedChildren = options.some((option) => (option.children?.length ?? 0) > 0);

    if (hasNestedChildren) {
        const cloneOptions = (source: ConfigurationOptionResponse[]): ConfigurationOptionResponse[] => {
            return sortConfigurationOptions(
                source.map((option) => ({
                    ...option,
                    children: cloneOptions(option.children ?? []),
                }))
            );
        };
        return cloneOptions(options);
    }

    const optionMap = new Map<number, ConfigurationOptionResponse>();
    options.forEach((option) => {
        optionMap.set(option.configurationOptionId, { ...option, children: [] });
    });

    const rootOptions: ConfigurationOptionResponse[] = [];
    const isRootParentId = (parentId: number | null | undefined) =>
        parentId === null || parentId === undefined || parentId === 0;

    options.forEach((option) => {
        const currentOption = optionMap.get(option.configurationOptionId);
        if (!currentOption) return;

        if (isRootParentId(option.parentConfigurationOptionId)) {
            rootOptions.push(currentOption);
            return;
        }

        const parentOption = optionMap.get(option.parentConfigurationOptionId as number);
        if (parentOption) {
            parentOption.children = parentOption.children ?? [];
            parentOption.children.push(currentOption);
        } else {
            rootOptions.push(currentOption);
        }
    });

    const sortRecursive = (source: ConfigurationOptionResponse[]): ConfigurationOptionResponse[] => {
        return sortConfigurationOptions(
            source.map((option) => ({
                ...option,
                children: sortRecursive(option.children ?? []),
            }))
        );
    };

    return sortRecursive(rootOptions);
}

export function isConfigurationOptionSelected(option: ConfigurationOptionResponse): boolean {
    const candidate = option as ConfigurationOptionResponse & { isSelected?: boolean; IsSelected?: boolean };
    return candidate.isSelected === true || candidate.IsSelected === true;
}

export function isMatrixItem(item: ConfigurationItemResponse): boolean {
    const name = item.itemName?.trim().toLowerCase() ?? '';
    return name === 'met heads' || name === 'distal tips';
}

export function buildSelectedValuesForItem(item: ConfigurationItemResponse): string[] {
    const options = normalizeConfigurationOptions(item.options ?? []);
    const selectedValues: string[] = [];

    if (isMatrixItem(item)) {
        options.forEach((option) => {
            const optionName = option.optionName?.trim().toLowerCase() ?? '';
            if ((optionName === 'offload' || optionName === 'sweetspot') && isConfigurationOptionSelected(option)) {
                selectedValues.push(option.optionName);
            }
            if (optionName === 'right' || optionName === 'left') {
                normalizeConfigurationOptions(option.children ?? []).forEach((childOption) => {
                    if (isConfigurationOptionSelected(childOption)) {
                        selectedValues.push(`${option.optionName}${childOption.optionName}`);
                    }
                });
            }
        });
        return Array.from(new Set(selectedValues));
    }

    options.forEach((option) => {
        const hasChildren = (option.children?.length ?? 0) > 0;
        if (!hasChildren) {
            if (isConfigurationOptionSelected(option)) {
                selectedValues.push(option.optionName);
            }
            return;
        }
        normalizeConfigurationOptions(option.children ?? []).forEach((childOption) => {
            if (isConfigurationOptionSelected(childOption)) {
                selectedValues.push(`${option.optionName}-${childOption.optionName}`);
            }
        });
    });

    return Array.from(new Set(selectedValues));
}

export function getConfigurationItems(configuration: ProductConfigurationResponse | undefined, additional: boolean): ConfigurationItemResponse[] {
    if (!configuration?.categories?.length) return [];

    const categories = [...configuration.categories].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    const category = categories.find((item) => {
        const name = item.categoryName?.trim().toLowerCase() ?? '';
        if (additional) return name.includes('additional modifications');
        return name.includes('modifications') && !name.includes('additional modifications');
    });

    if (!category) return [];

    return [...(category.items ?? [])].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
}

export function buildSelectedConfigurationData(configuration: ProductConfigurationResponse | undefined): {
    modifications: ModificationData;
    additionalModifications: ModificationData;
} {
    const modifications: ModificationData = {};
    const additionalModifications: ModificationData = {};

    if (!configuration) {
        return { modifications, additionalModifications };
    }

    const modificationItems = getConfigurationItems(configuration, false);
    const additionalItems = getConfigurationItems(configuration, true);

    modificationItems.forEach((item) => {
        const values = buildSelectedValuesForItem(item);
        if (values.length > 0) modifications[item.itemName] = values;
    });

    additionalItems.forEach((item) => {
        const values = buildSelectedValuesForItem(item);
        if (values.length > 0) additionalModifications[item.itemName] = values;
    });

    return { modifications, additionalModifications };
}

export function buildOptionLookupForItem(item: ConfigurationItemResponse): Map<string, number> {
    const lookup = new Map<string, number>();
    const options = normalizeConfigurationOptions(item.options ?? []);

    if (isMatrixItem(item)) {
        options.forEach((option) => {
            const name = option.optionName?.trim().toLowerCase();
            if (name === 'offload' || name === 'sweetspot') {
                lookup.set(option.optionName, option.configurationOptionId);
                return;
            }
            if (name === 'right' || name === 'left') {
                normalizeConfigurationOptions(option.children ?? []).forEach((child) => {
                    lookup.set(`${option.optionName}${child.optionName}`, child.configurationOptionId);
                });
            }
        });
        return lookup;
    }

    options.forEach((option) => {
        const hasChildren = (option.children?.length ?? 0) > 0;
        if (!hasChildren) {
            lookup.set(option.optionName, option.configurationOptionId);
            return;
        }
        normalizeConfigurationOptions(option.children ?? []).forEach((child) => {
            lookup.set(`${option.optionName}-${child.optionName}`, child.configurationOptionId);
        });
    });

    return lookup;
}

export function buildConfigurationsPayload(
    configuration: ProductConfigurationResponse | undefined,
    modifications: ModificationData,
    additionalModifications: ModificationData
): RequestConfigurationItem[] {
    if (!configuration) return [];

    const allItems = [
        ...getConfigurationItems(configuration, false),
        ...getConfigurationItems(configuration, true),
    ];
    const itemsByName = new Map(allItems.map((item) => [item.itemName, item]));
    const configurations: RequestConfigurationItem[] = [];

    const appendFromModificationData = (data: ModificationData) => {
        Object.entries(data).forEach(([itemName, values]) => {
            const item = itemsByName.get(itemName);
            if (!item) return;

            const lookup = buildOptionLookupForItem(item);
            values.forEach((value) => {
                const separatorIndex = value.indexOf(':');
                if (separatorIndex !== -1) {
                    const label = value.slice(0, separatorIndex);
                    const rawValue = value.slice(separatorIndex + 1);
                    const configurationOptionId = lookup.get(label);
                    if (configurationOptionId !== undefined) {
                        configurations.push({ configurationOptionId, optionValue: rawValue });
                    }
                    return;
                }

                const configurationOptionId = lookup.get(value);
                if (configurationOptionId !== undefined) {
                    configurations.push({ configurationOptionId, optionValue: value });
                }
            });
        });
    };

    appendFromModificationData(modifications);
    appendFromModificationData(additionalModifications);

    return configurations;
}

export function splitIntoColumns<T>(items: T[], columnCount = 2): T[][] {
    if (!items.length) return [];
    const columnSize = Math.ceil(items.length / columnCount);
    return Array.from({ length: columnCount }, (_, index) =>
        items.slice(index * columnSize, (index + 1) * columnSize)
    ).filter((column) => column.length > 0);
}

export function mapAdditionalConfigurationItem(item: ConfigurationItemResponse) {
    const options = normalizeConfigurationOptions(item.options ?? []);
    const directOptions = options
        .filter((option) => !option.children || option.children.length === 0)
        .map((option) => option.optionName);

    const subgroups = options
        .filter((option) => option.children && option.children.length > 0)
        .map((option) => ({
            label: option.optionName,
            options: normalizeConfigurationOptions(option.children ?? []).map((child) => child.optionName),
        }));

    return {
        title: item.itemName,
        note: item.itemDescription ?? undefined,
        options: directOptions.length > 0 ? directOptions : undefined,
        subgroups: subgroups.length > 0 ? subgroups : undefined,
    };
}

export function makeFieldUpdater<T extends object>(
    setState: React.Dispatch<React.SetStateAction<Partial<T>>>
) {
    return <K extends keyof T>(key: K, value: T[K]) =>
        setState((prev) => ({ ...prev, [key]: value }));
}
