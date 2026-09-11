const DEMO_MODE_STORAGE_KEY = 'softgait-demo-mode';

export const isDemoMode = (): boolean =>
    import.meta.env.DEV &&
    typeof localStorage !== 'undefined' &&
    localStorage.getItem(DEMO_MODE_STORAGE_KEY) === 'true';

export const enableDemoMode = (): void => {
    if (!import.meta.env.DEV || typeof localStorage === 'undefined') return;

    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.setItem(DEMO_MODE_STORAGE_KEY, 'true');
};

export const disableDemoMode = (): void => {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(DEMO_MODE_STORAGE_KEY);
};
