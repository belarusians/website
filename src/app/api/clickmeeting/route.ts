import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent, getProductsByCheckoutSession } from '../../../lib/stripe';
import { inviteAttendee } from '../../../lib/clickmeeting';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ message: 'Lack of signature' }, { status: 400 });
  }
  if (!req.body) {
    return NextResponse.json({ message: 'Lack of body' }, { status: 400 });
  }

  let event;

  try {
    const bodyBuffer = new Buffer(await req.arrayBuffer());
    event = constructWebhookEvent(bodyBuffer, sig);
  } catch (err) {
    let message = 'Unknown error in constructWebhookEvent';
    if (err instanceof Error) {
      message = `Webhook Error: ${err.message ?? JSON.stringify(err)}`;
    }
    console.error(message);
    return NextResponse.json({ message }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    const message = `Unhandled event type ${event.type}`;
    console.debug(message);
    return NextResponse.json({ message }, { status: 202 });
  }

  const { payment_status, customer_details } = event.data.object;
  if (!customer_details?.email) {
    const message = 'Email does not exist in customer_details';
    console.warn(message);
    return NextResponse.json({ message }, { status: 202 });
  }

  if (payment_status !== 'paid') {
    const message = 'Payment status is not paid';
    console.warn(message);
    return NextResponse.json({ message }, { status: 202 });
  }

  const checkoutSessionId = event.data.object.id;
  const products = await getProductsByCheckoutSession(checkoutSessionId);

  if (!process.env.STRIPE_PRODUCT_FOR_CLICKMEETING) {
    console.error('STRIPE_PRODUCT_FOR_CLICKMEETING env variable should be set');
    return NextResponse.json({ message: 'skipped' }, { status: 202 });
  }

  if (!products.includes(process.env.STRIPE_PRODUCT_FOR_CLICKMEETING)) {
    console.debug(`Bought items don't contain product ${process.env.STRIPE_PRODUCT_FOR_CLICKMEETING}`);
    return NextResponse.json({ message: 'Unsupported product' }, { status: 202 });
  }
  try {
    if (!process.env.CLICKMEETING_ROOM) {
      console.error('CLICKMEETING_ROOM env variable should be set');
      return NextResponse.json({ message: 'skipped' }, { status: 202 });
    }
    await inviteAttendee(customer_details.email, process.env.CLICKMEETING_ROOM);
  } catch (e) {
    const message = `Invite attendee failed with error: ${JSON.stringify(e)}`;
    console.error(message);
    return NextResponse.json({ message }, { status: 500 });
  }

  return NextResponse.json({ message: 'success' }, { status: 200 });
}
