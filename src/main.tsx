
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';
import './i18n'; // Import i18n configuration
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { Toaster } from '@/components/ui/sonner';

// Create a client
const queryClient = new QueryClient();

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster position="bottom-right" />
    </StrictMode>
  </QueryClientProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
  onSuccess: () => console.log('L\'application est disponible hors ligne'),
  onUpdate: (registration) => {
    console.log('Nouvelle version disponible!');
    // Optionally, show a notification to the user about the update
  }
});
