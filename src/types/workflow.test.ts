import { describe, expect, it } from 'vitest';
import { formatWorkflowDob } from './workflow';

describe('formatWorkflowDob', () => {
    it('formats ISO dates for modal headers', () => {
        expect(formatWorkflowDob('1958-04-12')).toBe('04/12/1958');
    });

    it('removes spacing from slash-formatted dates', () => {
        expect(formatWorkflowDob('02 / 25 / 1982')).toBe('02/25/1982');
    });

    it('pads single-digit months and days', () => {
        expect(formatWorkflowDob('2/5/1982')).toBe('02/05/1982');
    });

    it('converts unambiguous day-first dates to month-first dates', () => {
        expect(formatWorkflowDob('20/01/1964')).toBe('01/20/1964');
    });
});
