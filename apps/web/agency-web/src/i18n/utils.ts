import { getLocale, t } from 'astro-i18next';

export interface TranslationOptions {
  fallback?: string;
  ns?: string;
}

// Get current locale
export const getCurrentLocale = (request: Request) => {
  return getLocale(request);
};

// Simple translation function
export const translate = (key: string, options?: TranslationOptions) => {
  return t(key, options);
};

// Translation with interpolation
export const translateWithValues = (key: string, values: Record<string, any>, options?: TranslationOptions) => {
  return t(key, { ...values, ...options });
};

// Get language info
export const getLanguageInfo = (locale: string) => {
  const languages = {
    en: { name: 'English', flag: '🇺🇸', dir: 'ltr' },
    es: { name: 'Español', flag: '🇪🇸', dir: 'ltr' },
    fr: { name: 'Français', flag: '🇫🇷', dir: 'ltr' }
  };
  return languages[locale as keyof typeof languages] || languages.en;
};

// Format date according to locale
export const formatDate = (date: Date, locale: string = 'en') => {
  return new Intl.DateTimeFormat(locale).format(date);
};

// Format number according to locale
export const formatNumber = (num: number, locale: string = 'en') => {
  return new Intl.NumberFormat(locale).format(num);
};