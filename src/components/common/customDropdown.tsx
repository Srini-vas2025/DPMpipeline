import { useState } from 'react';
import type { DropdownOptions } from '../../types/dropdownOption';

type CustomDropdownProps = {
    value: number | string;
    options: DropdownOptions;
    onChange: (value: number | string) => void;
};

const CustomDropdown: React.FC<CustomDropdownProps> = ({ value, options, onChange }) => {
    // dropdown state
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="custom-dropdown">
            <button
                type="button"
                className={`custom-dropdown-btn ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <span>
                    {(Array.isArray(options) ? options : []).find((opt) => opt.value === value)
                        ?.label || 'Select an option'}
                </span>
                <i className="fa-solid fa-chevron-down"></i>
            </button>

            {isOpen && (
                <div className="custom-dropdown-menu">
                    {(Array.isArray(options) ? options : []).map((option) => (
                        <button
                            type="button"
                            key={option.value}
                            className="custom-dropdown-item"
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
export default CustomDropdown;

//import React, {
//  useCallback,
//  useEffect,
//  useMemo,
//  useRef,
//  useState,
//  forwardRef,
//  Ref,
//} from "react";

//type OptionValue = string | number;

//export interface SelectOption {
//  value: OptionValue;
//  label: string;
//  disabled?: boolean;
//  // allow extra payload
//  [key: string]: any;
//}

//interface CustomSelectProps {
//  id?: string;
//  name?: string;
//  options: SelectOption[];
//  value?: OptionValue | OptionValue[] | null;
//  placeholder?: string;
//  multiple?: boolean;
//  searchable?: boolean;
//  disabled?: boolean;
//  className?: string;
//  // called with new value(s): single value for single-select, array for multiple
//  onChange?: (value: OptionValue | OptionValue[] | null) => void;
//  // custom renderer for options
//  renderOption?: (option: SelectOption, isSelected: boolean) => React.ReactNode;
//  // control whether the dropdown opens by default
//  defaultOpen?: boolean;
//}

///**
// * A lightweight, accessible custom Select component supporting:
// * - single & multiple selection
// * - optional searching/filtering
// * - keyboard navigation
// *
// * Note: styling is minimal and inline to keep the component self-contained.
// */
//const CustomSelect = forwardRef(function CustomSelect(
//  props: CustomSelectProps,
//  ref: Ref<HTMLDivElement> | undefined
//) {
//  const {
//    id,
//    name,
//    options,
//    value,
//    placeholder = "Select...",
//    multiple = false,
//    searchable = false,
//    disabled = false,
//    className,
//    onChange,
//    renderOption,
//    defaultOpen = false,
//  } = props;

//  const containerRef = useRef<HTMLDivElement | null>(null);
//  // allow forwarded ref
//  useEffect(() => {
//    if (!ref) return;
//    if (typeof ref === "function") {
//      ref(containerRef.current);
//    } else {
//      // @ts-ignore
//      ref.current = containerRef.current;
//    }
//  }, [ref]);

//  const [open, setOpen] = useState(defaultOpen && !disabled);
//  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
//  const [search, setSearch] = useState("");
//  const inputRef = useRef<HTMLInputElement | null>(null);
//  const listRef = useRef<HTMLDivElement | null>(null);

//  // normalize selected values to an array for internal logic
//  const selectedValues = useMemo(() => {
//    if (multiple) {
//      if (!value) return [] as OptionValue[];
//      return Array.isArray(value) ? value : [value];
//    } else {
//      return value != null ? [value as OptionValue] : [];
//    }
//  }, [value, multiple]);

//  const filteredOptions = useMemo(() => {
//    if (!searchable || !search.trim()) return options;
//    const q = search.toLowerCase();
//    return options.filter(
//      (o) =>
//        (o.label && o.label.toLowerCase().includes(q)) ||
//        String(o.value).toLowerCase().includes(q)
//    );
//  }, [options, search, searchable]);

//  useEffect(() => {
//    // reset highlight when open or filtered options change
//    if (open) {
//      setHighlightIndex(filteredOptions.findIndex((o) => !o.disabled));
//    } else {
//      setHighlightIndex(-1);
//    }
//  }, [open, filteredOptions]);

//  const isSelected = useCallback(
//    (opt: SelectOption) => selectedValues.includes(opt.value),
//    [selectedValues]
//  );

//  const emitChange = useCallback(
//    (next: OptionValue | OptionValue[] | null) => {
//      onChange && onChange(next);
//    },
//    [onChange]
//  );

//  const toggleOpen = useCallback(() => {
//    if (disabled) return;
//    setOpen((v) => !v);
//    if (!open && searchable) {
//      // focus input on open
//      setTimeout(() => inputRef.current?.focus(), 0);
//    }
//  }, [disabled, open, searchable]);

//  const selectOption = useCallback(
//    (opt: SelectOption) => {
//      if (opt.disabled) return;
//      if (multiple) {
//        const nextArr = selectedValues.includes(opt.value)
//          ? selectedValues.filter((v) => v !== opt.value)
//          : [...selectedValues, opt.value];
//        emitChange(nextArr.length ? nextArr : null);
//      } else {
//        emitChange(opt.value);
//        setOpen(false);
//      }
//    },
//    [multiple, selectedValues, emitChange]
//  );

//  const onKeyDown = useCallback(
//    (e: React.KeyboardEvent) => {
//      if (disabled) return;
//      switch (e.key) {
//        case "ArrowDown":
//          e.preventDefault();
//          if (!open) {
//            setOpen(true);
//            return;
//          }
//          setHighlightIndex((cur) => {
//            let next = cur + 1;
//            const max = filteredOptions.length - 1;
//            while (next <= max && filteredOptions[next]?.disabled) next++;
//            if (next > max) return cur;
//            // scroll into view
//            setTimeout(() => {
//              const el = listRef.current?.querySelectorAll<HTMLElement>("[role='option']")[next];
//              el?.scrollIntoView({ block: "nearest" });
//            }, 0);
//            return next;
//          });
//          break;
//        case "ArrowUp":
//          e.preventDefault();
//          if (!open) {
//            setOpen(true);
//            return;
//          }
//          setHighlightIndex((cur) => {
//            let next = cur - 1;
//            while (next >= 0 && filteredOptions[next]?.disabled) next--;
//            if (next < 0) return cur;
//            setTimeout(() => {
//              const el = listRef.current?.querySelectorAll<HTMLElement>("[role='option']")[next];
//              el?.scrollIntoView({ block: "nearest" });
//            }, 0);
//            return next;
//          });
//          break;
//        case "Enter":
//          e.preventDefault();
//          if (!open) {
//            setOpen(true);
//            return;
//          }
//          if (highlightIndex >= 0 && filteredOptions[highlightIndex]) {
//            selectOption(filteredOptions[highlightIndex]);
//          }
//          break;
//        case "Escape":
//          e.preventDefault();
//          setOpen(false);
//          break;
//        case "Backspace":
//          if (multiple && !search && selectedValues.length) {
//            // remove last selected
//            const next = selectedValues.slice(0, -1);
//            emitChange(next.length ? next : null);
//          }
//          break;
//      }
//    },
//    [disabled, open, filteredOptions, highlightIndex, selectOption, multiple, selectedValues, search, emitChange]
//  );

//  // close when clicking outside
//  useEffect(() => {
//    const onDocClick = (e: MouseEvent) => {
//      if (!containerRef.current) return;
//      if (!containerRef.current.contains(e.target as Node)) {
//        setOpen(false);
//      }
//    };
//    document.addEventListener("mousedown", onDocClick);
//    return () => document.removeEventListener("mousedown", onDocClick);
//  }, []);

//  const clearSelection = useCallback(
//    (e?: React.MouseEvent) => {
//      e?.stopPropagation();
//      emitChange(null);
//      setSearch("");
//    },
//    [emitChange]
//  );

//  // basic inline styles to make the component usable without external css
//  const styles: { [k: string]: React.CSSProperties } = {
//    container: {
//      position: "relative",
//      display: "inline-block",
//      minWidth: 200,
//      fontFamily: "Segoe UI, Roboto, Helvetica, Arial, sans-serif",
//      fontSize: 14,
//    },
//    control: {
//      display: "flex",
//      alignItems: "center",
//      gap: 8,
//      border: "1px solid #cfcfcf",
//      borderRadius: 4,
//      padding: "6px 8px",
//      background: disabled ? "#f5f5f5" : "#fff",
//      cursor: disabled ? "not-allowed" : "pointer",
//      minHeight: 36,
//    },
//    placeholder: { color: "#888" },
//    tags: { display: "flex", gap: 6, flexWrap: "wrap" },
//    tag: {
//      background: "#eef",
//      padding: "2px 6px",
//      borderRadius: 12,
//      fontSize: 12,
//    },
//    input: {
//      border: "none",
//      outline: "none",
//      flex: 1,
//      minWidth: 30,
//      fontSize: 14,
//      background: "transparent",
//    },
//    dropdown: {
//      position: "absolute",
//      zIndex: 999,
//      left: 0,
//      right: 0,
//      marginTop: 4,
//      border: "1px solid #ddd",
//      borderRadius: 4,
//      background: "#fff",
//      maxHeight: 240,
//      overflow: "auto",
//      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
//    },
//    option: {
//      padding: "8px 10px",
//      cursor: "pointer",
//    },
//    optionDisabled: {
//      color: "#999",
//      cursor: "not-allowed",
//    },
//    optionHighlighted: {
//      background: "#e6f0ff",
//    },
//    clearBtn: {
//      background: "transparent",
//      border: "none",
//      cursor: "pointer",
//      padding: 4,
//      fontSize: 14,
//    },
//    caret: {
//      marginLeft: 6,
//      transform: open ? "rotate(180deg)" : "rotate(0deg)",
//      transition: "transform 0.15s",
//    },
//  };

//  return (
//    <div
//      id={id}
//      ref={containerRef}
//      className={className}
//      style={styles.container}
//      onKeyDown={onKeyDown}
//    >
//      <input type="hidden" name={name} value={Array.isArray(value) ? value.join(",") : (value ?? "")} />
//      <div
//        role="combobox"
//        aria-expanded={open}
//        aria-haspopup="listbox"
//        tabIndex={disabled ? -1 : 0}
//        onClick={toggleOpen}
//        onFocus={() => {
//          if (!disabled) setOpen(true);
//        }}
//        style={styles.control}
//      >
//        {multiple ? (
//          <div style={styles.tags} onClick={(e) => e.stopPropagation()}>
//            {selectedValues.length ? (
//              selectedValues
//                .map((val) => options.find((o) => o.value === val))
//                .filter(Boolean)
//                .map((o) => (
//                  <div key={o!.value} style={styles.tag}>
//                    {o!.label}
//                  </div>
//                ))
//            ) : (
//              <div style={styles.placeholder}>{placeholder}</div>
//            )}
//            {searchable && (
//              <input
//                ref={inputRef}
//                style={styles.input}
//                value={search}
//                onChange={(e) => setSearch(e.target.value)}
//                placeholder={selectedValues.length ? "" : undefined}
//                onClick={(e) => e.stopPropagation()}
//                disabled={disabled}
//                aria-label="Search"
//              />
//            )}
//          </div>
//        ) : (
//          <>
//            <div style={{ flex: 1 }}>
//              {selectedValues.length ? (
//                options.find((o) => o.value === selectedValues[0])?.label ?? String(selectedValues[0])
//              ) : searchable ? (
//                <input
//                  ref={inputRef}
//                  style={styles.input}
//                  value={search}
//                  onChange={(e) => setSearch(e.target.value)}
//                  placeholder={placeholder}
//                  onClick={(e) => e.stopPropagation()}
//                  disabled={disabled}
//                  aria-label="Search"
//                />
//              ) : (
//                <div style={styles.placeholder}>{placeholder}</div>
//              )}
//            </div>
//          </>
//        )}

//        <div style={{ display: "flex", alignItems: "center" }}>
//          {(selectedValues.length || (!!search && searchable)) && !disabled && (
//            <button
//              type="button"
//              aria-label="Clear selection"
//              onClick={(e) => {
//                e.stopPropagation();
//                clearSelection(e);
//              }}
//              style={styles.clearBtn}
//            >
//              ×
//            </button>
//          )}
//          <div style={styles.caret}>▾</div>
//        </div>
//      </div>

//      {open && !disabled && (
//        <div
//          role="listbox"
//          aria-labelledby={id}
//          style={styles.dropdown}
//          ref={listRef}
//        >
//          {filteredOptions.length === 0 ? (
//            <div style={{ padding: 10, color: "#666" }}>No options</div>
//          ) : (
//            filteredOptions.map((opt, idx) => {
//              const selected = isSelected(opt);
//              const highlighted = idx === highlightIndex;
//              const optionStyle: React.CSSProperties = {
//                ...styles.option,
//                ...(opt.disabled ? styles.optionDisabled : {}),
//                ...(highlighted ? styles.optionHighlighted : {}),
//              };
//              return (
//                <div
//                  key={String(opt.value)}
//                  role="option"
//                  aria-selected={selected}
//                  aria-disabled={opt.disabled}
//                  onClick={(e) => {
//                    e.stopPropagation();
//                    if (opt.disabled) return;
//                    selectOption(opt);
//                  }}
//                  onMouseEnter={() => setHighlightIndex(idx)}
//                  style={optionStyle}
//                >
//                  {renderOption ? renderOption(opt, selected) : (
//                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                      <div>{opt.label}</div>
//                      {selected && <div style={{ color: "#1877f2" }}>✓</div>}
//                    </div>
//                  )}
//                </div>
//              );
//            })
//          )}
//        </div>
//      )}
//    </div>
//  );
//});

//export default CustomSelect;
