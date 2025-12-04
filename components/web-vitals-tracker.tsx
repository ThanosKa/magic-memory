'use client';

/**
 * Web Vitals Tracker Component
 * Mount this in your root layout to enable Core Web Vitals tracking
 */

import { useEffect } from 'react';
import { initWebVitals } from '@/lib/seo/core-web-vitals';

export function WebVitalsTracker() {
  useEffect(() => {
    initWebVitals();
  }, []);

  return null; // This component doesn't render anything
}
