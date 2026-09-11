import type { ApiOrderProgressStatus, OrderProgressState, ProgressDot } from '../types/order.types';

export const ORDER_PROGRESS_STAGES = [
    'Prescription complete',
    'Fitting form complete',
    'Order placed',
    'Arrival confirmed',
    'Order dispensed',
    'Proof of delivery complete',
] as const;

const emptyProgress = (): ProgressDot[] => ORDER_PROGRESS_STAGES.map(() => '');

const activeProgress = (currentStage: number): ProgressDot[] =>
    ORDER_PROGRESS_STAGES.map((_, index) => {
        if (index < currentStage) return 'green';
        if (index === currentStage) return 'red';
        return '';
    });

const normalizeStatus = (status: string): string =>
    status
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();

const includesAny = (status: string, values: string[]): boolean =>
    values.some((value) => status.includes(value));

const inferCurrentStage = (status: string): number | null => {
    if (includesAny(status, ['proof of delivery', 'confirm pod', 'pod pending'])) return 5;

    if (includesAny(status, ['dispensed', 'delivery pending'])) return 5;

    if (
        includesAny(status, [
            'ready to dispense',
            'need dispensing',
            'needs dispensing',
            'dispensing',
            'reserved',
            'order confirmed',
        ])
    ) {
        return 4;
    }

    if (
        includesAny(status, [
            'awaiting arrival',
            'confirm arrival',
            'ordered',
            'order placed',
            'shipped',
            'in production',
        ])
    ) {
        return 3;
    }

    if (
        includesAny(status, [
            'ready for order',
            'ready to order',
            'need to order',
            'fitting form signed',
            'fitting complete',
        ])
    ) {
        return 2;
    }

    if (
        includesAny(status, [
            'fitter assigned',
            'need fitting',
            'needs fitting',
            'fitting appointment',
            'fitting',
        ])
    ) {
        return 1;
    }

    if (includesAny(status, ['prescription', 'pending rx', 'rx pending'])) return 0;

    return null;
};

export interface InferredOrderProgress {
    progress: ProgressDot[];
    progressState: OrderProgressState;
}

export const inferOrderProgress = (
    status: string,
    apiProgress: ApiOrderProgressStatus[] | null | undefined,
): InferredOrderProgress => {
    const normalizedStatus = normalizeStatus(status);

    if (includesAny(normalizedStatus, ['cancelled', 'canceled'])) {
        return { progress: emptyProgress(), progressState: 'cancelled' };
    }

    if (
        ['completed', 'complete', 'closed'].includes(normalizedStatus) ||
        includesAny(normalizedStatus, ['order completed', 'order complete', 'order closed'])
    ) {
        return {
            progress: ORDER_PROGRESS_STAGES.map(() => 'green'),
            progressState: 'completed',
        };
    }

    const backendProgress = apiProgress?.filter(
        (color): color is ProgressDot => color === 'green' || color === 'red' || color === '',
    );
    if (backendProgress?.some(Boolean)) {
        return {
            progress: ORDER_PROGRESS_STAGES.map((_, index) => backendProgress[index] ?? ''),
            progressState: 'api',
        };
    }

    const currentStage = inferCurrentStage(normalizedStatus);
    if (currentStage !== null) {
        return { progress: activeProgress(currentStage), progressState: 'inferred' };
    }

    return { progress: emptyProgress(), progressState: 'unknown' };
};
