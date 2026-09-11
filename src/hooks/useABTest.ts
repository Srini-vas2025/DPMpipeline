import { useContext, useState, useEffect } from 'react';
import posthog from 'posthog-js';
import { ABTestContext } from '../context/abTestContext';

export const useABTest = (featureFlag: string, defaultValue: string = 'control') => {
    const context = useContext(ABTestContext);
    const [variation, setVariation] = useState<string>(
        context ? context.getVariation(featureFlag, defaultValue) : defaultValue,
    );

    useEffect(() => {
        // Listen for PostHog flag updates in case they load asynchronously
        posthog.onFeatureFlags(() => {
            const newFlag = posthog.getFeatureFlag(featureFlag);
            if (newFlag !== undefined) {
                setVariation(newFlag.toString());
            }
        });
    }, [featureFlag]);

    return variation;
};
