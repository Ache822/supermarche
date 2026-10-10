import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import globalEn from './translations/en.json';
import globalFr from './translations/fr.json';

import { aboutTranslations } from '../features/about/locales';
import { adminTranslations } from '../features/admin/locales';
import { analyticsTranslations } from '../features/analytics/locales';
import { authTranslations } from '../features/auth/locales';
import { bookingTranslations } from '../features/booking/locales';
import { helpTranslations } from '../features/help/locales';
import { landingTranslations } from '../features/landing/locales';
import { servicesTranslations } from '../features/services/locales';
import { trackingTranslations } from '../features/tracking/locales';

type JsonObject = { [key: string]: unknown };

function deepMerge<T extends JsonObject>(target: T, source: JsonObject): T {
  const result = { ...target } as Record<string, unknown>;
  for (const key of Object.keys(source)) {
    const sourceVal = source[key];
    const targetVal = result[key];

    if (
      sourceVal &&
      typeof sourceVal === 'object' &&
      !Array.isArray(sourceVal) &&
      targetVal &&
      typeof targetVal === 'object' &&
      !Array.isArray(targetVal)
    ) {
      result[key] = deepMerge(targetVal as JsonObject, sourceVal as JsonObject);
    } else {
      result[key] = sourceVal;
    }
  }
  return result as T;
}

const enList: JsonObject[] = [
  globalEn as JsonObject,
  aboutTranslations.en as JsonObject,
  adminTranslations.en as JsonObject,
  analyticsTranslations.en as JsonObject,
  authTranslations.en as JsonObject,
  bookingTranslations.en as JsonObject,
  helpTranslations.en as JsonObject,
  landingTranslations.en as JsonObject,
  servicesTranslations.en as JsonObject,
  trackingTranslations.en as JsonObject,
];

const frList: JsonObject[] = [
  globalFr as JsonObject,
  aboutTranslations.fr as JsonObject,
  adminTranslations.fr as JsonObject,
  analyticsTranslations.fr as JsonObject,
  authTranslations.fr as JsonObject,
  bookingTranslations.fr as JsonObject,
  helpTranslations.fr as JsonObject,
  landingTranslations.fr as JsonObject,
  servicesTranslations.fr as JsonObject,
  trackingTranslations.fr as JsonObject,
];

const resources = {
  en: {
    translation: enList.reduce((acc, curr) => deepMerge(acc, curr), {} as JsonObject),
  },
  fr: {
    translation: frList.reduce((acc, curr) => deepMerge(acc, curr), {} as JsonObject),
  },
};

const savedLang = typeof window !== 'undefined' ? localStorage.getItem('bb_lang') || 'en' : 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes strings
  },
});

if (typeof window !== 'undefined') {
  document.documentElement.lang = i18n.language || 'en';
  i18n.on('languageChanged', (lng) => {
    localStorage.setItem('bb_lang', lng);
    document.documentElement.lang = lng;
  });
}

export default i18n;
