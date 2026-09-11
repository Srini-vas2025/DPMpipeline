import React, { useState } from 'react';

interface ShoeProduct {
    id: string;
    title: string;
    subtitle: string;
    image: string;
}

interface ShoeOrderProps {
    patientName?: string;
    onClose?: () => void;
    onSelectShoe?: (shoe: ShoeProduct) => void;
    isModal?: boolean;
}

const FAVORITE_SHOES: ShoeProduct[] = [
    { id: '1', title: 'SPS Apis', subtitle: '#1907 | Black', image: '/assets/images/shoe-img.png' },
    { id: '2', title: 'SPS Apis', subtitle: '#1907 | Black', image: '/assets/images/shoe-img.png' },
    { id: '3', title: 'SPS Apis', subtitle: '#1907 | Black', image: '/assets/images/shoe-img.png' },
    { id: '4', title: 'SPS Apis', subtitle: '#1907 | Black', image: '/assets/images/shoe-img.png' },
    { id: '5', title: 'SPS Apis', subtitle: '#1907 | Black', image: '/assets/images/shoe-img.png' },
];

const RECENT_ORDERS: ShoeProduct[] = [
    { id: '6', title: 'SPS Apis', subtitle: '#1907 | Black', image: '/assets/images/shoe-img.png' },
    { id: '7', title: 'SPS Apis', subtitle: '#1907 | Black', image: '/assets/images/shoe-img.png' },
    { id: '8', title: 'SPS Apis', subtitle: '#1907 | Black', image: '/assets/images/shoe-img.png' },
    { id: '9', title: 'SPS Apis', subtitle: '#1907 | Black', image: '/assets/images/shoe-img.png' },
    {
        id: '10',
        title: 'SPS Apis',
        subtitle: '#1907 | Black',
        image: '/assets/images/shoe-img.png',
    },
];

const ALL_SHOES: ShoeProduct[] = [
    {
        id: '11',
        title: 'SPS Apis',
        subtitle: '#1907 | Black',
        image: '/assets/images/shoe-img.png',
    },
    {
        id: '12',
        title: 'SPS Apis',
        subtitle: '#1907 | Black',
        image: '/assets/images/shoe-img.png',
    },
    {
        id: '13',
        title: 'SPS Apis',
        subtitle: '#1907 | Black',
        image: '/assets/images/shoe-img.png',
    },
    {
        id: '14',
        title: 'SPS Apis',
        subtitle: '#1907 | Black',
        image: '/assets/images/shoe-img.png',
    },
    {
        id: '15',
        title: 'SPS Apis',
        subtitle: '#1907 | Black',
        image: '/assets/images/shoe-img.png',
    },
    {
        id: '16',
        title: 'SPS Apis',
        subtitle: '#1907 | Black',
        image: '/assets/images/shoe-img.png',
    },
    {
        id: '17',
        title: 'SPS Apis',
        subtitle: '#1907 | Black',
        image: '/assets/images/shoe-img.png',
    },
    {
        id: '18',
        title: 'SPS Apis',
        subtitle: '#1907 | Black',
        image: '/assets/images/shoe-img.png',
    },
    {
        id: '19',
        title: 'SPS Apis',
        subtitle: '#1907 | Black',
        image: '/assets/images/shoe-img.png',
    },
    {
        id: '20',
        title: 'SPS Apis',
        subtitle: '#1907 | Black',
        image: '/assets/images/shoe-img.png',
    },
];

