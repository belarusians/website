import { Lang } from '../../components/types';

export const supportedLngs = [Lang.be, Lang.nl];

export const defaultNS = 'common';

export function getOptions(lng = Lang.be, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs,
    fallbackLng: Lang.be,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
