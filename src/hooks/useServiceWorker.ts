
import { useState, useEffect } from 'react';
import { Workbox, messageSW } from 'workbox-window';

type ServiceWorkerStatus = 'pending' | 'registered' | 'update-available' | 'offline-ready' | 'error';

export const useServiceWorker = () => {
  const [wb, setWb] = useState<Workbox | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [status, setStatus] = useState<ServiceWorkerStatus>('pending');

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const workbox = new Workbox('/service-worker.js');
      
      workbox.addEventListener('installed', (event) => {
        if (event.isUpdate) {
          setStatus('update-available');
        } else {
          setStatus('offline-ready');
        }
      });
      
      workbox.addEventListener('controlling', () => {
        window.location.reload();
      });
      
      workbox.addEventListener('activated', (event) => {
        if (!event.isUpdate) {
          // New service worker activated for the first time
          setStatus('registered');
        }
      });
      
      workbox.addEventListener('waiting', () => {
        setStatus('update-available');
      });
      
      workbox.addEventListener('redundant', () => {
        setStatus('error');
      });
      
      workbox.register()
        .then((reg) => {
          setRegistration(reg);
          setStatus('registered');
        })
        .catch(() => {
          setStatus('error');
        });
      
      setWb(workbox);
    }
  }, []);

  const update = () => {
    if (registration && registration.waiting) {
      messageSW(registration.waiting, { type: 'SKIP_WAITING' });
    }
  };

  return { status, update, registration };
};
