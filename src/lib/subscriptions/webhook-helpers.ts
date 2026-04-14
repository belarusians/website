const TERMINAL_STATUSES = new Set(['canceled', 'unpaid', 'incomplete_expired', 'past_due']);

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

export function extractEnrollmentEmail(
  invoice: { customer_email?: string | null },
  charge?: { billing_details?: { email?: string | null } } | null,
): string | null {
  if (invoice.customer_email) return invoice.customer_email;
  if (charge?.billing_details?.email) return charge.billing_details.email;
  return null;
}
