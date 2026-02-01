#!/usr/bin/env npx ts-node

import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const PRODUCT_ID = process.argv[2];

if (!STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY env variable is required');
  process.exit(1);
}

if (!PRODUCT_ID) {
  console.error('Usage: STRIPE_SECRET_KEY=sk_xxx npx ts-node script.ts prod_XXX');
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY);

async function getProductRevenue2025(productId: string): Promise<number> {
  let total = 0;
  let invoiceCount = 0;
  let sessionCount = 0;

  const start = Math.floor(new Date('2025-01-01T00:00:00Z').getTime() / 1000);
  const end = Math.floor(new Date('2026-01-01T00:00:00Z').getTime() / 1000);

  console.log(`Fetching invoices for product ${productId}...`);

  for await (const invoice of stripe.invoices.list({
    status: 'paid',
    created: { gte: start, lt: end },
    limit: 100,
  })) {
    const fullInvoice = await stripe.invoices.retrieve(invoice.id, {
      expand: ['lines.data.price'],
    });

    for (const line of fullInvoice.lines.data) {
      if (line.price?.product === productId) {
        total += line.amount;
        invoiceCount++;
      }
    }
  }

  console.log(`Found ${invoiceCount} matching invoice line items`);
  console.log(`Fetching checkout sessions...`);

  for await (const session of stripe.checkout.sessions.list({
    created: { gte: start, lt: end },
    limit: 100,
  })) {
    if (session.mode !== 'payment' || session.payment_status !== 'paid') continue;

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ['data.price.product'],
    });

    for (const item of lineItems.data) {
      const priceProduct = item.price?.product;
      const pid = typeof priceProduct === 'string' ? priceProduct : priceProduct?.id;
      if (pid === productId) {
        total += item.amount_total;
        sessionCount++;
      }
    }
  }

  console.log(`Found ${sessionCount} matching checkout session line items`);

  return total / 100;
}

getProductRevenue2025(PRODUCT_ID)
  .then((euros) => {
    console.log(`\nTotal revenue for ${PRODUCT_ID} in 2025: €${euros.toFixed(2)}`);
  })
  .catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
