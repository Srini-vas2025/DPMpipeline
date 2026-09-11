import { useEffect, useRef, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import type { ModificationData } from '../../../features/common/types/shoeStyle.types';
import type {
    ProductConfigurationResponse,
    ConfigurationItemResponse,
} from '../../../features/common/types/productConfiguration.types';

import {
    normalizeConfigurationOptions,
    getConfigurationItems,
    splitIntoColumns,
    isMatrixItem,
    mapAdditionalConfigurationItem,
} from '../../../features/common/hooks/orderShoes.utils';
import { FulfillmentCheckbox } from './OrderShoesSubcomponents';

export function ModificationCard({
    note,
    options,
    title,
    selectedValues,
    onChange,
}: {
    note?: string;
    options: string[];
    title: string;
    selectedValues: string[];
    onChange: (title: string, option: string, checked: boolean) => void;
}) {
    return (
        <section className="modification-card">
            <h4>{title}</h4>
            {note ? <p>{note}</p> : null}
            <div className="modification-card-options">
                {options.map((option) => (
                    <FulfillmentCheckbox
                        key={option}
                        label={option}
                        checked={selectedValues.includes(option)}
                        onChange={(event) => onChange(title, option, event.target.checked)}
                    />
                ))}
            </div>
        </section>
    );
}

export function ConfigurationModificationCard({
    item,
    selectedValues,
    onChange,
}: {
    item: ConfigurationItemResponse;
    selectedValues: string[];
    onChange: (title: string, option: string, checked: boolean) => void;
}) {
    const options = normalizeConfigurationOptions(item.options ?? []);
    const directOptions = options.filter((option) => !option.children || option.children.length === 0);
    const groupedOptions = options.filter((option) => option.children && option.children.length > 0);

    if (groupedOptions.length === 0) {
        return (
            <ModificationCard
                title={item.itemName}
                note={item.itemDescription ?? undefined}
                options={directOptions.map((option) => option.optionName)}
                selectedValues={selectedValues}
                onChange={onChange}
            />
        );
    }

    return (
        <section className="modification-card">
            <h4>{item.itemName}</h4>
            {item.itemDescription ? <p>{item.itemDescription}</p> : null}
            {directOptions.length > 0 ? (
                <div className="modification-card-options">
                    {directOptions.map((option) => (
                        <FulfillmentCheckbox
                            key={option.configurationOptionId}
                            label={option.optionName}
                            checked={selectedValues.includes(option.optionName)}
                            onChange={(event) => onChange(item.itemName, option.optionName, event.target.checked)}
                        />
                    ))}
                </div>
            ) : null}
            <div className="additional-subgroups">
                {groupedOptions.map((parentOption) => (
                    <div className="additional-subgroup" key={parentOption.configurationOptionId}>
                        <strong>{parentOption.optionName}</strong>
                        {normalizeConfigurationOptions(parentOption.children ?? []).map((childOption) => {
                            const value = `${parentOption.optionName}-${childOption.optionName}`;
                            return (
                                <FulfillmentCheckbox
                                    key={childOption.configurationOptionId}
                                    label={childOption.optionName}
                                    checked={selectedValues.includes(value)}
                                    onChange={(event) => onChange(item.itemName, value, event.target.checked)}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </section>
    );
}

export function ModificationMatrix({
    item,
    selectedValues,
    onChange,
}: {
    item: ConfigurationItemResponse;
    selectedValues: string[];
    onChange: (title: string, option: string, checked: boolean) => void;
}) {
    const options = normalizeConfigurationOptions(item.options ?? []);
    const flagOptions = options.filter((option) => {
        const name = option.optionName?.trim().toLowerCase();
        return name === 'offload' || name === 'sweetspot';
    });
    const sideOptions = options.filter((option) => {
        const name = option.optionName?.trim().toLowerCase();
        return name === 'right' || name === 'left';
    });

    return (
        <section className="modification-matrix">
            <h4>{item.itemName}</h4>
            <div className="modification-matrix-flags">
                {flagOptions.map((option) => (
                    <FulfillmentCheckbox
                        key={option.configurationOptionId}
                        label={option.optionName}
                        checked={selectedValues.includes(option.optionName)}
                        onChange={(event) => onChange(item.itemName, option.optionName, event.target.checked)}
                    />
                ))}
            </div>
            {sideOptions.map((sideOption) => (
                <div className="modification-matrix-row" key={sideOption.configurationOptionId}>
                    <span>{sideOption.optionName}</span>
                    {normalizeConfigurationOptions(sideOption.children ?? []).map((childOption) => {
                        const value = `${sideOption.optionName}${childOption.optionName}`;
                        return (
                            <FulfillmentCheckbox
                                key={childOption.configurationOptionId}
                                label={childOption.optionName}
                                checked={selectedValues.includes(value)}
                                onChange={(event) => onChange(item.itemName, value, event.target.checked)}
                            />
                        );
                    })}
                </div>
            ))}
        </section>
    );
}

export function AdditionalModificationCard({
    group,
    selectedValues,
    onChange,
}: {
    group: {
        measurements?: string[];
        note?: string;
        options?: string[];
        subgroups?: Array<{ label: string; options: string[] }>;
        title: string;
    };
    selectedValues: string[];
    onChange: (title: string, option: string, checked: boolean) => void;
}) {
    return (
        <section className="modification-card additional-modification-card">
            <h4>{group.title}</h4>
            {group.note ? <p>{group.note}</p> : null}
            {group.measurements ? (
                <div className="modification-measurements">
                    {group.measurements.map((label) => (
                        <label key={label}>
                            <input
                                aria-label={`${group.title} ${label}`}
                                type="number"
                                value={selectedValues.find((val) => val.startsWith(`${label}:`))?.split(':')[1] ?? ''}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    onChange(group.title, `${label}:${value}`, value !== '');
                                }}
                            />
                            <span>{label}</span>
                        </label>
                    ))}
                </div>
            ) : null}
            {group.subgroups ? (
                <div className="additional-subgroups">
                    {group.subgroups.map((subgroup) => (
                        <div className="additional-subgroup" key={subgroup.label}>
                            <strong>{subgroup.label}</strong>
                            {subgroup.options.map((option) => {
                                const value = `${subgroup.label}-${option}`;
                                return (
                                    <FulfillmentCheckbox
                                        key={value}
                                        label={option}
                                        checked={selectedValues.includes(value)}
                                        onChange={(event) => onChange(group.title, value, event.target.checked)}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            ) : null}
            {group.options ? (
                <div className="modification-card-options">
                    {group.options.map((option) => (
                        <FulfillmentCheckbox
                            key={option}
                            label={option}
                            checked={selectedValues.includes(option)}
                            onChange={(event) => onChange(group.title, option, event.target.checked)}
                        />
                    ))}
                </div>
            ) : null}
        </section>
    );
}

export function ModificationDetails({
    onBack,
    onContinue,
    selectedModifications,
    selectedAdditionalModifications,
    configuration,
    configurationLoading,
    configurationError,
}: {
    onBack: () => void;
    onContinue: (modifications: ModificationData, additionalModifications: ModificationData) => void;
    selectedModifications: ModificationData;
    selectedAdditionalModifications: ModificationData;
    configuration?: ProductConfigurationResponse;
    configurationLoading: boolean;
    configurationError: boolean;
}) {
    const [activeTab, setActiveTab] = useState<'modifications' | 'additional'>('modifications');
    const [modifications, setModifications] = useState<ModificationData>(selectedModifications);
    const [additionalModifications, setAdditionalModifications] = useState<ModificationData>(selectedAdditionalModifications);

    const contentRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        contentRef.current?.scrollTo({ top: 0 });
    }, [activeTab]);

    const handleModificationChange = (title: string, option: string, checked: boolean) => {
        setModifications((current) => {
            const currentValues = current[title] ?? [];
            const updatedValues = checked
                ? Array.from(new Set([...currentValues, option]))
                : currentValues.filter((value) => value !== option);

            const updated = { ...current };
            if (updatedValues.length > 0) updated[title] = updatedValues;
            else delete updated[title];
            return updated;
        });
    };

    const handleAdditionalModificationChange = (title: string, option: string, checked: boolean) => {
        setAdditionalModifications((current) => {
            const currentValues = current[title] ?? [];
            const updatedValues = checked
                ? Array.from(new Set([...currentValues, option]))
                : currentValues.filter((value) => value !== option);

            const updated = { ...current };
            if (updatedValues.length > 0) updated[title] = updatedValues;
            else delete updated[title];
            return updated;
        });
    };

    const modificationItems = getConfigurationItems(configuration, false);
    const additionalItems = getConfigurationItems(configuration, true);
    const regularModificationItems = modificationItems.filter((item) => !isMatrixItem(item));
    const matrixItems = modificationItems.filter((item) => isMatrixItem(item));
    const modificationColumns = splitIntoColumns(regularModificationItems, 2);
    const additionalModificationColumns = splitIntoColumns(additionalItems, 4);

    return (
        <div className="modal-product-detail modification-detail" aria-labelledby="modifications-title">
            <button className="back-to-modal" onClick={onBack} type="button">
                <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
                Back to Shoe Details
            </button>
            <div className="modification-header">
                <h3 id="modifications-title">Modifications</h3>
            </div>
            <div className="modification-tabs" aria-label="Modification sections">
                <button
                    className={activeTab === 'modifications' ? 'active' : ''}
                    onClick={() => setActiveTab('modifications')}
                    type="button"
                >
                    Modifications
                </button>
                <button
                    className={activeTab === 'additional' ? 'active' : ''}
                    onClick={() => setActiveTab('additional')}
                    type="button"
                >
                    Additional Modifications
                </button>
            </div>
            {configurationLoading ? (
                <div className="modification-content" ref={contentRef}>
                    <div>
                        <LoaderCircle size={28} className="order-catalog-spinner" aria-hidden="true" />
                        <p>Loading modifications...</p>
                    </div>
                </div>
            ) : configurationError ? (
                <div className="modification-content" ref={contentRef}>
                    <div>
                        <p>Unable to load product modifications.</p>
                        <p>Please try again or continue without selecting modifications.</p>
                    </div>
                </div>
            ) : activeTab === 'modifications' ? (
                <div className="modification-content" ref={contentRef}>
                    <div className="modification-card-columns">
                        {modificationColumns.map((column, columnIndex) => (
                            <div className="modification-card-column" key={columnIndex}>
                                {column.map((item) => (
                                    <ConfigurationModificationCard
                                        key={item.configurationItemId}
                                        item={item}
                                        selectedValues={modifications[item.itemName] ?? []}
                                        onChange={handleModificationChange}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                    {matrixItems.length > 0 && (
                        <div className="modification-matrices">
                            <div className="modification-matrices">
                                {matrixItems.map((item) => (
                                    <ModificationMatrix
                                        key={item.configurationItemId}
                                        item={item}
                                        selectedValues={modifications[item.itemName] ?? []}
                                        onChange={handleModificationChange}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    {regularModificationItems.length === 0 && matrixItems.length === 0 && (
                        <div>
                            <p>No modifications are configured for this product.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="modification-content additional-modification-content" ref={contentRef}>
                    {additionalModificationColumns.map((column, columnIndex) => (
                        <div className="modification-card-column" key={columnIndex}>
                            {column.map((item) => {
                                const group = mapAdditionalConfigurationItem(item);
                                return (
                                    <AdditionalModificationCard
                                        key={item.configurationItemId}
                                        group={group}
                                        selectedValues={additionalModifications[item.itemName] ?? []}
                                        onChange={handleAdditionalModificationChange}
                                    />
                                );
                            })}
                        </div>
                    ))}
                    {additionalItems.length === 0 && (
                        <div>
                            <p>No additional modifications are configured for this product.</p>
                        </div>
                    )}
                </div>
            )}
            <footer className="modification-footer">
                <button
                    className="fulfillment-submit"
                    onClick={() => onContinue(modifications, additionalModifications)}
                    type="button"
                >
                    Continue
                </button>
            </footer>
        </div>
    );
}
