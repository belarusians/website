export type NewsletterType = 'financial_report' | 'events';

export type SubscriptionStatus = 'active' | 'unsubscribed';

export type UnsubscribeSource = 'user' | 'stripe_subscription_lapsed';

export type SubscriptionSource = 'stripe_webhook' | 'stripe_backfill' | 'manual';

export interface Subscription {
  id: string;
  email: string;
  newsletterType: NewsletterType;
  status: SubscriptionStatus;
  unsubscribeToken: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  source: SubscriptionSource;
  unsubscribeSource: UnsubscribeSource | null;
  welcomeEmailPending: boolean;
  welcomeEmailSentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
