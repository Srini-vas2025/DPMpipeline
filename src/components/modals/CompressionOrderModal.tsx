import { useEffect, useState } from 'react';
import '../../styles/modalcard.css';

type Props = {
    patientName: string;
    onClose: () => void;
};

type ProductCode = 'A6530' | 'A6583';

type Product = {
    id: string;
    code: ProductCode;
    title: string;
    brand: string;
    variant: string;
    image: string;
};

export default function CompressionOrderModal({ patientName, onClose }: Props) {
    // flow state
    const [step, setStep] = useState(1);
    const [activeProduct, setActiveProduct] = useState<Product | null>(null);

    // filter state
    const [filters, setFilters] = useState<Record<ProductCode, boolean>>({
        A6530: true,
        A6583: true,
    });

    // selected products
    const [selectedProducts, setSelectedProducts] = useState<Record<ProductCode, boolean>>({
        A6530: false,
        A6583: false,
    });

    // product data
    const productGroups: Record<ProductCode, Product[]> = {
        A6530: [
            {
                id: 'A6530-1',
                code: 'A6530',
                title: 'Compreflex Standard Knee',
                brand: 'Sigvaris',
                variant: '1 variant',
                image: '/src/assets/images/compression-standard-knee.jpg',
            },
            {
                id: 'A6530-2',
                code: 'A6530',
                title: 'Compreflex Standard Knee',
                brand: 'Sigvaris',
                variant: '1 variant',
                image: '/src/assets/images/compression-standard-knee.jpg',
            },
            {
                id: 'A6530-3',
                code: 'A6530',
                title: 'Compreflex Standard Knee',
                brand: 'Sigvaris',
                variant: '1 variant',
                image: '/src/assets/images/compression-standard-knee.jpg',
            },
            {
                id: 'A6530-4',
                code: 'A6530',
                title: 'Compreflex Standard Knee',
                brand: 'Sigvaris',
                variant: '1 variant',
                image: '/src/assets/images/compression-standard-knee.jpg',
            },
        ],
        A6583: [
            {
                id: 'A6583-1',
                code: 'A6583',
                title: 'Compreflex Standard Knee',
                brand: 'Sigvaris',
                variant: '1 variant',
                image: '/src/assets/images/compression-foot-strap.jpg',
            },
            {
                id: 'A6583-2',
                code: 'A6583',
                title: 'Compreflex Standard Knee',
                brand: 'Sigvaris',
                variant: '1 variant',
                image: '/src/assets/images/compression-foot-strap.jpg',
            },
            {
                id: 'A6583-3',
                code: 'A6583',
                title: 'Compreflex Standard Knee',
                brand: 'Sigvaris',
                variant: '1 variant',
                image: '/src/assets/images/compression-foot-strap.jpg',
            },
            {
                id: 'A6583-4',
                code: 'A6583',
                title: 'Compreflex Standard Knee',
                brand: 'Sigvaris',
                variant: '1 variant',
                image: '/src/assets/images/compression-foot-strap.jpg',
            },
        ],
    };

    // order validation
    const canContinueOrder = selectedProducts.A6530 && selectedProducts.A6583;

    // loader timer
    useEffect(() => {
        if (step !== 6) return;

        const timer = setTimeout(() => {
            setStep(7);
        }, 3000);

        return () => clearTimeout(timer);
    }, [step]);

    // back action
    const goBack = () => {
        if (step === 4) {
            setStep(3);
            setActiveProduct(null);
            return;
        }

        if (step > 1) {
            setStep(step - 1);
        }
    };

    // update filter
    const toggleFilter = (code: ProductCode) => {
        setFilters((prev) => ({
            ...prev,
            [code]: !prev[code],
        }));
    };

    // update product selection
    const toggleRequiredProduct = (code: ProductCode) => {
        setSelectedProducts((prev) => ({
            ...prev,
            [code]: !prev[code],
        }));
    };

    // product description
    const productDescription = (code: ProductCode) => {
        return code === 'A6530'
            ? 'Compression stocking, below knee 18-30'
            : 'Compression wrap above knee 18-30';
    };

    // visible products
    const visibleProductCodes = (Object.keys(filters) as ProductCode[]).filter(
        (code) => filters[code],
    );

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card large-modal" onClick={(e) => e.stopPropagation()}>
                {/* header */}
                <div className="modal-simple-header">
                    <div className="modal-title-group">
                        {step > 1 && step !== 7 && (
                            <button type="button" className="modal-back-btn" onClick={goBack}>
                                <i className="fa-solid fa-arrow-left"></i>
                                <span>Back</span>
                            </button>
                        )}

                        {step === 1 && <h2 className="modal-title">Order Compression</h2>}
                    </div>

                    {step !== 6 && step !== 7 && (
                        <div className="modal-header-center">
                            <div className="modal-patient-name">{patientName}</div>
                        </div>
                    )}

                    <button type="button" className="modal-close-btn" onClick={onClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                {/* products requested */}
                {step === 1 && (
                    <div className="modal-body-content">
                        <h4 className="modal-section-title">Products Requested:</h4>

                        <div className="modal-table-card">
                            <table className="modal-table">
                                <thead>
                                    <tr>
                                        <th>HCPCS</th>
                                        <th>DESCRIPTION</th>
                                        <th className="text-right">SIDE OF BODY</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>A6530</td>
                                        <td>Compression stocking, below knee 18-30</td>
                                        <td className="text-right">Left, Right</td>
                                    </tr>

                                    <tr>
                                        <td>A6530</td>
                                        <td>Compression stocking, below knee 18-30</td>
                                        <td className="text-right">Left, Right</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="modal-dashed-divider"></div>

                        <div className="modal-footer-right">
                            <button
                                type="button"
                                className="modal-submit-btn mt-2"
                                onClick={() => setStep(2)}
                            >
                                Continue to Measurements
                            </button>
                        </div>
                    </div>
                )}

                {/* measurements */}
                {step === 2 && (
                    <div className="modal-body-content">
                        <div className="measurement-layout">
                            <div>
                                <h4 className="modal-section-title">Measurement Guide</h4>

                                <div className="measurement-guide-card">
                                    <img
                                        src="/src/assets/images/compression-guide.jpg"
                                        alt="Measurement Guide"
                                        className="measurement-guide-img"
                                    />
                                </div>
                            </div>

                            <div className="measurement-form-section">
                                <h4 className="modal-section-title">
                                    Measurements Required (in centimeters)
                                </h4>

                                <div className="measurement-grid">
                                    {[
                                        'Foot',
                                        'Ankle',
                                        'Calf',
                                        'Knee',
                                        'Lower Thigh',
                                        'Upper Thigh',
                                    ].map((item) => (
                                        <div className="measure-card" key={item}>
                                            <h5>{item}</h5>

                                            <div className="measure-input-line">
                                                <input type="number" defaultValue={0} />
                                                <span>Right</span>

                                                <input type="number" defaultValue={0} />
                                                <span>Left</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <h4 className="modal-section-title measurement-subtitle">
                                    Other Measurements (in centimeters)
                                </h4>

                                <div className="measurement-grid">
                                    {['Hip', 'Below the Knee', 'Full Leg Length'].map((item) => (
                                        <div className="measure-card gray" key={item}>
                                            <h5>{item}</h5>

                                            <div className="measure-input-line">
                                                <input type="number" defaultValue={0} />
                                                <span>Right</span>

                                                <input type="number" defaultValue={0} />
                                                <span>Left</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="modal-flow-divider"></div>

                        <div className="modal-footer-right">
                            <button
                                type="button"
                                className="modal-submit-btn"
                                onClick={() => setStep(3)}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {/* product selection */}
                {step === 3 && (
                    <div className="product-flow-layout">
                        <div className="product-filter-panel">
                            <input className="product-search-input" placeholder="Search" />

                            <h5 className="product-panel-title">Filter By</h5>

                            {(Object.keys(filters) as ProductCode[]).map((code) => (
                                <label className="filter-product-item" key={code}>
                                    <span>{code}</span>

                                    <input
                                        type="checkbox"
                                        checked={filters[code]}
                                        onChange={() => toggleFilter(code)}
                                    />
                                </label>
                            ))}

                            <h5 className="product-panel-title product-required-title">
                                Products Required
                            </h5>

                            {(Object.keys(selectedProducts) as ProductCode[]).map((code) => (
                                <div className="required-product-item" key={code}>
                                    <div>
                                        <strong>{code}</strong>
                                        <p>{productDescription(code)}</p>

                                        {!selectedProducts[code] && (
                                            <span className="required-warning">
                                                Select a product
                                            </span>
                                        )}

                                        {selectedProducts[code] && (
                                            <span className="required-selected">
                                                Product selected
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        className={`required-circle ${
                                            selectedProducts[code] ? 'active' : ''
                                        }`}
                                        onClick={() => toggleRequiredProduct(code)}
                                    >
                                        {selectedProducts[code] && (
                                            <i className="fa-solid fa-check"></i>
                                        )}
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                className={`modal-submit-btn product-continue-btn ${
                                    !canContinueOrder ? 'disabled' : ''
                                }`}
                                disabled={!canContinueOrder}
                                onClick={() => setStep(5)}
                            >
                                Continue to Order
                            </button>
                        </div>

                        <div className="product-list-section">
                            <h5 className="product-list-title">All Matching Products</h5>

                            {visibleProductCodes.length === 0 && (
                                <div className="empty-products-message">
                                    Please select a product type from Filter By.
                                </div>
                            )}

                            {visibleProductCodes.map((code) => (
                                <div className="product-group" key={code}>
                                    <div className="product-card-grid">
                                        {productGroups[code].map((product) => (
                                            <button
                                                type="button"
                                                className="product-card"
                                                key={product.id}
                                                onClick={() => {
                                                    setActiveProduct(product);
                                                    setStep(4);
                                                }}
                                            >
                                                <div className="product-img-box">
                                                    <img src={product.image} alt={product.title} />
                                                </div>

                                                <span className="product-code">{product.code}</span>

                                                <h6>{product.title}</h6>

                                                <p>{product.brand}</p>

                                                <small>{product.variant}</small>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* product details */}
                {step === 4 && activeProduct && (
                    <div className="product-detail-layout">
                        <div className="product-filter-panel">
                            <input className="product-search-input" placeholder="Search" />

                            <h5 className="product-panel-title">Filter By</h5>

                            {(Object.keys(filters) as ProductCode[]).map((code) => (
                                <label className="filter-product-item" key={code}>
                                    <span>{code}</span>

                                    <input
                                        type="checkbox"
                                        checked={filters[code]}
                                        onChange={() => toggleFilter(code)}
                                    />
                                </label>
                            ))}

                            <h5 className="product-panel-title product-required-title">
                                Products Required
                            </h5>

                            {(Object.keys(selectedProducts) as ProductCode[]).map((code) => (
                                <div className="required-product-item" key={code}>
                                    <div>
                                        <strong>{code}</strong>
                                        <p>{productDescription(code)}</p>
                                    </div>

                                    <button
                                        type="button"
                                        className={`required-circle ${
                                            selectedProducts[code] ? 'active' : ''
                                        }`}
                                        onClick={() => toggleRequiredProduct(code)}
                                    >
                                        {selectedProducts[code] && (
                                            <i className="fa-solid fa-check"></i>
                                        )}
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                className={`modal-submit-btn product-continue-btn ${
                                    !canContinueOrder ? 'disabled' : ''
                                }`}
                                disabled={!canContinueOrder}
                                onClick={() => setStep(5)}
                            >
                                Continue to Order
                            </button>
                        </div>

                        <div className="product-detail-main">
                            <div className="product-detail-image-area">
                                <div className="product-detail-image-box">
                                    <img src={activeProduct.image} alt={activeProduct.title} />
                                </div>

                                <div className="product-thumbs">
                                    <img className="active" src={activeProduct.image} alt="" />
                                    <img
                                        src="/src/assets/images/compression-foot-strap.jpg"
                                        alt=""
                                    />
                                    <img
                                        src="/src/assets/images/compression-standard-knee.jpg"
                                        alt=""
                                    />
                                </div>
                            </div>

                            <div className="product-detail-info">
                                <h3>{activeProduct.title}</h3>

                                <p className="detail-brand">{activeProduct.brand}</p>

                                <div className="detail-info-boxes">
                                    <div>
                                        <span>GRIP TOP</span>
                                        <strong>NO</strong>
                                    </div>

                                    <div>
                                        <span>MATERIALS</span>
                                        <strong>Breath-O-Prene :: Non-Latex</strong>
                                    </div>

                                    <div>
                                        <span>HCPCS</span>
                                        <strong>{activeProduct.code}</strong>
                                    </div>

                                    <div>
                                        <span>UOM</span>
                                        <strong>EA</strong>
                                    </div>
                                </div>

                                <h4>FEATURES</h4>

                                <ul>
                                    <li>Overlapping band system mimics bandaging tech</li>
                                    <li>Slotted band system of the garment allows</li>
                                    <li>Back spin of the garment provides support</li>
                                    <li>Easily adjustable to allow for fluctuations</li>
                                </ul>

                                <button
                                    type="button"
                                    className={`detail-cart-btn ${
                                        selectedProducts[activeProduct.code]
                                            ? 'remove-btn'
                                            : 'add-btn'
                                    }`}
                                    onClick={() => toggleRequiredProduct(activeProduct.code)}
                                >
                                    {selectedProducts[activeProduct.code]
                                        ? 'Delete from Cart'
                                        : 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* order summary */}
                {step === 5 && (
                    <div className="modal-body-content order-summary-content">
                        <h4 className="summary-section-title">Products Selected</h4>

                        <div className="selected-products-list">
                            {(Object.keys(selectedProducts) as ProductCode[])
                                .filter((code) => selectedProducts[code])
                                .map((code) => (
                                    <div className="selected-product-card" key={code}>
                                        <img
                                            src={
                                                code === 'A6530'
                                                    ? '/src/assets/images/compression-standard-knee.jpg'
                                                    : '/src/assets/images/compression-foot-strap.jpg'
                                            }
                                            alt={code}
                                        />

                                        <div>
                                            <h5>{productDescription(code)}</h5>
                                            <p>{code}</p>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        <div className="summary-action-row">
                            <button
                                type="button"
                                className="modal-submit-btn primary-btn"
                                onClick={() => setStep(6)}
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                )}

                {/* loader */}
                {step === 6 && (
                    <div className="order-loader-screen">
                        <div className="round-loader">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}

                {/* success */}
                {step === 7 && (
                    <div className="order-success-screen">
                        <div className="success-icon">
                            <i className="fa-solid fa-check"></i>
                        </div>

                        <h3>Order Confirmed!</h3>

                        <button
                            type="button"
                            className="modal-submit-btn success-ok-btn"
                            onClick={onClose}
                        >
                            Okay
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
