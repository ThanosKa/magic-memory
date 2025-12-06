'use client';

import { useEffect } from 'react';
import { initWebVitals } from '@/lib/seo/core-web-vitals';

export function WebVitalsTracker() {
  useEffect(() => {
    initWebVitals();
  }, []);

  return null;
}
