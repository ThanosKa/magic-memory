'use client';

import { onLCP, onCLS, onINP, type Metric } from 'web-vitals';

type VitalsPayload = {
  name: string;
  value: number;
  id: string;
  path: string;
  rating: 'good' | 'needs-improvement' | 'poor';
  navigationType: string;
};

const sendToAnalytics = (metric: Metric): void => {
  const payload: VitalsPayload = {
    name: metric.name,
    value: metric.value,
    id: metric.id,
    path: window.location.pathname,
    rating: metric.rating,
    navigationType: metric.navigationType,
  };

  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    navigator.sendBeacon('/api/vitals', blob);
  } else {
    fetch('/api/vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(console.error);
  }

  if (process.env.NODE_ENV === 'development') {
    console.warn('[Web Vitals]', metric.name, {
      value: Math.round(metric.value),
      rating: metric.rating,
    });
  }
};

export function initWebVitals(): void {
  if (typeof window === 'undefined') return;

  try {
    onLCP(sendToAnalytics);
    onCLS(sendToAnalytics);
    onINP(sendToAnalytics);
  } catch (error) {
    console.error('[Web Vitals] Error initializing:', error);
  }
}

export const WEB_VITALS_THRESHOLDS = {
  LCP: {
    good: 2500,
    poor: 4000,
  },
  CLS: {
    good: 0.1,
    poor: 0.25,
  },
  INP: {
    good: 200,
    poor: 500,
  },
} as const;
