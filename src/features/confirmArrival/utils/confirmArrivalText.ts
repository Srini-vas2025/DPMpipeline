const LOWERCASE_CONNECTORS = new Set([
    'a',
    'an',
    'and',
    'at',
    'for',
    'in',
    'of',
    'on',
    'or',
    'the',
    'to',
    'with',
]);
const UPPERCASE_ACRONYMS = new Set(['AFO', 'DME', 'POD', 'RX', 'USA']);

const titleCasePart = (part: string): string => {
    const lettersAndNumbers = part.replace(/[^\p{L}\p{N}]/gu, '');
    if (UPPERCASE_ACRONYMS.has(lettersAndNumbers)) return part;

    return part
        .toLocaleLowerCase()
        .replace(/(^|['’])\p{L}/gu, (match) => match.toLocaleUpperCase());
};

const titleCaseWord = (word: string): string => word.split('-').map(titleCasePart).join('-');

/**
 * Converts API values that arrive entirely in uppercase into readable title case.
 * Existing mixed-case values are preserved so intentional product and brand casing is not lost.
 */
export const toStandardCase = (value: string): string => {
    const normalized = value.trim().replace(/\s+/g, ' ');
    if (!/\p{L}/u.test(normalized) || normalized !== normalized.toLocaleUpperCase()) {
        return normalized;
    }

    return normalized
        .split(' ')
        .map((word, index) => {
            const lowercaseWord = word.toLocaleLowerCase();
            if (index > 0 && LOWERCASE_CONNECTORS.has(lowercaseWord)) return lowercaseWord;
            return titleCaseWord(word);
        })
        .join(' ');
};
