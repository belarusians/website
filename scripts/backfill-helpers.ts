export interface BackfillSubscription {
  status: string;
}

export function isEligibleForBackfill(subscription: BackfillSubscription, paidInvoiceCount: number): boolean {
  return subscription.status === 'active' && paidInvoiceCount >= 2;
}

export function deduplicateEmails(emails: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const email of emails) {
    const normalized = email.trim().toLowerCase();
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      result.push(normalized);
    }
  }
  return result;
}
