import { I18n } from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import translations from './translations';

const LANGUAGE_KEY = '@yoii_language';

const i18n = new I18n(translations);

// Simple event system without EventEmitter
const listeners: Array<(locale: string) => void> = [];

// Map common variants to our locale keys
const localeMap: { [key: string]: string } = {
  'zh-TW': 'zh_tw',
  'zh-Hant': 'zh_tw',
  'zh-HK': 'zh_tw',
  'zh-CN': 'zh_cn',
  'zh-Hans': 'zh_cn',
  'zh': 'zh_cn',
  'en': 'en',
  'en-US': 'en',
  'en-GB': 'en',
  'ja': 'ja',
  'ja-JP': 'ja',
  'th': 'th',
  'th-TH': 'th',
};

// Enable fallback to English if translation is missing
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

// Initialize locale
export const initializeLocale = async () => {
  try {
    // Check if user has saved a preferred language
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);

    if (savedLanguage) {
      i18n.locale = savedLanguage;
    } else {
      // Use device locale
      const locales = RNLocalize.getLocales();
      if (Array.isArray(locales) && locales.length > 0) {
        const deviceLocale = locales[0].languageTag;
        i18n.locale = localeMap[deviceLocale] || 'en';
      } else {
        i18n.locale = 'en';
      }
    }
  } catch (error) {
    console.error('Error initializing locale:', error);
    i18n.locale = 'en';
  }
};

export default i18n;

export const setLocale = (locale: string) => {
  i18n.locale = locale;
  // Notify all listeners
  listeners.forEach(listener => listener(locale));
};

export const getLocale = () => i18n.locale;

export const getCurrentLocale = () => i18n.locale;

export const changeLanguage = async (locale: string) => {
  try {
    i18n.locale = locale;
    await AsyncStorage.setItem(LANGUAGE_KEY, locale);
    // Notify all listeners
    listeners.forEach(listener => listener(locale));
  } catch (error) {
    console.error('Error changing language:', error);
  }
};

export const onLanguageChange = (callback: (locale: string) => void) => {
  listeners.push(callback);
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};

export const t = (key: string, options?: object) => i18n.t(key, options);

export { useTranslation } from './useTranslation';
