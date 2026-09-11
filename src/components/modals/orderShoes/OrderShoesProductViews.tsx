import { useEffect, useState } from 'react';
import type { CSSProperties, ChangeEvent } from 'react';
import { ChevronDown, Check, Trash2 } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import type { ShoeProduct, ModificationData } from '../../../features/common/types/shoeStyle.types';
import type {
    ProductConfigurationResponse,
    ShoeOrderRequest,
} from '../../../features/common/types/productConfiguration.types';
import type { WorkflowContext } from '../../../types/workflow';
import {
    fetchShoeProductDetails,
    saveShoeRequest,
} from '../../../features/common/api/shoeStyle.service';

import type {
    UserAccount,
    SaveShoeRequestDto,
    SizeOption,
    WidthOption,
    ShoeOrderFormData,
} from '../../../features/common/types/orderShoes.types';
import { toeDigits } from '../../../features/common/hooks/orderShoes.constants';
import {
    swatchForColor,
    checkColorForSwatch,
    buildConfigurationsPayload,
    makeFieldUpdater,
} from '../../../features/common/hooks/orderShoes.utils';
import {
    ShoeImage,
    FulfillmentCheckbox,
    OrderSubmitting,
    NoScanOptions,
} from './OrderShoesSubcomponents';
import { ModificationDetails } from './OrderShoesModificationViews';

