import { describe, expect, it } from 'vitest';
import { formatAppointmentDate, formatAppointmentTime, parseAppointmentDateTime } from './utils';

describe('appointment date utilities', () => {
    it('parses ISO appointment timestamps', () => {
        expect(parseAppointmentDateTime('2026-08-05T14:30:00')).toEqual({
            date: '2026-08-05',
            time: '14:30',
        });
    });

    it('parses date-only and day-first API values', () => {
        expect(parseAppointmentDateTime('05-08-2026 09:15:00')).toEqual({
            date: '2026-08-05',
            time: '09:15',
        });
        expect(parseAppointmentDateTime('2026-08-05')).toEqual({
            date: '2026-08-05',
            time: '',
        });
    });

    it('formats appointment dates and times for the table', () => {
        expect(formatAppointmentDate('2026-08-05')).toBe('08/05/2026');
        expect(formatAppointmentTime('14:30')).toBe('2:30 PM');
        expect(formatAppointmentTime('')).toBe('—');
    });
});
