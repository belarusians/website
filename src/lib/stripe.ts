import Stripe from 'stripe';

let stripe: Stripe | undefined = undefined;

function getStripe() {
  if (!stripe) {
    if (!process.env.STRIPE_API_KEY) {
      throw new Error('STRIPE_API_KEY env variable should be set');
    }
    stripe = new Stripe(process.env.STRIPE_API_KEY, {
      apiVersion: '2023-10-16',
      typescript: true,
    });
  }

  return stripe;
}

export async function getProductsByCheckoutSession(checkoutSessionId: string): Promise<string[]> {
  const checkoutSession: Stripe.Response<Stripe.Checkout.Session> = await getStripe().checkout.sessions.retrieve(
    checkoutSessionId,
    {
      expand: ['line_items.data.price'],
    },
  );
  if (!checkoutSession || !checkoutSession.line_items) {
    console.log(`Did not find checkout session ${checkoutSessionId}`);
    return [];
  }

  return checkoutSession.line_items.data
    .map((line) => {
      if (typeof line.price?.product !== 'string') {
        return;
      }
      return line.price?.product;
    })
    .filter(isString);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function constructWebhookEvent(body: Buffer, signature: string): Stripe.Event {
  if (!process.env.STRIPE_ENDPOINT_SECRET) {
    throw new Error('STRIPE_ENDPOINT_SECRET env variable should be set');
  }
  return getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_ENDPOINT_SECRET);
}

export async function searchProduct(): Promise<Stripe.Product['id'] | null> {
  const productName = 'Donation';
  const search = await getStripe().products.search({
    query: `name:"${productName}"`,
  });
  if (!search.data.length) {
    console.log(`Did not find product ${productName}`);
    return null;
  }

  console.log(`Found product ${search.data[0].id}`);
  return search.data[0].id;
}

export async function searchPrice(amount: number, recurring: boolean, productId: string): Promise<string | null> {
  const query = `product:"${productId}" AND active:"true" AND metadata["unit_amount"]:"${amount}" AND type:"${
    recurring ? 'recurring' : 'one_time'
  }"`;
  const search = await getStripe().prices.search({
    query,
  });

  if (search.data.length === 0) {
    console.log(`Did not find price with query ${query}`);
    return null;
  }

  console.log(`Found price ${search.data[0].id}`);
  return search.data[0].id;
}

export async function createPrice(amount: number, recurring: boolean, productId: string): Promise<Stripe.Price['id']> {
  console.log('Creating price');
  const price = await getStripe().prices.create(
    {
      currency: 'EUR',
      product: productId,
      unit_amount: amount,
      active: true,
      recurring: recurring
        ? {
            interval: 'month',
            interval_count: 1,
            usage_type: 'licensed',
          }
        : undefined,
      metadata: {
        unit_amount: amount,
      },
    },
    {
      idempotencyKey: `price-${productId}-${amount}-${recurring}-1`,
    },
  );

  console.log(`Created price ${price.id}`);
  return price.id;
}

export async function searchPLinkByPriceId(priceId: Stripe.Price['id']): Promise<Stripe.PaymentLink | null> {
  const plinks = await getStripe().paymentLinks.list({ active: true });
  const plink = plinks.data.find((pl) => pl.metadata['price_id'] === priceId);
  if (!plink) {
    console.log(`Did not find payment link for ${priceId}`);
    return null;
  }

  console.log(`Found payment link ${plink.id}`);
  return plink;
}

export async function createPLinkForPriceId(
  priceId: Stripe.Price['id'],
  redirectUrl?: string,
): Promise<Stripe.PaymentLink> {
  console.log('Creating payment link');
  const plink = await getStripe().paymentLinks.create(
    {
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      ...(redirectUrl && {
        after_completion: {
          type: 'redirect',
          redirect: {
            url: redirectUrl,
          },
        },
      }),
      metadata: {
        price_id: priceId,
      },
    },
    {
      idempotencyKey: `plink-${priceId}-${redirectUrl}-1`,
    },
  );

  console.log(`Created payment link ${plink.id}`);
  return plink;
}