export function OrderConfirmation({
    onBack,
    onClose,
    orderData,
    patientMeta,
    user,
    configuration,
}: {
    onBack: () => void;
    onClose: () => void;
    orderData: Partial<ShoeOrderFormData>;
    patientMeta: WorkflowContext;
    user?: UserAccount;
    configuration?: ProductConfigurationResponse;
}) {
    const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
    const [scanCheckElapsed, setScanCheckElapsed] = useState(false);
    const product = orderData.product;

    const [additionalModifications, setAdditionalModifications] = useState<ModificationData>(
        orderData.additionalModifications ?? {},
    );

    const confirmationModifications = Object.entries(additionalModifications).map(
        ([title, values]) => ({
            title,
            details: values.join(', '),
        }),
    );

    useEffect(() => {
        if (!isSubmittingOrder) return;
        const timer = window.setTimeout(() => setScanCheckElapsed(true), 2000);
        return () => window.clearTimeout(timer);
    }, [isSubmittingOrder]);

    if (!product) return null;

    const colorOptions = product.colorVariants || [
        {
            id: product.color ? product.color.toLowerCase().replace(/\s+/g, '-') : '',
            label: product.color ?? '',
            image: product.image,
            swatch: swatchForColor(product.color ?? ''),
        },
    ];

    const selectedColor = colorOptions[0];

    const handleSubmitOrder = async (trackingNumber: string) => {
        debugger;

        const doId = Number(patientMeta.doId ?? 0);
        const personId = Number(patientMeta.personId ?? 0);
        const styleId = Number(product.id ?? 0);
        const productId = 1;
        const requestId = Number(patientMeta.requestId ?? patientMeta.doId ?? 0);
        const dealerId = Number(orderData.dealerId ?? 0);

        const sizeId = Number(orderData.sizeId ?? 0);
        const widthId = Number(orderData.widthId ?? 0);

        const selectedSize = orderData.size;
        const selectedWidth = orderData.width;

        if (!doId || !personId || !styleId || !sizeId || !widthId || !dealerId) {
            console.error('Missing required shoe information.', {
                doId,
                personId,
                styleId,
                productId,
                sizeId,
                widthId,
                dealerId,
            });
            return;
        }
        const configurations = buildConfigurationsPayload(
            configuration,
            orderData.modifications ?? {},
            additionalModifications,
        );
        const request: ShoeOrderRequest = {
            doId,
            dealerId,
            secondDealerId: 0,
            personId,
            statusNo: 0,

            isFittingAppointment: false,
            autoSend: false,

            productId,

            isOnHold: false,
            isEmailSent: false,

            physicianId: 0,

            isOneTimeReorder: false,
            isIncomplete: false,

            expiryDate: new Date().toISOString(),

            requiresPriorAuth: false,
            isDeductible: false,
            priorAuthType: 0,

            isDoFilledByFitter: false,
            cbaGroupId: 0,
            previousStatusNo: 0,

            isRxonly: false,
            isMedicalRecordsIncluded: false,
            isClaimProcessVerified: false,

            isRevise: false,

            doPriorAuthType: 0,

            patientAdvocate: 0,
            educatorId: 0,

            isExamining: false,

            requestId,
            isDpmClient: true,
            is3DScan: false,
            isReturned:false,

            // --------------------------------
            // Doshoe
            // --------------------------------
            doShoesDetails: {
                doId,
                ToeFiller: 0,
            },

            // --------------------------------
            // Product Style
            // --------------------------------
            shoeStyles: {
                productStyleId: Number(product.id),
                color: product.color,
                gender: product.gender,
                genderId: product.gender == "Male" ? 800 : 801,
                image: product.image,
                styleName: product.stylename,
                description: product.description,

            },

            // --------------------------------
            // Product Request
            // --------------------------------
            subProducts: {
                RequestId: requestId,
                OrderId: 0,
                DoId: doId,
                PersonId: personId,
                StatusNo: 0,
                ProductId: productId,

                requestedShoes: {
                    ProductrequestId: requestId,

                    StyleId: styleId,
                    SizeId: sizeId,
                    WidthId: widthId,

                    Insoles: 0,
                    BulkShipmentNo: 0,
                    ToeFiller: 0,
                    DealerId: dealerId,
                    Rating: 0,

                    WidthText: selectedWidth ?? null,
                    SizeText: selectedSize ?? null,
                },
            },

            // --------------------------------
            // Product Request Shoes
            // --------------------------------
            requestShoes: {
                ProductrequestId: requestId,

                StyleId: styleId,
                SizeId: sizeId,
                WidthId: widthId,

                Insoles: 0,
                BulkShipmentNo: 0,
                ToeFiller: 0,
                DealerId: dealerId,
                Rating: 0,

                WidthText: selectedWidth ?? null,
                SizeText: selectedSize ?? null,
            },

            configurations,

            ...(trackingNumber.trim()
                ? {
                      tracking_Number: trackingNumber.trim(),
                  }
                : {}),
        };

        const fallbackUser: UserAccount = {
            userPasswordId: 0,
            personId,
            personRoleId: [],
            orgId: 0,
            physicianId: 0,
            practiceId: 0,
            locationId: 0,
            Person: {},
        };

        try {
            const payload: SaveShoeRequestDto = {
                request,
                user: user ?? fallbackUser,
            };

            console.log('Shoe order payload:', request);

            await saveShoeRequest(payload);
            onClose();
        } catch (error: any) {
            console.error('Error saving product configuration:', error);
        }
    };

    if (isSubmittingOrder) {
        return scanCheckElapsed ? (
            <NoScanOptions onSubmit={handleSubmitOrder} onClose={onClose} />
        ) : (
            <OrderSubmitting />
        );
    }

    return (
        <div
            className="modal-product-detail confirmation-detail"
            aria-labelledby="confirmation-title"
        >
            <button className="back-to-modal" onClick={onBack} type="button">
                <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
                Back to fulfillment
            </button>
            <div className="product-hero confirmation-hero">
                <div className="product-image-panel">
                    <ShoeImage
                        image={product.image}
                        sourceUrl={product.sourceUrl}
                        alt={product.title ?? ''}
                    />
                </div>
                <section className="product-summary confirmation-summary">
                    <p className="product-kicker">Order Confirmation</p>
                    <h3 id="confirmation-title">{product.title}</h3>
                    <p className="product-description">
                        Review the selected shoe and requested modifications before placing the
                        patient order.
                    </p>
                    <dl className="product-facts">
                        <div>
                            <dt>Model</dt>
                            <dd>{product.sku}</dd>
                        </div>
                        <div>
                            <dt>Color</dt>
                            <dd>{selectedColor?.label}</dd>
                        </div>
                        <div>
                            <dt>Size / Width</dt>
                            <dd>
                                {orderData.isSplitSize
                                    ? `${orderData.rightFootSize ?? ''} / ${orderData.rightFootWidth ?? ''} - ${orderData.leftFootSize ?? ''} / ${orderData.leftFootWidth ?? ''}`
                                    : `${orderData.size ?? ''} / ${orderData.width ?? ''}`}
                            </dd>
                        </div>
                    </dl>
                    <section
                        className="confirmation-modifications"
                        aria-labelledby="confirmation-modifications-title"
                    >
                        <h4 id="confirmation-modifications-title">Additional Modifications</h4>
                        <div className="confirmation-modification-list">
                            {confirmationModifications.map((modification) => (
                                <article
                                    className="confirmation-modification-card"
                                    key={modification.title}
                                >
                                    <div>
                                        <strong>{modification.title}</strong>
                                        <span>{modification.details}</span>
                                    </div>
                                    <button
                                        type="button"
                                        aria-label={`Remove ${modification.title}`}
                                        onClick={() => {
                                            setAdditionalModifications((current) => {
                                                const updated = { ...current };
                                                delete updated[modification.title];
                                                return updated;
                                            });
                                        }}
                                    >
                                        <Trash2 size={18} aria-hidden="true" />
                                    </button>
                                </article>
                            ))}
                        </div>
                    </section>
                </section>
            </div>
            <footer className="confirmation-footer">
                <button
                    className="fulfillment-submit"
                    onClick={() => setIsSubmittingOrder(true)}
                    type="button"
                >
                    Place Order
                </button>
            </footer>
        </div>
    );
}

