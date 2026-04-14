const TERMINAL_STATUSES = new Set(['canceled', 'unpaid', 'incomplete_expired']);

export type EventClassification = 'enroll' | 'lapse' | 'skip';

export interface SubscriptionEventInput {
  eventType: string;
  invoiceSubscriptionId?: string | null;
  subscriptionStatus?: string;
}

export function classifySubscriptionEvent(input: SubscriptionEventInput): EventClassification {
  if (input.eventType === 'invoice.payment_succeeded') {
    return input.invoiceSubscriptionId ? 'enroll' : 'skip';
  }

  if (input.eventType === 'customer.subscription.deleted') {
    return 'lapse';
  }

  if (input.eventType === 'customer.subscription.updated') {
    return input.subscriptionStatus && TERMINAL_STATUSES.has(input.subscriptionStatus) ? 'lapse' : 'skip';
  }

  return 'skip';
}

export function parseOptInFlag(metadata: Record<string, string> | null | undefined): boolean {
  if (!metadata) return false;
  const value = metadata.newsletter_optin;
  return value === 'true' || (value as unknown) === true;
}
