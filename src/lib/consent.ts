export type ConsentChoice = 'granted' | 'denied';

export const CONSENT_STORAGE_KEY = 'mara_consent';

type StoredConsent = {
  choice: ConsentChoice;
  timestamp: number;
};

type GtagFn = (command: 'consent', action: 'update' | 'default', params: Record<string, ConsentChoice>) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
  }
}

function getStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function isConsentChoice(value: unknown): value is ConsentChoice {
  return value === 'granted' || value === 'denied';
}

export function readConsent(): ConsentChoice | null {
  const storage = getStorage();
  if (!storage) {
    return null;
  }
  const raw = storage.getItem(CONSENT_STORAGE_KEY);
  if (raw === null) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (parsed && isConsentChoice(parsed.choice)) {
      return parsed.choice;
    }
    storage.removeItem(CONSENT_STORAGE_KEY);
    return null;
  } catch {
    storage.removeItem(CONSENT_STORAGE_KEY);
    return null;
  }
}

export function writeConsent(choice: ConsentChoice): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }
  const payload: StoredConsent = { choice, timestamp: Date.now() };
  try {
    storage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // localStorage may throw in private mode or when full; ignore
  }
}

export function applyConsent(choice: ConsentChoice): void {
  if (typeof window === 'undefined') {
    return;
  }
  const gtag = window.gtag;
  if (typeof gtag !== 'function') {
    return;
  }
  gtag('consent', 'update', {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
  });
}
