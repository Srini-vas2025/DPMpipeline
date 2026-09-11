/**
 * Generic type representing an option in a dropdown/select control.
 *
 * - `T` is the type of the underlying value (defaults to `string | number`).
 * - Keep this file lightweight so it can be imported in both frontend and shared code.
 */

export interface DropdownOption {
    /**
     * Human readable label shown in the UI.
     */
    label: string;

    /**
     * Underlying value associated with the option.
     */
    value: string | number;

    /**
     * Optional secondary text (e.g. description, helper).
     */
    description?: string;

    /**
     * Optional flag to disable selection of this option.
     */
    disabled?: boolean;

    /**
     * Optional icon name/path to display alongside the label.
     */
    icon?: string;

    /**
     * Group key for visually grouping options in a list.
     */
    group?: string;

    /**
     * Arbitrary metadata consumers might attach (kept as any to be flexible).
     */
    meta?: Record<string, unknown>;
}

/**
 * Convenience alias for an array of dropdown options.
 */
export type DropdownOptions = Array<DropdownOption>;

/**
 * Type guard for runtime checking.
 */
export function isDropdownOption(obj: unknown): obj is DropdownOption {
    return !!obj && typeof obj === 'object' && 'label' in obj && 'value' in (obj as DropdownOption);
}

/**
 * Normalize a value into a DropdownOption if it's provided as a primitive.
 * - If `input` is already an option, it is returned as-is.
 * - If `input` is a primitive (string/number), it is converted to an option
 *   where `label` is the stringified value.
 */
export function toDropdownOption(input: number | string, label: string): DropdownOption {
    if (isDropdownOption(input)) {
        return input;
    }

    return {
        label: label,
        value: input,
    };
}