const ShoeOrder: React.FC<ShoeOrderProps> = ({
    patientName = 'Nick Holroyd',
    onClose,
    onSelectShoe,
    isModal = false,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedManufacturer, setSelectedManufacturer] = useState('');
    const [selectedClosure, setSelectedClosure] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<ShoeProduct | null>(null);
    const [splitSize, setSplitSize] = useState(false);
    const [shoeSize, setShoeSize] = useState('');
    const [addModifications, setAddModifications] = useState(false);
    const [showModifications, setShowModifications] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmingOrder, setConfirmingOrder] = useState(false);
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [modTab, setModTab] = useState('mods');

    const handleShoeSelect = (shoe: ShoeProduct) => {
        setSelectedProduct(shoe);
    };

    const handleBackToProducts = () => {
        setSelectedProduct(null);
    };

    const handleContinue = () => {
        if (addModifications) {
            setShowModifications(true);
        } else {
            setShowConfirmation(true);
        }
    };

    const handleConfirmOrder = () => {
        setShowConfirmation(false);
        setConfirmingOrder(true);
        setTimeout(() => {
            setConfirmingOrder(false);
            setOrderConfirmed(true);
        }, 2000);
    };

    const handleOkay = () => {
        setOrderConfirmed(false);
        setSelectedProduct(null);
        setShowModifications(false);
        if (onSelectShoe && selectedProduct) {
            onSelectShoe(selectedProduct);
        }
    };

    const filteredShoes = ALL_SHOES.filter(
        (shoe) =>
            shoe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shoe.subtitle.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const ShoeCard: React.FC<{ shoe: ShoeProduct }> = ({ shoe }) => (
        <div className="order-product-card">
            <img src={shoe.image} alt={shoe.title} />
            <div className="order-product-title">{shoe.title}</div>
            <div className="order-product-subtitle">{shoe.subtitle}</div>
            <div className="order-product-select">
                <button onClick={() => handleShoeSelect(shoe)}>Select</button>
            </div>
        </div>
    );

    if (isModal) {
        return (
            <div className="order-modal">
                {/* Modal Header - Hide when product is selected */}
                {!selectedProduct && (
                    <div className="modal-main-header">
                        <div className="modal-header mb-2">
                            <div
                                className="modal-header-top"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '100%',
                                }}
                            >
                                <div className="modal-title">Order Shoes</div>
                                <i
                                    className="fa-solid fa-xmark modal-close"
                                    onClick={onClose}
                                    style={{ cursor: 'pointer' }}
                                ></i>
                            </div>
                        </div>

                        <div className="modal-header-bottom mb-4">
                            <div className="modal-left-group">
                                <div className="modal-patient-name">{patientName}</div>
                                <div className="modal-divider-v">|</div>
                                <div className="modal-progress-row">
                                    <div style={{ fontWeight: 500, color: 'var(--muted)' }}>
                                        Order Progress:
                                    </div>
                                    <div className="modal-dots">
                                        <span className="modal-dot modal-dot--active"></span>
                                        <span className="modal-dot modal-dot--active"></span>
                                        <span className="modal-dot"></span>
                                        <span className="modal-dot"></span>
                                        <span className="modal-dot"></span>
                                        <span className="modal-dot"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Content */}
                <div className="order-product-layout">
                    {selectedProduct ? (
                        // Product Details View
                        <div className="product-details-layout">
                            <div
                                className="back-link"
                                onClick={handleBackToProducts}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: 'var(--primary-color)',
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                    marginBottom: '25px',
                                }}
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                                <span>Back to Shoes</span>
                            </div>

                            <div
                                className="details-grid"
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '320px 1fr',
                                    gap: '60px',
                                    alignItems: 'flex-start',
                                }}
                            >
                                {/* Left - Product Preview */}
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: '10px' }}>
                                        Shoe
                                    </div>
                                    <div
                                        className="product-preview"
                                        style={{
                                            background: '#fff',
                                            borderRadius: '12px',
                                            padding: '20px',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <img
                                            src={selectedProduct.image}
                                            alt={selectedProduct.title}
                                            style={{ maxWidth: '180px', marginBottom: '12px' }}
                                        />
                                        <div
                                            className="product-name"
                                            style={{ fontWeight: 600, marginBottom: '4px' }}
                                        >
                                            {selectedProduct.title}
                                        </div>
                                        <div
                                            className="product-meta"
                                            style={{ color: 'var(--muted)', fontSize: '14px' }}
                                        >
                                            {selectedProduct.subtitle}
                                        </div>
                                    </div>
                                </div>

                                {/* Right - Details Form */}
                                <div className="details-form">
                                    <div style={{ fontWeight: 600, marginBottom: '10px' }}>
                                        Additional Information
                                    </div>

                                    <label
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            marginBottom: '18px',
                                            fontWeight: 500,
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={splitSize}
                                            onChange={(e) => setSplitSize(e.target.checked)}
                                        />
                                        <span>I need split sizes</span>
                                    </label>

                                    <select
                                        className="form-select"
                                        value={shoeSize}
                                        onChange={(e) => setShoeSize(e.target.value)}
                                        style={{
                                            marginBottom: '18px',
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: '1px solid var(--input-border-color)',
                                            borderRadius: '6px',
                                            fontFamily: 'var(--font-family)',
                                            fontSize: '13px',
                                        }}
                                    >
                                        <option value="">Select Shoe Size</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                        <option value="13">13</option>
                                    </select>

                                    <select
                                        className="form-select"
                                        style={{
                                            marginBottom: '18px',
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: '1px solid var(--input-border-color)',
                                            borderRadius: '6px',
                                            fontFamily: 'var(--font-family)',
                                            fontSize: '13px',
                                        }}
                                    >
                                        <option>Select Shoe Width</option>
                                        <option value="narrow">Narrow</option>
                                        <option value="regular">Regular</option>
                                        <option value="wide">Wide</option>
                                    </select>

                                    <div
                                        style={{
                                            border: '1px solid #e3e6ea',
                                            borderRadius: '10px',
                                            padding: '15px',
                                        }}
                                    >
                                        <div style={{ fontWeight: 600 }}>Partial Toe Filler</div>
                                        <div
                                            style={{
                                                fontSize: '13px',
                                                color: 'var(--muted)',
                                                marginBottom: '10px',
                                            }}
                                        >
                                            Identify All Missing Digits
                                        </div>

                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '20px',
                                                marginTop: '10px',
                                            }}
                                        >
                                            <strong>Right</strong>
                                            <div style={{ display: 'flex', gap: '14px' }}>
                                                {[1, 2, 3, 4, 5].map((digit) => (
                                                    <label
                                                        key={digit}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                        }}
                                                    >
                                                        <input type="checkbox" />
                                                        {digit}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '20px',
                                                marginTop: '10px',
                                            }}
                                        >
                                            <strong>Left</strong>
                                            <div style={{ display: 'flex', gap: '14px' }}>
                                                {[1, 2, 3, 4, 5].map((digit) => (
                                                    <label
                                                        key={digit}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                        }}
                                                    >
                                                        <input type="checkbox" />
                                                        {digit}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: '30px',
                                    paddingTop: '20px',
                                    borderTop: '1px dashed #dcdfe4',
                                }}
                            >
                                <label
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        fontWeight: 500,
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={addModifications}
                                        onChange={(e) => setAddModifications(e.target.checked)}
                                    />
                                    <span>Add Modifications</span>
                                </label>
                                <button
                                    className="modal-btn primary"
                                    onClick={handleContinue}
                                    style={{ padding: '10px 26px' }}
                                >
                                    Continue
                                </button>
                            </div>

                            {/* Split Size Layout */}
                            {splitSize && (
                                <div
                                    className="split-size-layout"
                                    style={{
                                        display: 'block',
                                        paddingTop: '20px',
                                        borderTop: '1px solid var(--card-border)',
                                    }}
                                >
                                    <div
                                        className="details-grid"
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: '320px 1fr',
                                            gap: '60px',
                                            alignItems: 'flex-start',
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: 600, marginBottom: '10px' }}>
                                                Shoe
                                            </div>
                                            <div
                                                className="product-preview"
                                                style={{
                                                    background: '#fff',
                                                    borderRadius: '12px',
                                                    padding: '20px',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <img
                                                    src={selectedProduct.image}
                                                    alt={selectedProduct.title}
                                                    style={{
                                                        maxWidth: '180px',
                                                        marginBottom: '12px',
                                                    }}
                                                />
                                                <div
                                                    className="product-name"
                                                    style={{ fontWeight: 600, marginBottom: '4px' }}
                                                >
                                                    {selectedProduct.title}
                                                </div>
                                                <div
                                                    className="product-meta"
                                                    style={{
                                                        color: 'var(--muted)',
                                                        fontSize: '14px',
                                                    }}
                                                >
                                                    {selectedProduct.subtitle}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="details-form">
                                            <div style={{ fontWeight: 600, marginBottom: '10px' }}>
                                                Additional Information
                                            </div>

                                            <select
                                                className="form-select"
                                                style={{
                                                    marginBottom: '18px',
                                                    width: '100%',
                                                    padding: '10px 12px',
                                                    border: '1px solid var(--input-border-color)',
                                                    borderRadius: '6px',
                                                    fontFamily: 'var(--font-family)',
                                                    fontSize: '13px',
                                                }}
                                            >
                                                <option>Select Left Shoe Size</option>
                                                {[5, 6, 7, 8, 9, 10, 11, 12, 13].map((size) => (
                                                    <option key={size} value={size}>
                                                        {size}
                                                    </option>
                                                ))}
                                            </select>

                                            <select
                                                className="form-select"
                                                style={{
                                                    marginBottom: '18px',
                                                    width: '100%',
                                                    padding: '10px 12px',
                                                    border: '1px solid var(--input-border-color)',
                                                    borderRadius: '6px',
                                                    fontFamily: 'var(--font-family)',
                                                    fontSize: '13px',
                                                }}
                                            >
                                                <option>Select Right Shoe Size</option>
                                                {[5, 6, 7, 8, 9, 10, 11, 12, 13].map((size) => (
                                                    <option key={size} value={size}>
                                                        {size}
                                                    </option>
                                                ))}
                                            </select>

                                            <select
                                                className="form-select"
                                                style={{
                                                    marginBottom: '18px',
                                                    width: '100%',
                                                    padding: '10px 12px',
                                                    border: '1px solid var(--input-border-color)',
                                                    borderRadius: '6px',
                                                    fontFamily: 'var(--font-family)',
                                                    fontSize: '13px',
                                                }}
                                            >
                                                <option>Select Left Shoe Width</option>
                                                <option value="narrow">Narrow</option>
                                                <option value="regular">Regular</option>
                                                <option value="wide">Wide</option>
                                            </select>

                                            <select
                                                className="form-select"
                                                style={{
                                                    marginBottom: '18px',
                                                    width: '100%',
                                                    padding: '10px 12px',
                                                    border: '1px solid var(--input-border-color)',
                                                    borderRadius: '6px',
                                                    fontFamily: 'var(--font-family)',
                                                    fontSize: '13px',
                                                }}
                                            >
                                                <option>Select Right Shoe Width</option>
                                                <option value="narrow">Narrow</option>
                                                <option value="regular">Regular</option>
                                                <option value="wide">Wide</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            marginTop: '30px',
                                            paddingTop: '20px',
                                            borderTop: '1px dashed #dcdfe4',
                                        }}
                                    >
                                        <button
                                            className="modal-btn primary"
                                            onClick={handleContinue}
                                            style={{ padding: '10px 26px' }}
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Products List View
                        <>
                            {/* Filters */}
                            <div className="order-product-filters">
                                <h4>Filters</h4>

                                <div className="order-product-filter-group">
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <div className="order-product-filter-group">
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                    >
                                        <option value="">Type</option>
                                        <option value="casual">Casual</option>
                                        <option value="formal">Formal</option>
                                    </select>
                                </div>

                                <div className="order-product-filter-group">
                                    <select
                                        value={selectedManufacturer}
                                        onChange={(e) => setSelectedManufacturer(e.target.value)}
                                    >
                                        <option value="">Manufacturer</option>
                                        <option value="sps">SPS</option>
                                        <option value="nike">Nike</option>
                                    </select>
                                </div>

                                <div className="order-product-filter-group">
                                    <select
                                        value={selectedClosure}
                                        onChange={(e) => setSelectedClosure(e.target.value)}
                                    >
                                        <option value="">Closure Type</option>
                                        <option value="lace">Lace</option>
                                        <option value="velcro">Velcro</option>
                                    </select>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="order-product-content">
                                {/* Your Favorites */}
                                <div className="order-product-section">
                                    <h3>Your Favorites</h3>
                                    <div className="row custom-gap">
                                        {FAVORITE_SHOES.map((shoe) => (
                                            <div key={shoe.id} className="col-6 col-md-2">
                                                <ShoeCard shoe={shoe} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recent Orders */}
                                <div className="order-product-section">
                                    <h3>Recent Orders</h3>
                                    <div className="row custom-gap">
                                        {RECENT_ORDERS.map((shoe) => (
                                            <div key={shoe.id} className="col-6 col-md-2">
                                                <ShoeCard shoe={shoe} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* All Products */}
                                <div className="order-product-section">
                                    <h3>All Shoes</h3>
                                    {filteredShoes.length === 0 && searchTerm && (
                                        <div className="no-results text-center">
                                            No results found
                                        </div>
                                    )}
                                    <div className="row custom-gap">
                                        {filteredShoes.map((shoe) => (
                                            <div key={shoe.id} className="col-6 col-md-2">
                                                <ShoeCard shoe={shoe} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Modifications Screen */}
                    {showModifications && (
                        <div
                            className="modifications-layout"
                            style={{
                                display: 'block',
                                paddingTop: '20px',
                                borderTop: '1px solid var(--card-border)',
                                padding: '24px',
                            }}
                        >
                            <div
                                className="mod-tabs"
                                style={{
                                    display: 'flex',
                                    gap: '30px',
                                    borderBottom: '1px solid #e3e6ea',
                                    marginBottom: '20px',
                                }}
                            >
                                <button
                                    onClick={() => setModTab('mods')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        paddingBottom: '10px',
                                        fontWeight: 600,
                                        color:
                                            modTab === 'mods' ? 'var(--primary-color)' : '#6b7280',
                                        cursor: 'pointer',
                                        borderBottom:
                                            modTab === 'mods'
                                                ? '3px solid var(--primary-color)'
                                                : 'none',
                                    }}
                                >
                                    Modifications
                                </button>
                                <button
                                    onClick={() => setModTab('additional')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        paddingBottom: '10px',
                                        fontWeight: 600,
                                        color:
                                            modTab === 'additional'
                                                ? 'var(--primary-color)'
                                                : '#6b7280',
                                        cursor: 'pointer',
                                        borderBottom:
                                            modTab === 'additional'
                                                ? '3px solid var(--primary-color)'
                                                : 'none',
                                    }}
                                >
                                    Additional Modifications
                                </button>
                            </div>

                            {modTab === 'mods' && (
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr 1.4fr',
                                        gap: '30px',
                                        marginBottom: '30px',
                                    }}
                                >
                                    <div>
                                        <div
                                            style={{
                                                background: '#fff',
                                                border: '1px solid #e3e6ea',
                                                borderRadius: '10px',
                                                padding: '16px',
                                                marginBottom: '16px',
                                            }}
                                        >
                                            <h5 style={{ fontWeight: 600, marginBottom: '10px' }}>
                                                Length
                                            </h5>
                                            <label
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    marginBottom: '8px',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <input type="checkbox" /> <span>Full</span>
                                            </label>
                                            <label
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <input type="checkbox" /> <span>Sulcus</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modTab === 'additional' && (
                                <div style={{ color: '#999', marginBottom: '30px' }}>
                                    Additional modifications options
                                </div>
                            )}

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    marginTop: '30px',
                                    paddingTop: '20px',
                                    borderTop: '1px dashed #dcdfe4',
                                }}
                            >
                                <button
                                    className="modal-btn primary"
                                    onClick={() => setShowConfirmation(true)}
                                    style={{ padding: '10px 26px' }}
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Confirmation Overlay */}
                    {showConfirmation && (
                        <div
                            style={{
                                position: 'fixed',
                                inset: 0,
                                background: 'rgba(0, 0, 0, 0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 9999,
                            }}
                        >
                            <div
                                style={{
                                    background: '#fff',
                                    padding: '32px 40px',
                                    borderRadius: '12px',
                                    textAlign: 'center',
                                    width: '420px',
                                }}
                            >
                                <p
                                    style={{
                                        fontFamily: 'var(--font-family)',
                                        fontWeight: 700,
                                        fontSize: '20px',
                                        marginBottom: '24px',
                                        color: '#1b4b5a',
                                        margin: 0,
                                    }}
                                >
                                    Do you want to confirm the order?
                                </p>
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '16px',
                                        justifyContent: 'center',
                                        marginTop: '24px',
                                    }}
                                >
                                    <button
                                        onClick={() => setShowConfirmation(false)}
                                        style={{
                                            padding: '10px 30px',
                                            border: '1px solid var(--primary-color)',
                                            background: '#fff',
                                            color: 'var(--primary-color)',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: 500,
                                        }}
                                    >
                                        No
                                    </button>
                                    <button
                                        onClick={handleConfirmOrder}
                                        style={{
                                            padding: '10px 30px',
                                            background: 'var(--primary-color)',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: 500,
                                        }}
                                    >
                                        Yes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Confirming Screen */}
                    {confirmingOrder && (
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                height: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                gap: '20px',
                                background: '#fff',
                                zIndex: 10,
                            }}
                        >
                            <div
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    border: '6px solid #ddd',
                                    borderTop: '6px solid var(--primary-color)',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite',
                                }}
                            />
                            <div
                                style={{
                                    fontFamily: 'var(--font-family)',
                                    fontWeight: 700,
                                    fontSize: '20px',
                                    color: '#1b4b5a',
                                }}
                            >
                                Confirming Order
                            </div>
                        </div>
                    )}

                    {/* Order Confirmed Screen */}
                    {orderConfirmed && (
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                height: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                gap: '20px',
                                background: '#fff',
                                zIndex: 10,
                            }}
                        >
                            <div
                                style={{
                                    width: '64px',
                                    height: '64px',
                                    border: '4px solid var(--primary-color)',
                                    borderRadius: '50%',
                                    color: 'var(--primary-color)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '32px',
                                }}
                            >
                                ✓
                            </div>
                            <div
                                style={{
                                    fontFamily: 'var(--font-family)',
                                    fontWeight: 700,
                                    fontSize: '20px',
                                    color: '#1b4b5a',
                                }}
                            >
                                Order Confirmed!
                            </div>
                            <button
                                className="modal-btn primary"
                                onClick={handleOkay}
                                style={{ padding: '10px 26px', marginTop: '20px' }}
                            >
                                Okay
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
    return (
        <div className="shoe-order-page">
            <div className="order-modal">
                {/* Page Header */}
                <div className="modal-main-header">
                    <div className="modal-header">
                        <div
                            className="modal-header-top"
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%',
                            }}
                        >
                            <div className="modal-title">Order Shoes</div>
                        </div>
                    </div>

                    <div className="modal-header-bottom">
                        <div className="modal-left-group">
                            <div className="modal-patient-name">{patientName}</div>
                            <div className="modal-divider-v">|</div>
                            <div className="modal-progress-row">
                                <div style={{ fontWeight: 500, color: 'var(--muted)' }}>
                                    Order Progress:
                                </div>
                                <div className="modal-dots">
                                    <span className="modal-dot modal-dot--active"></span>
                                    <span className="modal-dot modal-dot--active"></span>
                                    <span className="modal-dot"></span>
                                    <span className="modal-dot"></span>
                                    <span className="modal-dot"></span>
                                    <span className="modal-dot"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="order-product-layout">
                    {selectedProduct ? (
                        // Product Details View
                        <div className="product-details-layout">
                            <div
                                className="back-link"
                                onClick={handleBackToProducts}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: 'var(--primary-color)',
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                    marginBottom: '25px',
                                }}
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                                <span>Back to Shoes</span>
                            </div>

                            <div
                                className="details-grid"
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '320px 1fr',
                                    gap: '60px',
                                    alignItems: 'flex-start',
                                }}
                            >
                                {/* Left - Product Preview */}
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: '10px' }}>
                                        Shoe
                                    </div>
                                    <div
                                        className="product-preview"
                                        style={{
                                            background: '#fff',
                                            borderRadius: '12px',
                                            padding: '20px',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <img
                                            src={selectedProduct.image}
                                            alt={selectedProduct.title}
                                            style={{ maxWidth: '180px', marginBottom: '12px' }}
                                        />
                                        <div
                                            className="product-name"
                                            style={{ fontWeight: 600, marginBottom: '4px' }}
                                        >
                                            {selectedProduct.title}
                                        </div>
                                        <div
                                            className="product-meta"
                                            style={{ color: 'var(--muted)', fontSize: '14px' }}
                                        >
                                            {selectedProduct.subtitle}
                                        </div>
                                    </div>
                                </div>

                                {/* Right - Details Form */}
                                <div className="details-form">
                                    <div style={{ fontWeight: 600, marginBottom: '10px' }}>
                                        Additional Information
                                    </div>

                                    <label
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            marginBottom: '18px',
                                            fontWeight: 500,
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={splitSize}
                                            onChange={(e) => setSplitSize(e.target.checked)}
                                        />
                                        <span>I need split sizes</span>
                                    </label>

                                    <select
                                        className="form-select"
                                        value={shoeSize}
                                        onChange={(e) => setShoeSize(e.target.value)}
                                        style={{
                                            marginBottom: '18px',
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: '1px solid var(--input-border-color)',
                                            borderRadius: '6px',
                                            fontFamily: 'var(--font-family)',
                                            fontSize: '13px',
                                        }}
                                    >
                                        <option value="">Select Shoe Size</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                        <option value="13">13</option>
                                    </select>

                                    <select
                                        className="form-select"
                                        style={{
                                            marginBottom: '18px',
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: '1px solid var(--input-border-color)',
                                            borderRadius: '6px',
                                            fontFamily: 'var(--font-family)',
                                            fontSize: '13px',
                                        }}
                                    >
                                        <option>Select Shoe Width</option>
                                        <option value="narrow">Narrow</option>
                                        <option value="regular">Regular</option>
                                        <option value="wide">Wide</option>
                                    </select>

                                    <div
                                        style={{
                                            border: '1px solid #e3e6ea',
                                            borderRadius: '10px',
                                            padding: '15px',
                                        }}
                                    >
                                        <div style={{ fontWeight: 600 }}>Partial Toe Filler</div>
                                        <div
                                            style={{
                                                fontSize: '13px',
                                                color: 'var(--muted)',
                                                marginBottom: '10px',
                                            }}
                                        >
                                            Identify All Missing Digits
                                        </div>

                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '20px',
                                                marginTop: '10px',
                                            }}
                                        >
                                            <strong>Right</strong>
                                            <div style={{ display: 'flex', gap: '14px' }}>
                                                {[1, 2, 3, 4, 5].map((digit) => (
                                                    <label
                                                        key={digit}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                        }}
                                                    >
                                                        <input type="checkbox" />
                                                        {digit}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '20px',
                                                marginTop: '10px',
                                            }}
                                        >
                                            <strong>Left</strong>
                                            <div style={{ display: 'flex', gap: '14px' }}>
                                                {[1, 2, 3, 4, 5].map((digit) => (
                                                    <label
                                                        key={digit}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                        }}
                                                    >
                                                        <input type="checkbox" />
                                                        {digit}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: '30px',
                                    paddingTop: '20px',
                                    borderTop: '1px dashed #dcdfe4',
                                }}
                            >
                                <label
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        fontWeight: 500,
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={addModifications}
                                        onChange={(e) => setAddModifications(e.target.checked)}
                                    />
                                    <span>Add Modifications</span>
                                </label>
                                <button
                                    className="modal-btn primary"
                                    onClick={handleContinue}
                                    style={{ padding: '10px 26px' }}
                                >
                                    Continue
                                </button>
                            </div>

                            {/* Split Size Layout */}
                            {splitSize && (
                                <div
                                    className="split-size-layout"
                                    style={{
                                        display: 'block',
                                        paddingTop: '20px',
                                        borderTop: '1px solid var(--card-border)',
                                    }}
                                >
                                    <div
                                        className="details-grid"
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: '320px 1fr',
                                            gap: '60px',
                                            alignItems: 'flex-start',
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: 600, marginBottom: '10px' }}>
                                                Shoe
                                            </div>
                                            <div
                                                className="product-preview"
                                                style={{
                                                    background: '#fff',
                                                    borderRadius: '12px',
                                                    padding: '20px',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <img
                                                    src={selectedProduct.image}
                                                    alt={selectedProduct.title}
                                                    style={{
                                                        maxWidth: '180px',
                                                        marginBottom: '12px',
                                                    }}
                                                />
                                                <div
                                                    className="product-name"
                                                    style={{ fontWeight: 600, marginBottom: '4px' }}
                                                >
                                                    {selectedProduct.title}
                                                </div>
                                                <div
                                                    className="product-meta"
                                                    style={{
                                                        color: 'var(--muted)',
                                                        fontSize: '14px',
                                                    }}
                                                >
                                                    {selectedProduct.subtitle}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="details-form">
                                            <div style={{ fontWeight: 600, marginBottom: '10px' }}>
                                                Additional Information
                                            </div>

                                            <select
                                                className="form-select"
                                                style={{
                                                    marginBottom: '18px',
                                                    width: '100%',
                                                    padding: '10px 12px',
                                                    border: '1px solid var(--input-border-color)',
                                                    borderRadius: '6px',
                                                    fontFamily: 'var(--font-family)',
                                                    fontSize: '13px',
                                                }}
                                            >
                                                <option>Select Left Shoe Size</option>
                                                {[5, 6, 7, 8, 9, 10, 11, 12, 13].map((size) => (
                                                    <option key={size} value={size}>
                                                        {size}
                                                    </option>
                                                ))}
                                            </select>

                                            <select
                                                className="form-select"
                                                style={{
                                                    marginBottom: '18px',
                                                    width: '100%',
                                                    padding: '10px 12px',
                                                    border: '1px solid var(--input-border-color)',
                                                    borderRadius: '6px',
                                                    fontFamily: 'var(--font-family)',
                                                    fontSize: '13px',
                                                }}
                                            >
                                                <option>Select Right Shoe Size</option>
                                                {[5, 6, 7, 8, 9, 10, 11, 12, 13].map((size) => (
                                                    <option key={size} value={size}>
                                                        {size}
                                                    </option>
                                                ))}
                                            </select>

                                            <select
                                                className="form-select"
                                                style={{
                                                    marginBottom: '18px',
                                                    width: '100%',
                                                    padding: '10px 12px',
                                                    border: '1px solid var(--input-border-color)',
                                                    borderRadius: '6px',
                                                    fontFamily: 'var(--font-family)',
                                                    fontSize: '13px',
                                                }}
                                            >
                                                <option>Select Left Shoe Width</option>
                                                <option value="narrow">Narrow</option>
                                                <option value="regular">Regular</option>
                                                <option value="wide">Wide</option>
                                            </select>

                                            <select
                                                className="form-select"
                                                style={{
                                                    marginBottom: '18px',
                                                    width: '100%',
                                                    padding: '10px 12px',
                                                    border: '1px solid var(--input-border-color)',
                                                    borderRadius: '6px',
                                                    fontFamily: 'var(--font-family)',
                                                    fontSize: '13px',
                                                }}
                                            >
                                                <option>Select Right Shoe Width</option>
                                                <option value="narrow">Narrow</option>
                                                <option value="regular">Regular</option>
                                                <option value="wide">Wide</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            marginTop: '30px',
                                            paddingTop: '20px',
                                            borderTop: '1px dashed #dcdfe4',
                                        }}
                                    >
                                        <button
                                            className="modal-btn primary"
                                            onClick={handleContinue}
                                            style={{ padding: '10px 26px' }}
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Products List View
                        <>
                            {/* Filters */}
                            <div className="order-product-filters">
                                <h4>Filters</h4>

                                <div className="order-product-filter-group">
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <div className="order-product-filter-group">
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                    >
                                        <option value="">Type</option>
                                        <option value="casual">Casual</option>
                                        <option value="formal">Formal</option>
                                    </select>
                                </div>

                                <div className="order-product-filter-group">
                                    <select
                                        value={selectedManufacturer}
                                        onChange={(e) => setSelectedManufacturer(e.target.value)}
                                    >
                                        <option value="">Manufacturer</option>
                                        <option value="sps">SPS</option>
                                        <option value="nike">Nike</option>
                                    </select>
                                </div>

                                <div className="order-product-filter-group">
                                    <select
                                        value={selectedClosure}
                                        onChange={(e) => setSelectedClosure(e.target.value)}
                                    >
                                        <option value="">Closure Type</option>
                                        <option value="lace">Lace</option>
                                        <option value="velcro">Velcro</option>
                                    </select>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="order-product-content">
                                {/* Your Favorites */}
                                <div className="order-product-section">
                                    <h3>Your Favorites</h3>
                                    <div className="row custom-gap">
                                        {FAVORITE_SHOES.map((shoe) => (
                                            <div key={shoe.id} className="col-6 col-md-2">
                                                <ShoeCard shoe={shoe} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recent Orders */}
                                <div className="order-product-section">
                                    <h3>Recent Orders</h3>
                                    <div className="row custom-gap">
                                        {RECENT_ORDERS.map((shoe) => (
                                            <div key={shoe.id} className="col-6 col-md-2">
                                                <ShoeCard shoe={shoe} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* All Products */}
                                <div className="order-product-section">
                                    <h3>All Shoes</h3>
                                    {filteredShoes.length === 0 && searchTerm && (
                                        <div className="no-results text-center">
                                            No results found
                                        </div>
                                    )}
                                    <div className="row custom-gap">
                                        {filteredShoes.map((shoe) => (
                                            <div key={shoe.id} className="col-6 col-md-2">
                                                <ShoeCard shoe={shoe} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Modifications Screen */}
                    {showModifications && (
                        <div
                            className="modifications-layout"
                            style={{
                                display: 'block',
                                paddingTop: '20px',
                                borderTop: '1px solid var(--card-border)',
                                padding: '24px',
                            }}
                        >
                            <div
                                className="mod-tabs"
                                style={{
                                    display: 'flex',
                                    gap: '30px',
                                    borderBottom: '1px solid #e3e6ea',
                                    marginBottom: '20px',
                                }}
                            >
                                <button
                                    onClick={() => setModTab('mods')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        paddingBottom: '10px',
                                        fontWeight: 600,
                                        color:
                                            modTab === 'mods' ? 'var(--primary-color)' : '#6b7280',
                                        cursor: 'pointer',
                                        borderBottom:
                                            modTab === 'mods'
                                                ? '3px solid var(--primary-color)'
                                                : 'none',
                                    }}
                                >
                                    Modifications
                                </button>
                                <button
                                    onClick={() => setModTab('additional')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        paddingBottom: '10px',
                                        fontWeight: 600,
                                        color:
                                            modTab === 'additional'
                                                ? 'var(--primary-color)'
                                                : '#6b7280',
                                        cursor: 'pointer',
                                        borderBottom:
                                            modTab === 'additional'
                                                ? '3px solid var(--primary-color)'
                                                : 'none',
                                    }}
                                >
                                    Additional Modifications
                                </button>
                            </div>

                            {modTab === 'mods' && (
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr 1.4fr',
                                        gap: '30px',
                                        marginBottom: '30px',
                                    }}
                                >
                                    <div>
                                        <div
                                            style={{
                                                background: '#fff',
                                                border: '1px solid #e3e6ea',
                                                borderRadius: '10px',
                                                padding: '16px',
                                                marginBottom: '16px',
                                            }}
                                        >
                                            <h5 style={{ fontWeight: 600, marginBottom: '10px' }}>
                                                Length
                                            </h5>
                                            <label
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    marginBottom: '8px',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <input type="checkbox" /> <span>Full</span>
                                            </label>
                                            <label
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <input type="checkbox" /> <span>Sulcus</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modTab === 'additional' && (
                                <div style={{ color: '#999', marginBottom: '30px' }}>
                                    Additional modifications options
                                </div>
                            )}

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    marginTop: '30px',
                                    paddingTop: '20px',
                                    borderTop: '1px dashed #dcdfe4',
                                }}
                            >
                                <button
                                    className="modal-btn primary"
                                    onClick={() => setShowConfirmation(true)}
                                    style={{ padding: '10px 26px' }}
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Confirmation Overlay */}
                    {showConfirmation && (
                        <div
                            style={{
                                position: 'fixed',
                                inset: 0,
                                background: 'rgba(0, 0, 0, 0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 9999,
                            }}
                        >
                            <div
                                style={{
                                    background: '#fff',
                                    padding: '32px 40px',
                                    borderRadius: '12px',
                                    textAlign: 'center',
                                    width: '420px',
                                }}
                            >
                                <p
                                    style={{
                                        fontFamily: 'var(--font-family)',
                                        fontWeight: 700,
                                        fontSize: '20px',
                                        marginBottom: '24px',
                                        color: '#1b4b5a',
                                        margin: 0,
                                    }}
                                >
                                    Do you want to confirm the order?
                                </p>
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '16px',
                                        justifyContent: 'center',
                                        marginTop: '24px',
                                    }}
                                >
                                    <button
                                        onClick={() => setShowConfirmation(false)}
                                        style={{
                                            padding: '10px 30px',
                                            border: '1px solid var(--primary-color)',
                                            background: '#fff',
                                            color: 'var(--primary-color)',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: 500,
                                        }}
                                    >
                                        No
                                    </button>
                                    <button
                                        onClick={handleConfirmOrder}
                                        style={{
                                            padding: '10px 30px',
                                            background: 'var(--primary-color)',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: 500,
                                        }}
                                    >
                                        Yes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Confirming Screen */}
                    {confirmingOrder && (
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                height: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                gap: '20px',
                                background: '#fff',
                                zIndex: 10,
                            }}
                        >
                            <div
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    border: '6px solid #ddd',
                                    borderTop: '6px solid var(--primary-color)',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite',
                                }}
                            />
                            <div
                                style={{
                                    fontFamily: 'var(--font-family)',
                                    fontWeight: 700,
                                    fontSize: '20px',
                                    color: '#1b4b5a',
                                }}
                            >
                                Confirming Order
                            </div>
                        </div>
                    )}

                    {/* Order Confirmed Screen */}
                    {orderConfirmed && (
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                height: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                gap: '20px',
                                background: '#fff',
                                zIndex: 10,
                            }}
                        >
                            <div
                                style={{
                                    width: '64px',
                                    height: '64px',
                                    border: '4px solid var(--primary-color)',
                                    borderRadius: '50%',
                                    color: 'var(--primary-color)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '32px',
                                }}
                            >
                                ✓
                            </div>
                            <div
                                style={{
                                    fontFamily: 'var(--font-family)',
                                    fontWeight: 700,
                                    fontSize: '20px',
                                    color: '#1b4b5a',
                                }}
                            >
                                Order Confirmed!
                            </div>
                            <button
                                className="modal-btn primary"
                                onClick={handleOkay}
                                style={{ padding: '10px 26px', marginTop: '20px' }}
                            >
                                Okay
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShoeOrder;
