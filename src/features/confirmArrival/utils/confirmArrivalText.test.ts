import { describe, expect, it } from 'vitest';
import { toStandardCase } from './confirmArrivalText';

describe('toStandardCase', () => {
    it('converts uppercase API descriptions into readable title case', () => {
        expect(toStandardCase('FOAM BOX MAILED TO MANUFACTURER')).toBe(
            'Foam Box Mailed to Manufacturer',
        );
        expect(toStandardCase('REGLA R ESCANO SANCHEZ')).toBe('Regla R Escano Sanchez');
        expect(toStandardCase('DR COMFORT')).toBe('Dr Comfort');
    });

    it('preserves existing mixed case and known acronyms', () => {
        expect(toStandardCase('Casual Comfort Stretch-Velcro')).toBe(
            'Casual Comfort Stretch-Velcro',
        );
        expect(toStandardCase('RX READY FOR AFO')).toBe('RX Ready for AFO');
    });
});
