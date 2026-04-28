'use client';

import { useEffect } from 'react';

import { Lang } from '../types';
import { applyConsent, readConsent } from '../../lib/consent';

export type ConsentBannerProps = { lang: Lang };

// Re-apply a previously granted choice so gtag isn't stuck at default-denied
// for users who already accepted on a prior visit. Exported for direct testing
// (the project's Jest config runs in Node with no renderer, so useEffect bodies
// can't be exercised through rendering).
export function applyStoredConsent(): void {
  const stored = readConsent();
  if (stored === 'granted') {
    applyConsent('granted');
  }
}

// Visual rendering is gated on design delivery (plan 2026-04-26-cookie-consent-banner.md, Task 3).
// Until designs land, the banner stays headless and only triggers the mount-time re-apply.
// `lang` is forwarded by the layout so Task 3 can wire translations without a layout change;
// the headless stub doesn't read it yet, hence the eslint disable on the empty dep array.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ConsentBanner({ lang }: ConsentBannerProps): null {
  useEffect(() => {
    applyStoredConsent();
  }, []);

  return null;
}
