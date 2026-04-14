import { describe, expect, test } from '@jest/globals';
import {
  classifySubscriptionEvent,
  parseOptInFlag,
} from '../subscriptions/webhook-helpers';

describe('classifySubscriptionEvent', () => {
  test('enroll on invoice.payment_succeeded with subscription', () => {
    expect(
      classifySubscriptionEvent({
        eventType: 'invoice.payment_succeeded',
        invoiceSubscriptionId: 'sub_123',
      }),
    ).toBe('enroll');
  });

  test('skip on invoice.payment_succeeded without subscription (one-off)', () => {
    expect(
      classifySubscriptionEvent({
        eventType: 'invoice.payment_succeeded',
        invoiceSubscriptionId: null,
      }),
    ).toBe('skip');
  });

  test('skip on invoice.payment_succeeded with undefined subscription', () => {
    expect(
      classifySubscriptionEvent({
        eventType: 'invoice.payment_succeeded',
      }),
    ).toBe('skip');
  });

  test('lapse on customer.subscription.deleted', () => {
    expect(
      classifySubscriptionEvent({
        eventType: 'customer.subscription.deleted',
      }),
    ).toBe('lapse');
  });

  test('lapse on customer.subscription.updated with canceled status', () => {
    expect(
      classifySubscriptionEvent({
        eventType: 'customer.subscription.updated',
        subscriptionStatus: 'canceled',
      }),
    ).toBe('lapse');
  });

  test('lapse on customer.subscription.updated with unpaid status', () => {
    expect(
      classifySubscriptionEvent({
        eventType: 'customer.subscription.updated',
        subscriptionStatus: 'unpaid',
      }),
    ).toBe('lapse');
  });

  test('lapse on customer.subscription.updated with incomplete_expired status', () => {
    expect(
      classifySubscriptionEvent({
        eventType: 'customer.subscription.updated',
        subscriptionStatus: 'incomplete_expired',
      }),
    ).toBe('lapse');
  });

  test('skip on customer.subscription.updated with past_due status', () => {
    expect(
      classifySubscriptionEvent({
        eventType: 'customer.subscription.updated',
        subscriptionStatus: 'past_due',
      }),
    ).toBe('skip');
  });

  test('skip on customer.subscription.updated with active status', () => {
    expect(
      classifySubscriptionEvent({
        eventType: 'customer.subscription.updated',
        subscriptionStatus: 'active',
      }),
    ).toBe('skip');
  });

  test('skip on customer.subscription.updated with trialing status', () => {
    expect(
      classifySubscriptionEvent({
        eventType: 'customer.subscription.updated',
        subscriptionStatus: 'trialing',
      }),
    ).toBe('skip');
  });

  test('skip on unrelated event type', () => {
    expect(
      classifySubscriptionEvent({
        eventType: 'checkout.session.completed',
      }),
    ).toBe('skip');
  });

  test('skip on completely unknown event type', () => {
    expect(
      classifySubscriptionEvent({
        eventType: 'some.random.event',
      }),
    ).toBe('skip');
  });
});

describe('parseOptInFlag', () => {
  test('returns true for string "true"', () => {
    expect(parseOptInFlag({ newsletter_optin: 'true' })).toBe(true);
  });

  test('returns true for boolean true cast as metadata value', () => {
    expect(parseOptInFlag({ newsletter_optin: true as unknown as string })).toBe(true);
  });

  test('returns false for string "false"', () => {
    expect(parseOptInFlag({ newsletter_optin: 'false' })).toBe(false);
  });

  test('returns false for missing key', () => {
    expect(parseOptInFlag({})).toBe(false);
  });

  test('returns false for null metadata', () => {
    expect(parseOptInFlag(null)).toBe(false);
  });

  test('returns false for undefined metadata', () => {
    expect(parseOptInFlag(undefined)).toBe(false);
  });

  test('returns false for garbage value', () => {
    expect(parseOptInFlag({ newsletter_optin: 'yes' })).toBe(false);
  });

  test('returns false for empty string', () => {
    expect(parseOptInFlag({ newsletter_optin: '' })).toBe(false);
  });
});

