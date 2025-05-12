
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';
import './i18n'; // Import i18n configuration
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Create a client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
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
