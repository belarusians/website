'use client';

import { JSX, useEffect, useState } from 'react';

import { getTranslation } from '../../app/i18n/client';
import { Lang } from '../types';
import { applyConsent, ConsentChoice, readConsent, writeConsent } from '../../lib/consent';
import { Button } from '../button';

export type ConsentBannerProps = { lang: Lang; privacyHref?: string };

type Translator = (key: string) => string;

type BannerState = 'visible' | 'hidden';

export type RenderMode = 'banner' | 'pill' | 'none';

// Re-apply a previously stored choice so gtag isn't stuck at default-denied
// for returning users who accepted (or revoked back to denied) on a prior
// visit. Exported for direct testing (the project's Jest config runs in Node
// with no renderer, so useEffect bodies can't be exercised through rendering).
export function applyStoredConsent(): ConsentChoice | null {
  const stored = readConsent();
  if (stored === 'granted') {
    applyConsent('granted');
  }
  return stored;
}

export function recordAccept(): void {
  writeConsent('granted');
  applyConsent('granted');
}

export function recordDecline(): void {
  writeConsent('denied');
  // Downgrade gtag in case consent was previously granted in this session
  // (e.g. user accepted, opened the reopen pill, then declined). For a
  // first-time decline gtag is already at default-denied so this is a no-op.
  applyConsent('denied');
}

export function decideRenderMode(state: BannerState, hasStoredChoice: boolean): RenderMode {
  if (state === 'visible') return 'banner';
  if (hasStoredChoice) return 'pill';
  return 'none';
}

const BANNER_BASE_CLASSES = [
  'fixed',
  'left-3',
  'right-3',
  // Sit just above the fixed mobile TabBar (90px = pt-2 + min-h-[48px] + pb-[34px]).
  'bottom-[88px]',
  'p-[18px]',
  'pb-[calc(16px+env(safe-area-inset-bottom))]',
  'bg-white',
  'rounded-md',
  'shadow-2xl',
  'z-50',
  'md:left-[18px]',
  'md:right-auto',
  'md:bottom-[18px]',
  'md:w-[360px]',
  'md:p-5',
  'md:z-40',
].join(' ');

const ROW_CLASSES = [
  'flex',
  'flex-col',
  'items-stretch',
  'gap-3',
  'md:flex-row',
  'md:items-center',
  'md:justify-between',
  'md:gap-4',
  'md:flex-wrap',
].join(' ');

const ACTIONS_CLASSES = ['grid', 'grid-cols-2', 'gap-2.5', 'w-full', 'md:flex', 'md:w-auto', 'md:items-center'].join(
  ' ',
);

const PRIVACY_LINK_CLASSES = 'text-[13px] text-grey self-start hover:text-primary';

const PILL_CLASSES = [
  'fixed',
  // Sit just above the fixed mobile TabBar (90px = pt-2 + min-h-[48px] + pb-[34px]).
  'bottom-[88px]',
  'left-3',
  'md:bottom-[18px]',
  'md:left-[18px]',
  'inline-flex',
  'items-center',
  'gap-2',
  'bg-white',
  'rounded-full',
  'shadow-lg',
  'cursor-pointer',
  'hover:shadow-2xl',
  'hover:-translate-y-0.5',
  'active:shadow-md',
  'active:translate-y-px',
  'px-3',
  'py-2',
  'text-grey',
  'text-xs',
  'font-medium',
  'transition-all',
  'duration-150',
  'z-40',
].join(' ');

export const BANNER_EXIT_DURATION_MS = 350;

export function renderBannerCard(
  t: Translator,
  handlers: { onAccept: () => void; onDecline: () => void; privacyHref?: string },
  exiting = false,
): JSX.Element {
  const privacyHref = handlers.privacyHref?.trim();
  const animation = exiting ? 'animate-cc-out' : 'animate-cc-in';
  return (
    <section role="region" aria-label={t('aria.region')} className={`${BANNER_BASE_CLASSES} ${animation}`}>
      <h3 className="m-0 mb-1.5 text-base font-medium tracking-tight">{t('title')}</h3>
      <p className="m-0 mb-3.5 text-sm font-light leading-[1.55] text-black-tint">{t('body')}</p>
      <div className={ROW_CLASSES}>
        {privacyHref ? (
          <a href={privacyHref} className={PRIVACY_LINK_CLASSES}>
            {t('privacy')}
          </a>
        ) : null}
        <div className={ACTIONS_CLASSES}>
          <Button variant="ghost" size="sm" click={handlers.onDecline}>
            {t('decline')}
          </Button>
          <Button variant="primary" size="sm" click={handlers.onAccept}>
            {t('accept')}
          </Button>
        </div>
      </div>
    </section>
  );
}

export function renderReopenPill(t: Translator, onReopen: () => void): JSX.Element {
  return (
    <button type="button" aria-label={t('reopen')} className={PILL_CLASSES} onClick={onReopen}>
      <span className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
      {t('reopen')}
    </button>
  );
}

export function ConsentBanner({ lang, privacyHref }: ConsentBannerProps): JSX.Element | null {
  const { t } = getTranslation(lang, 'consent');
  const [state, setState] = useState<BannerState>('hidden');
  const [hasStoredChoice, setHasStoredChoice] = useState<boolean>(false);
  const [bannerExiting, setBannerExiting] = useState<boolean>(false);

  useEffect(() => {
    const stored = applyStoredConsent();
    // localStorage cannot be read during SSR, so the post-mount setState is
    // the only place this hydration can happen without a hydration mismatch.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (stored === null) {
      setState('visible');
    } else {
      setHasStoredChoice(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Keep the banner mounted during its exit animation, then unmount once the
  // animation has had time to finish (consent is already persisted + applied
  // synchronously when Accept/Decline fires; only the visible flip is delayed).
  // The cleanup handles unmount mid-animation (e.g. navigation) so we don't
  // setState on a stale tree.
  useEffect(() => {
    if (!bannerExiting) return;
    const timer = setTimeout(() => {
      setHasStoredChoice(true);
      setState('hidden');
      setBannerExiting(false);
    }, BANNER_EXIT_DURATION_MS);
    return (): void => clearTimeout(timer);
  }, [bannerExiting]);

  const mode = decideRenderMode(state, hasStoredChoice);

  if (mode === 'banner') {
    return renderBannerCard(
      t,
      {
        privacyHref,
        onAccept: () => {
          recordAccept();
          setBannerExiting(true);
        },
        onDecline: () => {
          recordDecline();
          setBannerExiting(true);
        },
      },
      bannerExiting,
    );
  }

  if (mode === 'pill') {
    return renderReopenPill(t, () => setState('visible'));
  }

  return null;
}
