import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../api/client';
import type { VisitorLogPayload } from '../features/analytics/types/analytics.types';

function getOrCreateSessionId(): string {
  try {
    let sId = sessionStorage.getItem('bb_visitor_session_id');
    if (!sId) {
      sId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem('bb_visitor_session_id', sId);
    }
    return sId;
  } catch {
    return `sess_${Date.now()}_fallback`;
  }
}

function detectDeviceType(): 'mobile' | 'desktop' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

/**
 * Lightweight, non-blocking public site visitor tracking hook.
 * Captures initial page loads and route changes, firing async POST to /api/analytics/track
 */
export function useVisitorTracker() {
  const location = useLocation();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    // Avoid redundant hits for identical path in short window
    if (lastPathRef.current === location.pathname) return;
    lastPathRef.current = location.pathname;

    const sessionId = getOrCreateSessionId();
    const device = detectDeviceType();
    let referrer = 'direct';
    try {
      if (document.referrer) {
        referrer = new URL(document.referrer).hostname || 'direct';
      }
    } catch {
      referrer = 'direct';
    }

    const payload: VisitorLogPayload = {
      sessionId,
      path: location.pathname,
      device,
      referrer,
      timestamp: new Date().toISOString(),
    };

    // Non-blocking async tracking invocation
    api.analytics.trackHit(payload).catch((err) => {
      // Debug log only; tracking errors must never break the UI
      console.debug('Visitor tracker payload notice:', err);
    });
  }, [location.pathname]);
}

export { useVisitorTracker as useAnalyticsTracker };
export default useVisitorTracker;
