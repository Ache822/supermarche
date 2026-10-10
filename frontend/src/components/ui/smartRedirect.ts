export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.supermarche.app';
export const APP_STORE_URL = 'https://apps.apple.com/app/supermarche/id123456789';

/**
 * Bulletproof Smart OS Detection Helper
 * Accurately detects iOS (iPhone Safari/Chrome/Firefox, iPad, iPod, Mac touch) vs Android
 */
export function getSmartStoreUrl(overrideUserAgent?: string): string {
  if (typeof window === 'undefined') return PLAY_STORE_URL;
  
  const navWindow = window as unknown as { opera?: string };
  const userAgent = overrideUserAgent || navigator.userAgent || navigator.vendor || navWindow.opera || '';
  const platform = navigator.platform || '';

  const isIOS =
    /iPad|iPhone|iPod|CriOS|FxiOS/i.test(userAgent) ||
    (platform === 'MacIntel' && navigator.maxTouchPoints > 1) ||
    (/Macintosh/i.test(userAgent) && (navigator.maxTouchPoints > 0 || 'ontouchend' in window));

  if (isIOS) {
    return APP_STORE_URL;
  }
  return PLAY_STORE_URL;
}
