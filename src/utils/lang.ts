import { Lang } from '../components/types';
import { supportedLngs } from '../app/i18n/settings';

export function isValidLang(lang: string): lang is Lang {
  return supportedLngs.includes(lang as Lang);
}

export function toLang(lang: string): Lang {
  return isValidLang(lang) ? lang : Lang.be;
}
