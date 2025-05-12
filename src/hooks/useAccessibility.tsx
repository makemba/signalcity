
import { useEffect, useCallback, useState, useRef } from 'react';

type SkipLinkProps = {
  contentId: string;
  children?: React.ReactNode;
};

export const SkipLink = ({ contentId, children }: SkipLinkProps) => {
  return (
    <a
      href={`#${contentId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
    >
      {children || "Aller au contenu principal"}
    </a>
  );
};

export const useKeyboardAccessibility = (selector = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])') => {
  useEffect(() => {
    const handleFirstTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
        window.removeEventListener('keydown', handleFirstTab);
      }
    };

    window.addEventListener('keydown', handleFirstTab);
    
    return () => {
      window.removeEventListener('keydown', handleFirstTab);
    };
  }, []);

  useEffect(() => {
    const focusableElements = document.querySelectorAll(selector);
    
    const addFocusRingStyles = () => {
      const style = document.createElement('style');
      style.textContent = `
        body:not(.user-is-tabbing) ${selector}:focus {
          outline: none;
          box-shadow: none;
        }
      `;
      document.head.appendChild(style);
    };
    
    addFocusRingStyles();
    
    return () => {
      // Clean up if needed
    };
  }, [selector]);
};

export const useAnnouncer = () => {
  const [message, setMessage] = useState('');
  const announcerRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((text: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announcerRef.current) {
      announcerRef.current.setAttribute('aria-live', priority);
      setMessage(text);
      
      // Clear announcement after screen readers have had time to announce
      const timerId = setTimeout(() => {
        setMessage('');
      }, 3000);
      
      return () => clearTimeout(timerId);
    }
  }, []);

  const Announcer = () => (
    <div
      ref={announcerRef}
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );

  return { announce, Announcer };
};

export const useTabFocus = () => {
  const handleTabKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      const tabFocusElements = document.querySelectorAll('[data-tab-focus]');
      tabFocusElements.forEach((el) => {
        (el as HTMLElement).dataset.tabFocus = 'false';
      });
      
      setTimeout(() => {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.hasAttribute('data-tab-focus')) {
          (activeElement as HTMLElement).dataset.tabFocus = 'true';
        }
      }, 10);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleTabKey);
    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [handleTabKey]);

  return null;
};
