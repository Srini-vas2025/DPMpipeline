import { describe, expect, it } from 'vitest';
import type { Task } from '../types';
import { orderProgress } from './tasksService';

function task(overrides: Partial<Task> = {}): Task {
    return {
        actionLabel: '',
        createdOn: '07/21/2026',
        dispensingApptDate: '',
        doId: '44',
        dob: '02/25/1982',
        expirayDate: '',
        fittingApptDate: '',
        id: 1,
        isMissingInfo: false,
        isSuspended: '0',
        patient: 'Nick Holroyd',
        patientId: '201838',
        personId: '201838',
        product: 'Shoes',
        progress: [],
        requestId: '88',
        status: '',
        statusNo: 612,
        ...overrides,
    };
}

describe('orderProgress workflow routing', () => {
    it.each([
        [612, 'Shoes', 'shoe-prescription'],
        [612, 'Compression Garment', 'compression-prescription'],
        [628, 'Shoes', 'in-person-fitting'],
        [629, 'Shoes', 'order-shoes'],
        [629, 'Compression', 'order-compression'],
        [2, 'Shoes', 'confirm-arrival'],
        [3, 'Shoes', 'dispensing'],
        [5, 'Shoes', 'proof-of-delivery'],
    ] as const)('maps status %s for %s to %s', (statusNo, product, expectedAction) => {
        expect(orderProgress(task({ product, statusNo })).actionModal).toBe(expectedAction);
    });

    it('routes incomplete demographic tasks to upload forms', () => {
        const result = orderProgress(task({ isMissingInfo: 'yes', statusNo: 999 }));

        expect(result.actionModal).toBe('upload-forms');
        expect(result.actionLabel).toBe('Update Info');
    });

    it('routes other unknown statuses to notes', () => {
        const result = orderProgress(task({ isMissingInfo: false, statusNo: 999 }));

        expect(result.actionModal).toBe('notes');
        expect(result.actionLabel).toBe('View Notes');
    });
});
