import type { ChangeEvent, ReactNode } from 'react';
import { useState } from 'react';
import { Check, LoaderCircle, Star } from 'lucide-react';

import type { ShoeProduct } from '../../../features/common/types/shoeStyle.types';
import shoeImageFallback from '../../../assets/images/shoe-img.png';
import { resolveShoeImage } from '../../../features/common/hooks/orderShoes.utils';

export function ShoeImage({ alt, image, sourceUrl }: { alt: string; image?: string; sourceUrl?: string }) {
    return (
        <img
            src={resolveShoeImage(image, sourceUrl)}
            alt={alt}
            onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = shoeImageFallback;
            }}
        />
    );
}

export function FulfillmentCheckbox({
    checked,
    label,
    onChange,
}: {
    checked?: boolean;
    label: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <label>
            <input checked={checked} onChange={onChange} type="checkbox" />
            <span className="fulfillment-check-box" aria-hidden="true">
                <Check size={18} strokeWidth={3.3} />
            </span>
            <span>{label}</span>
        </label>
    );
}

export function ShoeCard({
    favorite = false,
    onToggleFavorite,
    onSelect,
    onDetails,
    product,
}: {
    favorite?: boolean;
    onToggleFavorite: (id: string) => void;
    onSelect: (product: ShoeProduct) => void;
    onDetails: (product: ShoeProduct) => void;
    product: ShoeProduct;
}) {
    return (
        <article className="shoe-card">
            <button
                className={`favorite-button ${favorite ? 'active' : ''}`}
                type="button"
                aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
                aria-pressed={favorite}
                onClick={() => onToggleFavorite(product.id)}
            >
                <Star size={23} fill={favorite ? 'currentColor' : 'none'} aria-hidden="true" />
            </button>
            <ShoeImage image={product.image} sourceUrl={product.sourceUrl} alt={product.title} />
            <div className="shoe-card-copy">
                <strong>{product.title}</strong>
                <span>{product.sku} | {product.color}</span>
            </div>
            <div className="shoe-card-actions" aria-label="Shoe actions">
                <button className="primary-action" onClick={() => onSelect(product)}>Select</button>
                <button onClick={() => onDetails(product)}>Details</button>
            </div>
        </article>
    );
}

export function ShoeSection({ title, children }: { children: ReactNode; title: string }) {
    return (
        <section className="shoe-section" aria-labelledby={`${title}-heading`}>
            <h3 id={`${title}-heading`}>{title}</h3>
            <div className="shoe-grid">{children}</div>
        </section>
    );
}

export function OrderSubmitting() {
    return (
        <div className="modal-product-detail order-submitting-detail" role="status" aria-live="polite">
            <div className="order-submitting-state">
                <LoaderCircle size={88} strokeWidth={1.8} aria-hidden="true" />
                <p>Confirming Order</p>
            </div>
        </div>
    );
}

export function DownloadLabels({ onClose }: { onClose: () => void }) {
    return (
        <div className="modal-product-detail label-download-detail" aria-labelledby="label-download-title">
            <section className="label-download-panel">
                <div className="label-download-copy">
                    <h3 id="label-download-title">Your labels should start downloading.</h3>
                    <p>Once complete, you can close this window.</p>
                </div>
                <div className="label-download-actions">
                    <button type="button">Redownload Labels</button>
                    <button type="button" onClick={onClose}>Close This Window</button>
                </div>
            </section>
        </div>
    );
}

export function TrackingNumberForm({ onSubmit }: { onSubmit: (trackingNumber: string) => void }) {
    const [trackingNumber, setTrackingNumber] = useState('');
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!trackingNumber.trim()) return;
        onSubmit(trackingNumber.trim());
    };

    return (
        <div className="modal-product-detail tracking-detail" aria-labelledby="tracking-title">
            <section className="tracking-number-panel">
                <div className="tracking-copy">
                    <h3 id="tracking-title">Let's enter your tracking number.</h3>
                    <p>Once we have your tracking number, we'll process your order.</p>
                </div>
                <form className="tracking-form" onSubmit={handleSubmit}>
                    <label>
                        <span className="sr-only">Tracking number</span>
                        <input
                            placeholder="0000000000000 - 00000"
                            value={trackingNumber}
                            onChange={(event) => setTrackingNumber(event.target.value)}
                        />
                    </label>
                    <button className="fulfillment-submit" type="submit">Submit</button>
                </form>
            </section>
        </div>
    );
}

export function NoScanOptions({
    onSubmit,
    onClose,
}: {
    onSubmit: (trackingNumber: string) => void;
    onClose: () => void;
}) {
    const [showDownloadLabels, setShowDownloadLabels] = useState(false);
    const [showTrackingForm, setShowTrackingForm] = useState(false);

    if (showDownloadLabels) return <DownloadLabels onClose={onClose} />;
    if (showTrackingForm) return <TrackingNumberForm onSubmit={onSubmit} />;

    return (
        <div className="modal-product-detail no-scan-detail" aria-labelledby="no-scan-title">
            <section className="no-scan-options">
                <div className="no-scan-copy">
                    <h3 id="no-scan-title">No 3D scan was found.</h3>
                    <p>Do you need to print labels, or do you have your own?</p>
                </div>
                <div className="no-scan-actions">
                    <button onClick={() => setShowTrackingForm(true)} type="button">
                        I have my own label
                    </button>
                    <button onClick={() => setShowDownloadLabels(true)} type="button">
                        I need to print a label
                    </button>
                </div>
            </section>
        </div>
    );
}
