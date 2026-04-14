import 'dotenv/config';
import Stripe from 'stripe';
import { isEligibleForBackfill, deduplicateEmails } from './backfill-helpers';
import { normalizeEmail, upsertActiveSubscription } from '../src/lib/subscriptions/service';

const dryRun = process.argv.includes('--dry-run');

function getStripe(): Stripe {
  if (!process.env.STRIPE_API_KEY) {
    throw new Error('STRIPE_API_KEY env variable should be set');
  }
  return new Stripe(process.env.STRIPE_API_KEY, {
    apiVersion: '2024-04-10',
    typescript: true,
  });
}

interface EligibleDonor {
  email: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
}

async function main(): Promise<void> {
  const stripe = getStripe();

  console.log(dryRun ? '[DRY RUN] Scanning Stripe subscriptions...' : 'Scanning Stripe subscriptions...');

  let subscriptionsScanned = 0;
  let eligible = 0;
  let inserted = 0;
  let skipped = 0;

  const donors: EligibleDonor[] = [];

  for await (const sub of stripe.subscriptions.list({ status: 'active', limit: 100, expand: ['data.customer'] })) {
    subscriptionsScanned++;

    const invoices = await stripe.invoices.list({
      subscription: sub.id,
      status: 'paid',
      limit: 100,
    });

    const paidCount = invoices.data.length;

    if (!isEligibleForBackfill(sub, paidCount)) {
      continue;
    }

    const customer = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
    let email: string | null = null;

    if (typeof sub.customer === 'object' && sub.customer !== null && 'email' in sub.customer) {
      email = (sub.customer as Stripe.Customer).email ?? null;
    }

    if (!email && invoices.data.length > 0) {
      email = invoices.data[0].customer_email ?? null;
    }

    if (!email) {
      console.warn(`Skipping subscription ${sub.id}: no email found`);
      continue;
    }

    donors.push({
      email: normalizeEmail(email),
      stripeCustomerId: customer,
      stripeSubscriptionId: sub.id,
    });
  }

  const uniqueEmails = deduplicateEmails(donors.map((d) => d.email));
  const donorsByEmail = new Map<string, EligibleDonor>();
  for (const donor of donors) {
    if (!donorsByEmail.has(donor.email)) {
      donorsByEmail.set(donor.email, donor);
    }
  }

  eligible = uniqueEmails.length;

  for (const email of uniqueEmails) {
    const donor = donorsByEmail.get(email)!;

    if (dryRun) {
      console.log(`[DRY RUN] Would attempt to enroll: ${email}`);
      continue;
    }

    const result = await upsertActiveSubscription({
      email: donor.email,
      newsletterType: 'financial_report',
      stripeCustomerId: donor.stripeCustomerId,
      stripeSubscriptionId: donor.stripeSubscriptionId,
      source: 'stripe_backfill',
    });

    if (result.created) {
      inserted++;
    } else if (result.reactivated) {
      inserted++;
    } else {
      skipped++;
    }
  }

  console.log('\nSummary:');
  console.log(`  subscriptions_scanned: ${subscriptionsScanned}`);
  console.log(`  eligible: ${eligible}`);
  console.log(`  inserted: ${inserted}`);
  console.log(`  skipped: ${skipped}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Backfill failed:', err);
    process.exit(1);
  });
