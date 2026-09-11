import React from 'react';
import posthog from 'posthog-js';

// Init PostHog
export const initPostHog = () => {
    posthog.init(import.meta.env.VITE_POSTHOG_KEY || 'phc_placeholder_key', {
        api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
        autocapture: false, // You can enable this later if needed
    });
};

interface ABTestContextType {
    getVariation: (experimentKey: string, defaultValue?: string) => string;
}

export const ABTestContext = React.createContext<ABTestContextType | undefined>(undefined);

export const ABTestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Optionally we can wait for feature flags to load
    // For this context we're keeping it synchronously reading cache if available,
    // real PostHog flags may take a moment to load and we can handle it via hooks

    const getVariation = (experimentKey: string, defaultValue: string = 'control') => {
        const flag = posthog.getFeatureFlag(experimentKey);
        // PostHog normally returns a boolean, string, or undefined
        if (flag === undefined || flag === null) return defaultValue;
        return flag.toString();
    };

    return <ABTestContext.Provider value={{ getVariation }}>{children}</ABTestContext.Provider>;
};
