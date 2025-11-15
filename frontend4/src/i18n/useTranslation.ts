import { useState, useEffect } from 'react';
import { onLanguageChange, t as translate } from './index';

/**
 * Custom hook that provides translations and re-renders when language changes
 */
export function useTranslation() {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // Subscribe to language changes
    const unsubscribe = onLanguageChange(() => {
      forceUpdate({}); // Force re-render when language changes
    });

    return unsubscribe;
  }, []);

  return { t: translate };
}
