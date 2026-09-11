import { describe, expect, it } from 'vitest';
import { inferOrderProgress } from './orderProgress';

describe('inferOrderProgress', () => {
    it('marks every stage complete for completed orders', () => {
        expect(inferOrderProgress('Completed', []).progress).toEqual([
            'green',
            'green',
            'green',
            'green',
            'green',
            'green',
        ]);
    });

    it('shows prior stages complete and the current stage as requiring attention', () => {
        expect(inferOrderProgress('Ready For Order', []).progress).toEqual([
            'green',
            'green',
            'red',
            '',
            '',
            '',
        ]);
        expect(inferOrderProgress('Reserved', []).progress).toEqual([
            'green',
            'green',
            'green',
            'green',
            'red',
            '',
        ]);
    });

    it('uses non-empty backend progress before inferring from status', () => {
        expect(inferOrderProgress('Unknown', ['green', 'red']).progress).toEqual([
            'green',
            'red',
            '',
            '',
            '',
            '',
        ]);
    });

    it('does not invent stages for cancelled or unknown orders', () => {
        expect(inferOrderProgress('Cancelled', []).progressState).toBe('cancelled');
        expect(inferOrderProgress('Incomplete', []).progressState).toBe('unknown');
        expect(inferOrderProgress('View Notes', []).progressState).toBe('unknown');
        expect(inferOrderProgress('View Notes', []).progress).toEqual(['', '', '', '', '', '']);
    });
});