export function ProductDetail({
   
    product,
    onBack,
    onDetails,
    orderData,
    setOrderData,
}: {
    product: ShoeProduct;
    onBack: () => void;
    onDetails: (sizes: SizeOption[], widths: WidthOption[]) => void;
    orderData: Partial<ShoeOrderFormData>;
    setOrderData: React.Dispatch<React.SetStateAction<Partial<ShoeOrderFormData>>>;
    }) {
    debugger;

    const [colorOptions, setColorOptions] = useState<
        { id: string; label: string; image: string; swatch: string }[]
    >([]);
    const [sizes, setSizes] = useState<SizeOption[]>([]);
    const [widths, setWidths] = useState<WidthOption[]>([]);
    const [selectedColorId, setSelectedColorId] = useState('');
    const [loadingOptions, setLoadingOptions] = useState(true);

    useEffect(() => {
        if (!product?.id) return;
        const getProductOptions = async () => {
            try {
                setLoadingOptions(true);
                const data = await fetchShoeProductDetails(
                    product.id,
                    product.manufacturer,
                    product.gender,
                );
                const dealerId = data[0]?.dealerId;
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
                        ]),
                    ).values(),
                ];
                const sizes = [
                    ...new Map(
                        data.map((item) => [item.sizeId, { id: item.sizeId, size: item.size }]),
                    ).values(),
                ];
                const widths = [
                    ...new Map(
                        data.map((item) => [
                            item.widthId,
                            { id: item.widthId, width: item.widthName },
                        ]),
                    ).values(),
                ];

                setColorOptions(colors);
                setSizes(sizes);
                setWidths(widths);

                const defaultColor = colors[0];
                const defaultSizeId = sizes[0]?.id;
                const defaultWidthId = widths[0]?.id;

                setSelectedColorId(colors[0]?.id ?? '');

                setOrderData((prev) => ({
                    ...prev,
                    color: defaultColor?.label ?? '',
                    sizeId: defaultSizeId,
                    widthId: defaultWidthId,
                    dealerId,
                }));

                // const defaultColor = colors[0];
                // const defaultSize = sizes[0]?.size ?? '';
                // const defaultWidth = widths[0]?.width ?? '';

                // setSelectedColorId(colors[0]?.id ?? '');
                // setOrderData((prev) => ({
                //     ...prev,
                //     color: defaultColor?.label ?? '',
                //     size: defaultSize,
                //     width: defaultWidth,
                // }));
            } catch (error) {
                console.error('Error loading product options:', error);
            } finally {
                setLoadingOptions(false);
            }
        };
        getProductOptions();
    }, [product.id, product.manufacturer, product.gender, setOrderData]);

    const selectedColor =
        colorOptions.find((color) => color.id === selectedColorId) ?? colorOptions[0];

    if (loadingOptions) {
        return (
            <div className="modal-product-detail">
                <div>Loading product options...</div>
            </div>
        );
    }

    if (!selectedColor) {
        return (
            <div className="modal-product-detail">
                <div>Unable to load product colors.</div>
            </div>
        );
    }

    return (
        <div className="modal-product-detail" aria-labelledby="product-title">
            <button className="back-to-modal" onClick={onBack} type="button">
                <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
                Back to catalog
            </button>
            <div className="product-hero">
                <div className="product-image-panel">
                    <ShoeImage
                        image={selectedColor.image}
                        sourceUrl={product.sourceUrl}
                        alt={`${product.title} in ${selectedColor.label}`}
                    />
                </div>
                <section className="product-summary">
                    <p className="product-kicker">Diabetic Shoes / {product.gender}</p>
                    <h3 id="product-title">{product.title}</h3>
                    <p className="product-description">
                        Select this shoe for a patient order, review available fitting options, and
                        continue to fulfillment.
                    </p>
                    <dl className="product-facts">
                        <div>
                            <dt>Model</dt>
                            <dd>{product.sku}</dd>
                        </div>
                        <div>
                            <dt>Color</dt>
                            <dd>{selectedColor.label}</dd>
                        </div>
                        <div>
                            <dt>Category</dt>
                            <dd>{product.gender}</dd>
                        </div>
                    </dl>
                    <div className="product-options-panel">
                        <div className="product-choice-group">
                            <h4>
                                Color <span>{selectedColor.label}</span>
                            </h4>
                            <div className="color-swatches" aria-label="Color options">
                                {colorOptions.map((color) => (
                                    <button
                                        className={`color-swatch ${selectedColor?.id === color.id ? 'active' : ''}`}
                                        style={
                                            {
                                                '--check-color': checkColorForSwatch(color.swatch),
                                                '--swatch-color': color.swatch,
                                            } as CSSProperties
                                        }
                                        type="button"
                                        aria-label={`${color.label}${selectedColor?.id === color.id ? ' selected' : ''}`}
                                        aria-pressed={selectedColor?.id === color.id}
                                        key={color.id}
                                        onClick={() => {
                                            setSelectedColorId(color.id);
                                            setOrderData((prev) => ({
                                                ...prev,
                                                color: color.label,
                                            }));
                                        }}
                                    >
                                        {selectedColor?.id === color.id ? (
                                            <Check size={21} strokeWidth={3.2} aria-hidden="true" />
                                        ) : null}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="product-choice-group">
                            <h4>Size</h4>
                            <div className="size-options" aria-label="Size options">
                                {sizes.map((size) => (
                                    <button
                                        className={orderData.size === size.size ? 'active' : ''}
                                        type="button"
                                        key={size.id}
                                        onClick={() =>
                                            setOrderData((prev) => ({ ...prev, size: size.size }))
                                        }
                                    >
                                        {size.size}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="product-choice-group">
                            <h4>Width</h4>
                            <div className="width-options" aria-label="Width options">
                                {widths.map((width) => (
                                    <button
                                        className={orderData.width === width.width ? 'active' : ''}
                                        type="button"
                                        key={width.id}
                                        onClick={() =>
                                            setOrderData((prev) => ({
                                                ...prev,
                                                width: width.width,
                                            }))
                                        }
                                    >
                                        {width.width}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="product-actions">
                            <button
                                className="primary-action"
                                onClick={() => onDetails(sizes, widths)}
                            >
                                Select
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

function SelectField({
    label,
    value,
    options,
    onChange,
    optionKey,
    ariaLabel,
}: {
    label: string;
    value: string;
    options: Array<{ id: number; [key: string]: any }>;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    optionKey: string;
    ariaLabel: string;
}) {
    debugger;
    return (
        <label className="fulfillment-select">
            <span className="sr-only">{ariaLabel}</span>

            <select aria-label={ariaLabel} value={value} onChange={onChange}>
                <option value="">{label}</option>

                {options.map((item) => (
                    <option key={item.id} value={String(item.id)}>
                        {item[optionKey]}
                    </option>
                ))}
            </select>

            <ChevronDown size={20} aria-hidden="true" />
        </label>
    );
}

export function ProductFulfillment({
    product,
    onBack,
    onClose,
    sizes,
    widths,
    orderData,
    setOrderData,
    patientMeta,
    toeFillerId,
    user,
    configuration,
    configurationLoading,
    configurationError,
}: {
    product: ShoeProduct;
    onBack: () => void;
    onClose: () => void;
    sizes: SizeOption[];
    widths: WidthOption[];
    orderData: Partial<ShoeOrderFormData>;
    setOrderData: React.Dispatch<React.SetStateAction<Partial<ShoeOrderFormData>>>;
        patientMeta: WorkflowContext;
        toeFillerId: number | null;
    user?: UserAccount;
    configuration?: ProductConfigurationResponse;
    configurationLoading: boolean;
    configurationError: boolean;
}) {
    const colorOptions =
        product.colorVariants && product.colorVariants.length > 0
            ? product.colorVariants
            : [
                  {
                      id: product.color ? product.color.toLowerCase().replace(/\s+/g, '-') : '',
                      label: product.color ?? '',
                      image: product.image,
                      swatch: swatchForColor(product.color ?? ''),
                  },
              ];

    const selectedColor =
        colorOptions.find((color) => color.label === orderData.color) ?? colorOptions[0];
    const splitSizes = orderData.isSplitSize ?? false;

    

    const showRightToeFiller =
        toeFillerId === 883 || toeFillerId === 894;
    const showLeftToeFiller =
        toeFillerId === 883 || toeFillerId === 893;
    const showToeFiller =
        toeFillerId !== 892;
    const [showModifications, setShowModifications] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handlePartialToeFiller = (side: 'right' | 'left', digit: string, checked: boolean) => {
        setOrderData((prev) => {
            const currentValues =
                side === 'right'
                    ? (prev.rightPartialToeFiller ?? [])
                    : (prev.leftPartialToeFiller ?? []);
            const updatedValues = checked
                ? Array.from(new Set([...currentValues, digit]))
                : currentValues.filter((item) => item !== digit);

            return {
                ...prev,
                ...(side === 'right'
                    ? { rightPartialToeFiller: updatedValues }
                    : { leftPartialToeFiller: updatedValues }),
            };
        });
    };

    const updateOrder = makeFieldUpdater<ShoeOrderFormData>(setOrderData);

    if (showConfirmation) {
        return (
            <OrderConfirmation
                onBack={() => {
                    setShowConfirmation(false);
                    setShowModifications(orderData.addModifications ?? false);
                }}
                onClose={onClose}
                orderData={orderData}
                patientMeta={patientMeta}
                user={user}
                configuration={configuration}
            />
        );
    }

    if (showModifications) {
        return (
            <ModificationDetails
                selectedModifications={orderData.modifications ?? {}}
                selectedAdditionalModifications={orderData.additionalModifications ?? {}}
                configuration={configuration}
                configurationLoading={configurationLoading}
                configurationError={configurationError}
                onBack={() => setShowModifications(false)}
                onContinue={(modifications, additionalModifications) => {
                    setOrderData((prev) => ({ ...prev, modifications, additionalModifications }));
                    setShowModifications(false);
                    setShowConfirmation(true);
                }}
            />
        );
    }

    return (
        <div className="modal-product-detail fulfillment-detail" aria-labelledby="product-title">
            <button className="back-to-modal" onClick={onBack} type="button">
                <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
                Back to details
            </button>
            <div className="product-hero">
                <div className="product-image-panel">
                    <ShoeImage
                        image={selectedColor?.image}
                        sourceUrl={product.sourceUrl}
                        alt={`${product.title} in ${selectedColor?.label ?? ''}`}
                    />
                </div>
                <section className="product-summary">
                    <p className="product-kicker">Fulfillment / {product.gender}</p>
                    <h3 id="product-title">{product.title}</h3>
                    <p className="product-description">
                        Confirm fitting details and additional fulfillment information before
                        completing this shoe selection.
                    </p>
                    <dl className="product-facts">
                        <div>
                            <dt>Model</dt>
                            <dd>{product.sku}</dd>
                        </div>
                        <div>
                            <dt>Color</dt>
                            <dd>{selectedColor?.label}</dd>
                        </div>
                        <div>
                            <dt>Category</dt>
                            <dd>{product.gender}</dd>
                        </div>
                    </dl>
                    <div className="fulfillment-options-panel">
                        <h4>Additional Information</h4>
                        <label className="split-size-option">
                            <input
                                type="checkbox"
                                checked={splitSizes}
                                onChange={(e) => updateOrder('isSplitSize', e.target.checked)}
                            />
                            <span className="fulfillment-check-box" aria-hidden="true">
                                <Check size={20} strokeWidth={3.3} />
                            </span>
                            <span>I need split sizes</span>
                        </label>

                        {splitSizes ? (
                            <div className="split-size-fields">
                                <section aria-labelledby="right-foot-heading">
                                    <h5 id="right-foot-heading">Right Foot</h5>
                                    <SelectField
                                        label="Select Shoe Size"
                                        ariaLabel="Select Right Shoe Size"
                                        value={orderData.rightFootSize ?? ''}
                                        options={sizes}
                                        optionKey="size"
                                        onChange={(e) =>
                                            updateOrder('rightFootSize', e.target.value)
                                        }
                                    />
                                    <SelectField
                                        label="Select Shoe Width"
                                        ariaLabel="Select Right Shoe Width"
                                        value={orderData.rightFootWidth ?? ''}
                                        options={widths}
                                        optionKey="width"
                                        onChange={(e) =>
                                            updateOrder('rightFootWidth', e.target.value)
                                        }
                                    />
                                </section>
                                <section aria-labelledby="left-foot-heading">
                                    <h5 id="left-foot-heading">Left Foot</h5>
                                    <SelectField
                                        label="Select Shoe Size"
                                        ariaLabel="Select Left Shoe Size"
                                        value={orderData.leftFootSize ?? ''}
                                        options={sizes}
                                        optionKey="size"
                                        onChange={(e) =>
                                            updateOrder('leftFootSize', e.target.value)
                                        }
                                    />
                                    <SelectField
                                        label="Select Shoe Width"
                                        ariaLabel="Select Left Shoe Width"
                                        value={orderData.leftFootWidth ?? ''}
                                        options={widths}
                                        optionKey="width"
                                        onChange={(e) =>
                                            updateOrder('leftFootWidth', e.target.value)
                                        }
                                    />
                                </section>
                            </div>
                        ) : (
                            <>
                                <SelectField
                                    label="Select Shoe Size"
                                    ariaLabel="Select Shoe Size"
                                    value={String(orderData.sizeId ?? '')}
                                    options={sizes}
                                    optionKey="size"
                                    onChange={(e) => updateOrder('sizeId', Number(e.target.value))}
                                />
                                <SelectField
                                    label="Select Shoe Width"
                                    ariaLabel="Select Shoe Width"
                                    value={String(orderData.widthId ?? '')}
                                    options={widths}
                                    optionKey="width"
                                    onChange={(e) => updateOrder('widthId', Number(e.target.value))}
                                />
                            </>
                        )}

                        {showToeFiller && (
                            <fieldset className="toe-filler-options">
                                <legend>Partial Toe Filler</legend>
                                <p>Identify All Missing Digits</p>

                                {/* RIGHT */}
                                {showRightToeFiller && (
                                    <div className="toe-filler-row">
                                        <span>Right</span>

                                        {toeDigits.map((digit) => (
                                            <FulfillmentCheckbox
                                                key={`right-${digit}`}
                                                label={digit}
                                                checked={(orderData.rightPartialToeFiller ?? []).includes(
                                                    digit
                                                )}
                                                onChange={(event) =>
                                                    handlePartialToeFiller(
                                                        'right',
                                                        digit,
                                                        event.target.checked
                                                    )
                                                }
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* LEFT */}
                                {showLeftToeFiller && (
                                    <div className="toe-filler-row">
                                        <span>Left</span>

                                        {toeDigits.map((digit) => (
                                            <FulfillmentCheckbox
                                                key={`left-${digit}`}
                                                label={digit}
                                                checked={(orderData.leftPartialToeFiller ?? []).includes(
                                                    digit
                                                )}
                                                onChange={(event) =>
                                                    handlePartialToeFiller(
                                                        'left',
                                                        digit,
                                                        event.target.checked
                                                    )
                                                }
                                            />
                                        ))}
                                    </div>
                                )}
                            </fieldset>
                        )}
                    </div>
                </section>
            </div>
            <footer className="fulfillment-footer">
                <label className="fulfillment-modification-check">
                    <input
                        checked={orderData.addModifications ?? false}
                        onChange={(e) => updateOrder('addModifications', e.target.checked)}
                        type="checkbox"
                    />
                    <span className="fulfillment-check-box" aria-hidden="true">
                        <Check size={18} strokeWidth={3.3} />
                    </span>
                    <span>Add Modifications</span>
                </label>
                <button
                    className="fulfillment-submit"
                    onClick={() => {
                        if (orderData.addModifications) setShowModifications(true);
                        else setShowConfirmation(true);
                    }}
                    type="button"
                >
                    Complete Selection
                </button>
            </footer>
        </div>
    );
}
