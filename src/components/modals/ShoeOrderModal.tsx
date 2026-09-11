import { useMemo, useState } from 'react';
import '../../styles/modalcard.css';

import shoeImg from '../../assets/images/shoe-img.png';

type ShoeOrderModalProps = {
    patientName: string;
    onClose: () => void;
};

type ShoeFlow =
    | 'list'
    | 'details'
    | 'modifications'
    | 'scanLoading'
    | 'scanConfirmed'
    | 'orderLoading'
    | 'orderConfirmed';

type BackTarget = 'details' | 'modifications';

type ShoeItem = {
    id: number;
    name: string;
    code: string;
    color: string;
    image: string;
};

type CustomDropdownProps = {
    value: string;
    options: string[];
    onChange: (value: string) => void;
};

function CustomDropdown({ value, options, onChange }: CustomDropdownProps) {
    // dropdown state
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="custom-dropdown">
            <button
                type="button"
                className={`custom-dropdown-btn ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <span>{value}</span>
                <i className="fa-solid fa-chevron-down"></i>
            </button>

            {isOpen && (
                <div className="custom-dropdown-menu">
                    {options.map((option) => (
                        <button
                            type="button"
                            key={option}
                            className="custom-dropdown-item"
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// shoe data
const shoes: ShoeItem[] = Array.from({ length: 35 }, (_, index) => ({
    id: index + 1,
    name: 'SPS Apis',
    code: '#1907',
    color: 'Black',
    image: shoeImg,
}));

const firstPageCount = 5;
const nextPageCount = 15;

export default function ShoeOrderModal({ patientName, onClose }: ShoeOrderModalProps) {
    // list state
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState('');
    const [selectedShoe, setSelectedShoe] = useState<ShoeItem | null>(null);
    const [activeShoeId, setActiveShoeId] = useState<number | null>(null);

    // form state
    const [isSplitSize, setIsSplitSize] = useState(false);
    const [addModifications, setAddModifications] = useState(false);

    // flow state
    const [flow, setFlow] = useState<ShoeFlow>('list');
    const [activeModTab, setActiveModTab] = useState<'modifications' | 'additional'>(
        'modifications',
    );
    const [scanBackTarget, setScanBackTarget] = useState<BackTarget>('details');

    // dropdown options
    const dropdownOptions = ['Select', 'Option 1', 'Option 2', 'Option 3'];

    // dropdown values
    const [dropdownValues, setDropdownValues] = useState({
        type: 'Type',
        manufacturer: 'Manufacturer',
        closureType: 'Closure Type',
        leftShoeSize: 'Select Left Shoe Size',
        rightShoeSize: 'Select Right Shoe Size',
        leftShoeWidth: 'Select Left Shoe Width',
        rightShoeWidth: 'Select Right Shoe Width',
        shoeSize: 'Select Shoe Size',
        shoeWidth: 'Select Shoe Width',
    });

    // update dropdown
    const handleDropdownChange = (field: keyof typeof dropdownValues, value: string) => {
        setDropdownValues((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const isSearching = searchText.trim().length > 0;

    // filtered shoes
    const filteredAllShoes = useMemo(() => {
        const query = searchText.trim().toLowerCase();

        if (!query) {
            return shoes;
        }

        return shoes.filter((shoe) =>
            `${shoe.name} ${shoe.code} ${shoe.color}`.toLowerCase().includes(query),
        );
    }, [searchText]);

    // pagination
    const totalPages =
        filteredAllShoes.length <= firstPageCount
            ? 1
            : 1 + Math.ceil((filteredAllShoes.length - firstPageCount) / nextPageCount);

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const visibleAllShoes =
        currentPage === 1
            ? filteredAllShoes.slice(0, firstPageCount)
            : filteredAllShoes.slice(
                  firstPageCount + (currentPage - 2) * nextPageCount,
                  firstPageCount + (currentPage - 1) * nextPageCount,
              );

    // scan flow
    const startScanFlow = (backTarget: BackTarget) => {
        setScanBackTarget(backTarget);
        setFlow('scanLoading');

        setTimeout(() => {
            setFlow('scanConfirmed');
        }, 3000);
    };

    // details continue
    const handleDetailsContinue = () => {
        if (addModifications) {
            setFlow('modifications');
            return;
        }

        startScanFlow('details');
    };

    // modifications continue
    const handleModificationsContinue = () => {
        startScanFlow('modifications');
    };

    // place order
    const handlePlaceOrder = () => {
        setFlow('orderLoading');

        setTimeout(() => {
            setFlow('orderConfirmed');
        }, 3000);
    };

    // close button
    const renderCloseButton = () => (
        <button type="button" className="modal-close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
        </button>
    );

    // scan back button
    const renderBackToScanPrevious = () => (
        <button type="button" className="modal-back-btn" onClick={() => setFlow(scanBackTarget)}>
            <i className="fa-solid fa-arrow-left"></i>
            {scanBackTarget === 'modifications' ? 'Back to Modifications' : 'Back to Shoe Details'}
        </button>
    );

    // shoe card
    const renderShoeCard = (shoe: ShoeItem) => {
        const isActive = activeShoeId === shoe.id;

        return (
            <button
                type="button"
                className={`shoe-order-card ${isActive ? 'active' : ''}`}
                key={shoe.id}
                onClick={() => setActiveShoeId((prev) => (prev === shoe.id ? null : shoe.id))}
            >
                <div className="shoe-order-img-wrap">
                    <img src={shoe.image} alt={shoe.name} />
                </div>

                <div className="shoe-order-info">
                    <div className="shoe-order-name">{shoe.name}</div>

                    <div className="shoe-order-code-wrap">
                        <span className="shoe-order-code">
                            {shoe.code} | {shoe.color}
                        </span>

                        <span
                            className="shoe-order-select"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedShoe(shoe);
                                setFlow('details');
                                setActiveShoeId(null);
                            }}
                        >
                            Select
                        </span>
                    </div>
                </div>
            </button>
        );
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card large-modal shoe-order-modal">
                {/* shoe list */}
                {flow === 'list' && (
                    <>
                        <div className="modal-simple-header shoe-order-header">
                            <div>
                                <h3 className="modal-title">Order Shoes</h3>

                                <div className="modal-patient-row">
                                    <span className="modal-patient-name">{patientName}</span>

                                    <span className="modal-divider">|</span>

                                    <span className="modal-progress-label">Order Progress:</span>

                                    <span className="modal-progress-dots">
                                        <span className="active"></span>
                                        <span className="active"></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </span>

                                    <span className="modal-divider">|</span>

                                    <button type="button" className="modal-small-btn">
                                        Order Shoes
                                    </button>
                                </div>
                            </div>

                            {renderCloseButton()}
                        </div>

                        <div className="shoe-order-layout">
                            <aside className="shoe-order-filters">
                                <h4 className="shoe-order-section-title">Filters</h4>

                                <input
                                    type="text"
                                    className="shoe-order-input"
                                    placeholder="Search"
                                    value={searchText}
                                    onChange={(e) => {
                                        setSearchText(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />

                                <CustomDropdown
                                    value={dropdownValues.type}
                                    options={dropdownOptions}
                                    onChange={(value) => handleDropdownChange('type', value)}
                                />

                                <CustomDropdown
                                    value={dropdownValues.manufacturer}
                                    options={dropdownOptions}
                                    onChange={(value) =>
                                        handleDropdownChange('manufacturer', value)
                                    }
                                />

                                <CustomDropdown
                                    value={dropdownValues.closureType}
                                    options={dropdownOptions}
                                    onChange={(value) => handleDropdownChange('closureType', value)}
                                />
                            </aside>

                            <section className="shoe-order-products">
                                {!isSearching && currentPage === 1 && (
                                    <>
                                        <div className="shoe-order-section">
                                            <h4 className="shoe-order-section-title">
                                                Your Favorites
                                            </h4>

                                            <div className="shoe-order-grid">
                                                {shoes.slice(0, 5).map(renderShoeCard)}
                                            </div>
                                        </div>

                                        <div className="shoe-order-section">
                                            <h4 className="shoe-order-section-title">
                                                Recent Orders
                                            </h4>

                                            <div className="shoe-order-grid">
                                                {shoes.slice(5, 10).map(renderShoeCard)}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {visibleAllShoes.length > 0 ? (
                                    <div className="shoe-order-section">
                                        {!isSearching && (
                                            <h4 className="shoe-order-section-title">All Shoes</h4>
                                        )}

                                        <div className="shoe-order-grid">
                                            {visibleAllShoes.map(renderShoeCard)}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="shoe-order-empty">No results found</div>
                                )}

                                {visibleAllShoes.length > 0 && (
                                    <div className="shoe-order-pagination">
                                        <button
                                            type="button"
                                            className={currentPage > 1 ? 'active' : ''}
                                            onClick={() =>
                                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                                            }
                                            disabled={currentPage === 1}
                                        >
                                            ‹ PREV
                                        </button>

                                        <div className="shoe-order-pages">
                                            {pageNumbers.map((page) => (
                                                <button
                                                    type="button"
                                                    key={page}
                                                    className={currentPage === page ? 'active' : ''}
                                                    onClick={() => setCurrentPage(page)}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            type="button"
                                            className={currentPage < totalPages ? 'active' : ''}
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.min(prev + 1, totalPages),
                                                )
                                            }
                                            disabled={currentPage === totalPages}
                                        >
                                            NEXT ›
                                        </button>
                                    </div>
                                )}
                            </section>
                        </div>
                    </>
                )}

                {/* shoe details */}
                {flow === 'details' && selectedShoe && (
                    <>
                        <div className="modal-simple-header shoe-details-header">
                            <button
                                type="button"
                                className="modal-back-btn"
                                onClick={() => {
                                    setFlow('list');
                                    setSelectedShoe(null);
                                    setIsSplitSize(false);
                                    setAddModifications(false);
                                }}
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                                Back to Shoes
                            </button>

                            {renderCloseButton()}
                        </div>

                        <div className="shoe-details-container">
                            <div className="shoe-details-left">
                                <h4 className="shoe-details-title">Shoe</h4>

                                <div className="shoe-details-card">
                                    <img src={selectedShoe.image} alt={selectedShoe.name} />

                                    <div className="shoe-details-name">{selectedShoe.name}</div>

                                    <div className="shoe-details-code">
                                        {selectedShoe.code} | {selectedShoe.color}
                                    </div>
                                </div>
                            </div>

                            <div className="shoe-details-right">
                                <h4 className="shoe-details-title">Additional Information</h4>

                                <label className="shoe-check-row">
                                    <input
                                        type="checkbox"
                                        checked={isSplitSize}
                                        onChange={(e) => setIsSplitSize(e.target.checked)}
                                    />
                                    <span>I need split sizes</span>
                                </label>

                                {isSplitSize ? (
                                    <>
                                        <CustomDropdown
                                            value={dropdownValues.leftShoeSize}
                                            options={dropdownOptions}
                                            onChange={(value) =>
                                                handleDropdownChange('leftShoeSize', value)
                                            }
                                        />

                                        <CustomDropdown
                                            value={dropdownValues.rightShoeSize}
                                            options={dropdownOptions}
                                            onChange={(value) =>
                                                handleDropdownChange('rightShoeSize', value)
                                            }
                                        />

                                        <CustomDropdown
                                            value={dropdownValues.leftShoeWidth}
                                            options={dropdownOptions}
                                            onChange={(value) =>
                                                handleDropdownChange('leftShoeWidth', value)
                                            }
                                        />

                                        <CustomDropdown
                                            value={dropdownValues.rightShoeWidth}
                                            options={dropdownOptions}
                                            onChange={(value) =>
                                                handleDropdownChange('rightShoeWidth', value)
                                            }
                                        />
                                    </>
                                ) : (
                                    <>
                                        <CustomDropdown
                                            value={dropdownValues.shoeSize}
                                            options={dropdownOptions}
                                            onChange={(value) =>
                                                handleDropdownChange('shoeSize', value)
                                            }
                                        />

                                        <CustomDropdown
                                            value={dropdownValues.shoeWidth}
                                            options={dropdownOptions}
                                            onChange={(value) =>
                                                handleDropdownChange('shoeWidth', value)
                                            }
                                        />

                                        <div className="toe-box">
                                            <div className="toe-title">Partial Toe Filler</div>

                                            <div className="toe-subtitle">
                                                Identify All Missing Digits
                                            </div>

                                            <div className="toe-row">
                                                <span>Right</span>

                                                {[1, 2, 3, 4, 5].map((item) => (
                                                    <label key={`right-${item}`}>
                                                        <input type="checkbox" />
                                                        {item}
                                                    </label>
                                                ))}
                                            </div>

                                            <div className="toe-row">
                                                <span>Left</span>

                                                {[1, 2, 3, 4, 5].map((item) => (
                                                    <label key={`left-${item}`}>
                                                        <input type="checkbox" />
                                                        {item}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="modal-flow-divider"></div>

                        <div className="modal-footer-split">
                            <label className="shoe-check-row">
                                <input
                                    type="checkbox"
                                    checked={addModifications}
                                    onChange={(e) => setAddModifications(e.target.checked)}
                                />
                                <span>Add Modifications</span>
                            </label>

                            <button
                                type="button"
                                className="modal-submit-btn"
                                onClick={handleDetailsContinue}
                            >
                                Continue
                            </button>
                        </div>
                    </>
                )}

                {/* modifications */}
                {flow === 'modifications' && (
                    <>
                        <div className="modal-simple-header shoe-details-header">
                            <button
                                type="button"
                                className="modal-back-btn"
                                onClick={() => setFlow('details')}
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                                Back to Shoe Details
                            </button>

                            {renderCloseButton()}
                        </div>

                        <div className="shoe-mod-container">
                            <div className="shoe-mod-tabs">
                                <button
                                    type="button"
                                    className={activeModTab === 'modifications' ? 'active' : ''}
                                    onClick={() => setActiveModTab('modifications')}
                                >
                                    Modifications
                                </button>

                                <button
                                    type="button"
                                    className={activeModTab === 'additional' ? 'active' : ''}
                                    onClick={() => setActiveModTab('additional')}
                                >
                                    Additional Modifications
                                </button>
                            </div>

                            {activeModTab === 'modifications' ? (
                                <div className="shoe-mod-grid">
                                    <div className="shoe-mod-box">
                                        <h4>Length</h4>

                                        <label>
                                            <input type="checkbox" />
                                            Full
                                        </label>

                                        <label>
                                            <input type="checkbox" />
                                            Sulcus
                                        </label>
                                    </div>

                                    <div className="shoe-mod-box">
                                        <h4>Metatarsal Pad</h4>

                                        <label>
                                            <input type="checkbox" />
                                            Right
                                        </label>

                                        <label>
                                            <input type="checkbox" />
                                            Left
                                        </label>
                                    </div>

                                    <div className="shoe-mod-box shoe-mod-wide">
                                        <h4>
                                            Met Heads <input type="checkbox" /> Offload{' '}
                                            <input type="checkbox" /> Sweetspot{' '}
                                            <input type="checkbox" />
                                        </h4>

                                        <div className="shoe-mod-row">
                                            <span>Right</span>

                                            {[1, 2, 3, 4, 5].map((item) => (
                                                <label key={`met-right-${item}`}>
                                                    <input type="checkbox" />
                                                    {item}
                                                </label>
                                            ))}
                                        </div>

                                        <div className="shoe-mod-row">
                                            <span>Left</span>

                                            {[1, 2, 3, 4, 5].map((item) => (
                                                <label key={`met-left-${item}`}>
                                                    <input type="checkbox" />
                                                    {item}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="shoe-mod-box">
                                        <h4>Arch Height</h4>

                                        <label>
                                            <input type="checkbox" />
                                            Same
                                        </label>

                                        <label>
                                            <input type="checkbox" />
                                            Lower
                                        </label>

                                        <label>
                                            <input type="checkbox" />
                                            Higher
                                        </label>
                                    </div>

                                    <div className="shoe-mod-box">
                                        <h4>Metatarsal Bar</h4>

                                        <label>
                                            <input type="checkbox" />
                                            Full
                                        </label>

                                        <label>
                                            <input type="checkbox" />
                                            Sulcus
                                        </label>
                                    </div>

                                    <div className="shoe-mod-box shoe-mod-wide">
                                        <h4>
                                            Distal Tips <input type="checkbox" /> Offload{' '}
                                            <input type="checkbox" /> Sweetspot{' '}
                                            <input type="checkbox" />
                                        </h4>

                                        <div className="shoe-mod-row">
                                            <span>Right</span>

                                            {[1, 2, 3, 4, 5].map((item) => (
                                                <label key={`distal-right-${item}`}>
                                                    <input type="checkbox" />
                                                    {item}
                                                </label>
                                            ))}
                                        </div>

                                        <div className="shoe-mod-row">
                                            <span>Left</span>

                                            {[1, 2, 3, 4, 5].map((item) => (
                                                <label key={`distal-left-${item}`}>
                                                    <input type="checkbox" />
                                                    {item}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="shoe-mod-grid shoe-mod-additional-grid">
                                    <div className="shoe-mod-box">
                                        <h4>Top Cover</h4>

                                        <label>
                                            <input type="checkbox" />
                                            Standard
                                        </label>

                                        <label>
                                            <input type="checkbox" />
                                            Bilam
                                        </label>
                                    </div>

                                    <div className="shoe-mod-box">
                                        <h4>Metatarsal Pad</h4>

                                        <label>
                                            <input type="checkbox" />
                                            Right
                                        </label>

                                        <label>
                                            <input type="checkbox" />
                                            Left
                                        </label>
                                    </div>

                                    <div className="shoe-mod-box">
                                        <h4>Strap Extension</h4>

                                        <div className="shoe-number-row">
                                            <label>
                                                Right
                                                <input type="number" defaultValue={0} />
                                            </label>

                                            <label>
                                                Left
                                                <input type="number" defaultValue={0} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="modal-footer-right">
                                <button
                                    type="button"
                                    className="modal-submit-btn"
                                    onClick={handleModificationsContinue}
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* scan loading */}
                {flow === 'scanLoading' && (
                    <>
                        <div className="modal-simple-header shoe-details-header">
                            {renderBackToScanPrevious()}
                            {renderCloseButton()}
                        </div>

                        <div className="shoe-flow-center">
                            <div className="modal-dot-loader">
                                {Array.from({ length: 8 }, (_, index) => (
                                    <span key={index}></span>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* scan confirmed */}
                {flow === 'scanConfirmed' && (
                    <>
                        <div className="modal-simple-header shoe-details-header">
                            {renderBackToScanPrevious()}
                            {renderCloseButton()}
                        </div>

                        <div className="shoe-flow-center">
                            <div className="modal-success-icon">
                                <i className="fa-solid fa-check"></i>
                            </div>

                            <h3 className="shoe-flow-title">3D Scan Confirmed</h3>

                            <button
                                type="button"
                                className="modal-submit-btn shoe-flow-btn"
                                onClick={handlePlaceOrder}
                            >
                                Place Order
                            </button>
                        </div>
                    </>
                )}

                {/* order loading */}
                {flow === 'orderLoading' && (
                    <>
                        <div className="modal-simple-header shoe-details-header">
                            <span></span>
                            {renderCloseButton()}
                        </div>

                        <div className="shoe-flow-center">
                            <div className="modal-dot-loader">
                                {Array.from({ length: 8 }, (_, index) => (
                                    <span key={index}></span>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* order confirmed */}
                {flow === 'orderConfirmed' && (
                    <>
                        <div className="modal-simple-header shoe-details-header">
                            <span></span>
                            {renderCloseButton()}
                        </div>

                        <div className="shoe-flow-center">
                            <div className="modal-success-icon">
                                <i className="fa-solid fa-check"></i>
                            </div>

                            <h3 className="shoe-flow-title">Order Confirmed!</h3>

                            <button
                                type="button"
                                className="modal-submit-btn shoe-flow-ok-btn"
                                onClick={onClose}
                            >
                                Okay
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
