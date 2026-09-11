import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LoaderCircle, Search, X } from 'lucide-react';

import '../../styles/OrderShoesModal.css';

import { useAllShoeStyles, useSaveFavoriteStyle } from '../../features/common/hooks/useShoeStyles';
import { useProductConfiguration } from '../../features/common/hooks/useProductConfiguration';
import type { ShoeProduct } from '../../features/common/types/shoeStyle.types';
import type { WorkflowContext } from '../../types/workflow';
import PatientModalMeta from '../workflow/PatientModalMeta';
import { fetchShoeProductDetails, fetchToeFiller } from '../../features/common/api/shoeStyle.service';

import type { UserAccount, SizeOption, WidthOption, ShoeOrderFormData } from '../../features/common/types/orderShoes.types';
import { filters } from '../../features/common/hooks/orderShoes.constants';
import { swatchForColor, buildSelectedConfigurationData } from '../../features/common/hooks/orderShoes.utils';
import { ShoeCard, ShoeSection } from './orderShoes/OrderShoesSubcomponents';
import { ProductDetail, ProductFulfillment } from './orderShoes/OrderShoesProductViews';

export default function OrderShoesModal({
    context,
    user,
    onClose,
}: {
    context: WorkflowContext;
    user?: UserAccount;
    onClose: () => void;
}) {
    const [selectedFilters, setSelectedFilters] = useState<ShoeProduct>({
        color: '',
        gender: '',
        id: '0',
        image: '',
        sku: '',
        sourceUrl: '',
        title: '',
        isFavourite: false,
        recentlyUsed: 0,
        closureType: '',
        stylename: '',
        description: '',
        manufacturer: '',
        createdBy: 0,
    });

    const allResult = useAllShoeStyles(selectedFilters);
    const isLoading = allResult.isLoading;
    const isError = allResult.isError;
    const shoeStyles = allResult?.shoeStyles ?? allResult ?? [];

    const [selectedProduct, setSelectedProduct] = useState<ShoeProduct | null>(null);

    const requestId = context?.doId;
    const {
        data: productConfiguration,
        isLoading: isConfigurationLoading,
        isError: isConfigurationError,
    } = useProductConfiguration(requestId);

    const [orderData, setOrderData] = useState<Partial<ShoeOrderFormData>>({
        size: '',
        width: '',
        color: '',
        isSplitSize: false,
        rightFootSize: '',
        leftFootSize: '',
        rightFootWidth: '',
        leftFootWidth: '',
        rightPartialToeFiller: [],
        leftPartialToeFiller: [],
        modifications: {},
        additionalModifications: {},
        addModifications: false,
        trackingNumber: '',
    });

    const initializedConfigurationKeyRef = useRef<string | null>(null);

    useEffect(() => {
        if (requestId === undefined || requestId === null || !productConfiguration) return;

        const configurationKey = `${requestId}:${productConfiguration.productId ?? 1}`;
        if (initializedConfigurationKeyRef.current === configurationKey) return;

        const { modifications, additionalModifications } = buildSelectedConfigurationData(productConfiguration);
        setOrderData((prev) => ({ ...prev, modifications, additionalModifications }));
        initializedConfigurationKeyRef.current = configurationKey;
    }, [requestId, productConfiguration]);

    const [productView, setProductView] = useState<'details' | 'fulfillment'>('details');

    const recentProducts = shoeStyles ? shoeStyles.filter((m: any) => m.recentlyUsed > 0).slice(0, 5) : [];
    const favoriteProducts = shoeStyles ? shoeStyles.filter((m: any) => m.isFavourite) : [];
    const allProducts =
        (selectedFilters.gender !== '' || selectedFilters.manufacturer !== '' || selectedFilters.closureType !== '') && shoeStyles
            ? shoeStyles
            : [];

    const [favProduct, setFavProduct] = useState<ShoeProduct>({
        color: '',
        gender: '',
        id: '0',
        image: '',
        sku: '',
        sourceUrl: '',
        title: '',
        isFavourite: false,
        recentlyUsed: 0,
        closureType: '',
        stylename: '',
        description: '',
        manufacturer: '',
        createdBy: 0,
    });

    const [fulfillmentSizes, setFulfillmentSizes] = useState<SizeOption[]>([]);
    const [fulfillmentWidths, setFulfillmentWidths] = useState<WidthOption[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [toeFillerId, setToeFillerId] = useState<number | null>(null);
    function matchesSelectedFilters(product: ShoeProduct) {
        const normalizedSearch = searchTerm.trim().toLowerCase();
        if (
            normalizedSearch &&
            ![product.title, product.sku, product.color, product.manufacturer]
                .join(' ')
                .toLowerCase()
                .includes(normalizedSearch)
        ) {
            return false;
        }

        if (selectedFilters.gender !== '' && product.gender !== selectedFilters.gender) {
            return false;
        }

        if (
            selectedFilters.closureType &&
            selectedFilters.closureType !== '' &&
            !product.closureType.toLowerCase().includes(selectedFilters.closureType.toLowerCase())
        ) {
            return false;
        }

        if (
            selectedFilters.manufacturer &&
            selectedFilters.manufacturer !== '' &&
            !product.manufacturer.toLowerCase().includes(selectedFilters.manufacturer.toLowerCase())
        ) {
            return false;
        }

        return true;
    }

    const filteredFavouriteProducts = favoriteProducts?.filter(
        (product) => product.isFavourite && matchesSelectedFilters(product)
    );
    const filteredRecentProducts = recentProducts?.filter((product: ShoeProduct) => matchesSelectedFilters(product));
    const filteredAllProducts = allProducts.filter((product: ShoeProduct) => matchesSelectedFilters(product));

    const { mutate: saveFavorite } = useSaveFavoriteStyle(favProduct);

    function toggleFavorite(id: string) {
        const product = shoeStyles?.find((p: any) => p.id === id);
        if (!product) return;

        product.isFavourite = !product.isFavourite;
        setFavProduct(product);

        if (product.isFavourite) {
            filteredFavouriteProducts.push(product);
        } else {
            const index = filteredFavouriteProducts.indexOf(product);
            if (index >= 0) filteredFavouriteProducts.splice(index, 1);
        }

        saveFavorite();
    }

    async function onSelect(product: ShoeProduct) {
        try {
            setSelectedProduct(product);
            const data = await fetchShoeProductDetails(product.id, product.manufacturer, product.gender);
            debugger;
            // Get latest Toe Filler
            const doshoe = await fetchToeFiller(Number(context.doId));
            const latestToeFillerId = Number(doshoe.toeFiller);

            setToeFillerId(latestToeFillerId);

            const sizes: SizeOption[] = [
                ...new Map(data.map((item) => [item.sizeId, { id: item.sizeId, size: item.size }])).values(),
            ];
            const widths: WidthOption[] = [
                ...new Map(data.map((item) => [item.widthId, { id: item.widthId, width: item.widthName }])).values(),
            ];
            const colors = [
                ...new Map(
                    data.map((item) => [
                        item.color,
                        {
                            id: item.color,
                            label: item.color,
                            image: item.image,
                            swatch: swatchForColor(item.color),
                        },
                    ])
                ).values(),
            ];

            setFulfillmentSizes(sizes);
            setFulfillmentWidths(widths);
            setOrderData((prev) => ({
                ...prev,
                product,
                color: colors[0]?.label ?? product.color ?? '',
                size: sizes[0]?.size ?? '',
                width: widths[0]?.width ?? '',
                modifications: prev.modifications ?? {},
                additionalModifications: prev.additionalModifications ?? {},
                addModifications: false,
            }));
            setProductView('fulfillment');
        } catch (error) {
            console.error('Error loading shoe fulfillment options:', error);
        }
    }

    function onDetails(product: ShoeProduct) {
        setSelectedProduct(product);
        setOrderData((prev) => ({
            ...prev,
            product,
            size: '',
            width: '',
            color: '',
            isSplitSize: false,
            rightFootSize: '',
            leftFootSize: '',
            rightFootWidth: '',
            leftFootWidth: '',
            rightPartialToeFiller: [],
            leftPartialToeFiller: [],
            modifications: prev.modifications ?? {},
            additionalModifications: prev.additionalModifications ?? {},
            addModifications: false,
            trackingNumber: '',
        }));
        setFulfillmentSizes([]);
        setFulfillmentWidths([]);
        setProductView('details');
    }

    function onBack() {
        setSelectedProduct(null);
        setProductView('details');
    }

    return (
        <main className="shoe-prototype">
            <section
                className={`order-modal ${selectedProduct ? 'product-detail-modal' : ''}`}
                aria-labelledby="order-modal-title"
            >
                <button className="modal-close" type="button" aria-label="Close modal" onClick={onClose}>
                    <X size={22} aria-hidden="true" />
                </button>

                <header className="modal-task-header">
                    <div className="modal-task-heading">
                        <h2 id="order-modal-title">
                            {selectedProduct
                                ? productView === 'fulfillment'
                                    ? 'Fulfillment Options'
                                    : 'Product Details'
                                : 'Order Shoes'}
                        </h2>
                        <PatientModalMeta context={context} />
                    </div>
                </header>

                {selectedProduct ? (
                    productView === 'fulfillment' ? (
                        <ProductFulfillment
                            product={selectedProduct}
                            sizes={fulfillmentSizes}
                            widths={fulfillmentWidths}
                            orderData={orderData}
                            setOrderData={setOrderData}
                            patientMeta={context}
                            toeFillerId={toeFillerId}
                            user={user}
                            configuration={productConfiguration}
                            configurationLoading={isConfigurationLoading}
                            configurationError={isConfigurationError}
                            onBack={() => setProductView('details')}
                            onClose={onClose}

                        />
                    ) : (
                        <ProductDetail
                            key={selectedProduct.id}
                            product={selectedProduct}
                            orderData={orderData}
                            setOrderData={setOrderData}
                            onBack={onBack}
                            onDetails={(sizes, widths) => {
                                setFulfillmentSizes(sizes);
                                setFulfillmentWidths(widths);
                                setProductView('fulfillment');
                            }}
                        />
                    )
                ) : isLoading ? (
                    <div className="order-catalog-state" role="status">
                        <LoaderCircle className="order-catalog-spinner" aria-hidden="true" />
                        <p>Loading shoe catalog…</p>
                    </div>
                ) : isError ? (
                    <div className="order-catalog-state" role="alert">
                        <p>The shoe catalog could not be loaded.</p>
                        <button onClick={() => allResult.refetch()} type="button">
                            Try again
                        </button>
                    </div>
                ) : (
                    <>
                        <aside className="modal-filters" aria-label="Shoe filters">
                            <h3>Filters</h3>
                            <label className="shoe-search">
                                <Search size={16} aria-hidden="true" />
                                <span className="sr-only">Search shoes</span>
                                <input
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                    placeholder="Search"
                                    value={searchTerm}
                                />
                            </label>

                            {filters.map((filter) => (
                                <label className="filter-select" key={filter.id}>
                                    <span className="sr-only">{filter.label}</span>
                                    <select
                                        aria-label={filter.label}
                                        value={selectedFilters[filter.id]}
                                        onChange={(event) =>
                                            setSelectedFilters((currentFilters) => ({
                                                ...currentFilters,
                                                [filter.id]: event.target.value,
                                            }))
                                        }
                                    >
                                        <option value="">{filter.label}</option>
                                        {filter.options.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown size={19} aria-hidden="true" />
                                </label>
                            ))}
                        </aside>

                        <div className="modal-results">
                            {favoriteProducts.length > 0 && (
                                <ShoeSection title="Your Favorites">
                                    {filteredFavouriteProducts.map((product) => (
                                        <ShoeCard
                                            favorite={product.isFavourite}
                                            key={product.id}
                                            onToggleFavorite={() => toggleFavorite(product.id)}
                                            onDetails={() => onDetails(product)}
                                            onSelect={() => onSelect(product)}
                                            product={product}
                                        />
                                    ))}
                                </ShoeSection>
                            )}

                            {filteredRecentProducts.length > 0 && (
                                <ShoeSection title="Recent Orders">
                                    {filteredRecentProducts.map((product: ShoeProduct) => (
                                        <ShoeCard
                                            favorite={product.isFavourite}
                                            key={product.id}
                                            onToggleFavorite={() => toggleFavorite(product.id)}
                                            onDetails={() => onDetails(product)}
                                            onSelect={() => onSelect(product)}
                                            product={product}
                                        />
                                    ))}
                                </ShoeSection>
                            )}

                            <ShoeSection title="All Shoes">
                                {filteredAllProducts.map((product: ShoeProduct) => (
                                    <ShoeCard
                                        favorite={product.isFavourite}
                                        key={product.id}
                                        onToggleFavorite={() => toggleFavorite(product.id)}
                                        onDetails={() => onDetails(product)}
                                        onSelect={() => onSelect(product)}
                                        product={product}
                                    />
                                ))}
                            </ShoeSection>
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}