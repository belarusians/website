import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent, getProductsByCheckoutSession } from '@/lib/stripe';
import { inviteAttendee } from '@/lib/clickmeeting';
import { checkRateLimit } from '../rate-limit';

export async function POST(req: NextRequest) {
  const rateLimitError = checkRateLimit(req, { limit: 30, windowMs: 60_000 });
  if (rateLimitError) return rateLimitError;
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ message: 'Lack of signature' }, { status: 400 });
  }
  if (!req.body) {
    return NextResponse.json({ message: 'Lack of body' }, { status: 400 });
  }

  let event;

  try {
    const bodyBuffer = Buffer.from(await req.arrayBuffer());
    event = constructWebhookEvent(bodyBuffer, sig);
  } catch (err) {
    console.error('[ClickMeeting Webhook] Signature verification failed:', err instanceof Error ? err.message : err);
    return NextResponse.json({ message: 'Webhook verification failed' }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    console.debug(`[ClickMeeting Webhook] Unhandled event type: ${event.type}`);
    return NextResponse.json({ message: 'Event type not handled' }, { status: 202 });
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
    console.error('[ClickMeeting Webhook] Invite attendee failed:', e instanceof Error ? e.message : e);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }

  return NextResponse.json({ message: 'success' }, { status: 200 });
}
