'use client';

/**
 * Core Web Vitals Tracking
 * Monitors LCP, CLS, and INP metrics and sends them to analytics
 */

import { onLCP, onCLS, onINP, type Metric } from 'web-vitals';

type VitalsPayload = {
  name: string;
  value: number;
  id: string;
  path: string;
  rating: 'good' | 'needs-improvement' | 'poor';
  navigationType: string;
};

/**
 * Send vitals data to analytics endpoint
 */
const sendToAnalytics = (metric: Metric): void => {
  const payload: VitalsPayload = {
    name: metric.name,
    value: metric.value,
    id: metric.id,
    path: window.location.pathname,
    rating: metric.rating,
    navigationType: metric.navigationType,
  };

  // Use sendBeacon if available (doesn't block page unload)
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    navigator.sendBeacon('/api/vitals', blob);
  } else {
    // Fallback to fetch
    fetch('/api/vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(console.error);
  }

  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Web Vitals]', metric.name, {
      value: Math.round(metric.value),
      rating: metric.rating,
    });
  }
};

/**
 * Initialize Core Web Vitals tracking
 * Call this once in your root client component or layout
 */
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

/**
 * Get thresholds for each metric
 */
export const WEB_VITALS_THRESHOLDS = {
  LCP: {
    good: 2500, // 2.5s
    poor: 4000, // 4s
  },
  CLS: {
    good: 0.1,
    poor: 0.25,
  },
  INP: {
    good: 200, // 200ms
    poor: 500, // 500ms
  },
} as const;
