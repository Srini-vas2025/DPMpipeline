import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';
import App from './app.tsx';
import { initLogger } from './utils/logger';
import { initPostHog, ABTestProvider } from './context/abTestContext';

// Initialise Sentry error logging and PostHog A/B testing as early as possible
initLogger();
initPostHog();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        {/* ABTestProvider — PostHog feature flags */}
        <ABTestProvider>
            {/* BrowserRouter — React Router DOM */}
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ABTestProvider>
    </StrictMode>,
);
