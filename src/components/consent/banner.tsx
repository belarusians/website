'use client';

import { useEffect } from 'react';

import { Lang } from '../types';
import { applyConsent, readConsent } from '../../lib/consent';

export type ConsentBannerProps = { lang: Lang };

// Visual rendering is gated on design delivery (plan 2026-04-26-cookie-consent-banner.md, Task 3).
// Until designs land, the banner stays headless: it re-applies a previously granted choice on revisit
// so gtag isn't stuck at default-denied for users who already accepted.
export function ConsentBanner({ lang }: ConsentBannerProps): null {
  useEffect(() => {
    const stored = readConsent();
    if (stored === 'granted') {
      applyConsent('granted');
    }
  }, [lang]);

  return null;
}
