import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { constructWebhookEvent, retrieveSubscription } from '@/lib/stripe';
import { upsertActiveSubscription, markUnsubscribedByStripeSubscriptionId } from '@/lib/subscriptions/service';
import { classifySubscriptionEvent, parseOptInFlag } from '@/lib/subscriptions/webhook-helpers';
import { sendError, sendSuccess } from '../../utils';
import { checkRateLimit } from '../../rate-limit';

export async function POST(req: NextRequest) {
  const rateLimitError = checkRateLimit(req, { limit: 50, windowMs: 60_000 });
  if (rateLimitError) return rateLimitError;

  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    return sendError(400, 'Missing signature');
  }

  if (!req.body) {
    return sendError(400, 'Missing body');
  }

  const secret = process.env.STRIPE_NEWSLETTER_WEBHOOK_SECRET;
  if (!secret) {
    console.error('STRIPE_NEWSLETTER_WEBHOOK_SECRET env variable should be set');
    return sendError(500, 'Internal Server Error');
  }

  let event: Stripe.Event;
  try {
    const bodyBuffer = Buffer.from(await req.arrayBuffer());
    event = constructWebhookEvent(bodyBuffer, sig, secret);
  } catch (err) {
    const message = err instanceof Error ? `Webhook Error: ${err.message}` : 'Unknown webhook error';
    console.error(message);
    return sendError(400, 'Invalid webhook signature');
  }

  const obj = event.data.object;
  const classification = classifySubscriptionEvent({
    eventType: event.type,
    invoiceSubscriptionId:
      event.type === 'invoice.payment_succeeded' ? getInvoiceSubscriptionId(obj as Stripe.Invoice) : undefined,
    subscriptionStatus:
      event.type === 'customer.subscription.updated' ? (obj as Stripe.Subscription).status : undefined,
  });

  if (classification === 'skip') {
    return sendSuccess('Skipped');
  }

  try {
    if (classification === 'enroll') {
      return await handleEnrollment(obj as Stripe.Invoice);
    }

    return await handleLapse(obj as Stripe.Subscription);
  } catch (err) {
    console.error('Stripe newsletter webhook error:', err);
    return sendError(500, 'Internal Server Error');
  }
}

function getInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  if (typeof invoice.subscription === 'string') return invoice.subscription;
  if (invoice.subscription && typeof invoice.subscription === 'object') return invoice.subscription.id;
  return null;
}

async function handleEnrollment(invoice: Stripe.Invoice) {
  const subscriptionId = getInvoiceSubscriptionId(invoice);
  if (!subscriptionId) {
    return sendSuccess('Skipped: no subscription');
  }

  const subscription = await retrieveSubscription(subscriptionId);
  if (!parseOptInFlag(subscription.metadata)) {
    return sendSuccess('Skipped: no opt-in');
  }

  const email = invoice.customer_email;
  if (!email) {
    console.warn('No email found on invoice for enrollment', { subscriptionId });
    return sendSuccess('Skipped: no email');
  }

  const customerId =
    typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id ?? null;

  await upsertActiveSubscription({
    email,
    newsletterType: 'financial_report',
    stripeCustomerId: customerId ?? undefined,
    stripeSubscriptionId: subscriptionId,
    source: 'stripe_webhook',
  });

  return sendSuccess('Enrolled');
}

async function handleLapse(subscription: Stripe.Subscription) {
  await markUnsubscribedByStripeSubscriptionId(subscription.id);
  return sendSuccess('Lapsed');
}
