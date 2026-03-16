import { useEffect, useState } from 'react';

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export function useUtmParams(): UtmParams {
  const [params, setParams] = useState<UtmParams>({});

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const utmData: UtmParams = {};

    const keys: (keyof UtmParams)[] = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    keys.forEach((key) => {
      const value = searchParams.get(key);
      if (value) utmData[key] = value;
    });

    if (Object.keys(utmData).length > 0) {
      setParams(utmData);
      // Persist UTMs in sessionStorage for later use
      sessionStorage.setItem('utm_params', JSON.stringify(utmData));
    } else {
      // Try to recover from sessionStorage
      const stored = sessionStorage.getItem('utm_params');
      if (stored) setParams(JSON.parse(stored));
    }
  }, []);

  return params;
}
