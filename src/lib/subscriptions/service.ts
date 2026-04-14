import { randomBytes } from 'crypto';
import { getDb } from '@/lib/db';
import { NewsletterType, Subscription, SubscriptionSource, UnsubscribeSource } from './types';

export function generateUnsubscribeToken(): string {
  return randomBytes(32).toString('base64url');
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function rowToSubscription(row: Record<string, unknown>): Subscription {
  return {
    id: row.id as string,
    email: row.email as string,
    newsletterType: row.newsletter_type as Subscription['newsletterType'],
    status: row.status as Subscription['status'],
    unsubscribeToken: row.unsubscribe_token as string,
    stripeCustomerId: row.stripe_customer_id as string | null,
    stripeSubscriptionId: row.stripe_subscription_id as string | null,
    source: row.source as Subscription['source'],
    unsubscribeSource: row.unsubscribe_source as Subscription['unsubscribeSource'],
    welcomeEmailPending: row.welcome_email_pending as boolean,
    welcomeEmailSentAt: row.welcome_email_sent_at ? new Date(row.welcome_email_sent_at as string) : null,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

export async function upsertActiveSubscription({
  email,
  newsletterType,
  stripeCustomerId,
  stripeSubscriptionId,
  source,
}: {
  email: string;
  newsletterType: NewsletterType;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  source: SubscriptionSource;
}): Promise<{ created: boolean; reactivated: boolean }> {
  const db = getDb();
  const normalized = normalizeEmail(email);
  const token = generateUnsubscribeToken();

  const existing = await db`
    SELECT id, status, unsubscribe_source
    FROM subscriptions
    WHERE email = ${normalized} AND newsletter_type = ${newsletterType}
  `;

  if (existing.rows.length === 0) {
    await db`
      INSERT INTO subscriptions (email, newsletter_type, unsubscribe_token, stripe_customer_id, stripe_subscription_id, source)
      VALUES (${normalized}, ${newsletterType}, ${token}, ${stripeCustomerId ?? null}, ${stripeSubscriptionId ?? null}, ${source})
    `;
    return { created: true, reactivated: false };
  }

  const row = existing.rows[0];

  if (row.status === 'active') {
    return { created: false, reactivated: false };
  }

  if (row.unsubscribe_source === 'user') {
    return { created: false, reactivated: false };
  }

  await db`
    UPDATE subscriptions
    SET status = 'active',
        unsubscribe_token = ${token},
        unsubscribe_source = NULL,
        welcome_email_pending = true,
        stripe_customer_id = ${stripeCustomerId ?? null},
        stripe_subscription_id = ${stripeSubscriptionId ?? null},
        updated_at = now()
    WHERE id = ${row.id}
  `;
  return { created: false, reactivated: true };
}

export async function findByUnsubscribeToken(token: string): Promise<Subscription | null> {
  const db = getDb();
  const result = await db`
    SELECT * FROM subscriptions WHERE unsubscribe_token = ${token}
  `;
  if (result.rows.length === 0) return null;
  return rowToSubscription(result.rows[0]);
}

export async function markUnsubscribed(id: string, unsubscribeSource: UnsubscribeSource): Promise<void> {
  const db = getDb();
  await db`
    UPDATE subscriptions
    SET status = 'unsubscribed',
        unsubscribe_source = ${unsubscribeSource},
        updated_at = now()
    WHERE id = ${id}
  `;
}

export async function markUnsubscribedByStripeSubscriptionId(subscriptionId: string): Promise<void> {
  const db = getDb();
  await db`
    UPDATE subscriptions
    SET status = 'unsubscribed',
        unsubscribe_source = 'stripe_subscription_lapsed',
        updated_at = now()
    WHERE stripe_subscription_id = ${subscriptionId} AND status = 'active'
  `;
}

export async function markWelcomeEmailSent(id: string): Promise<void> {
  const db = getDb();
  await db`
    UPDATE subscriptions
    SET welcome_email_pending = false,
        welcome_email_sent_at = now(),
        updated_at = now()
    WHERE id = ${id}
  `;
}
