import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent } from '../../../lib/stripe';
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
    const message = `Webhook Error: ${JSON.stringify(err)}`;
    console.error(message);
    return NextResponse.json({ message }, { status: 400 });
  }

  if (event.type !== 'charge.succeeded') {
    console.warn(`Unhandled event type ${event.type}`);
    return NextResponse.json({ message: 'success' }, { status: 202 });
  }

  const { email } = event.data.object.billing_details;
  if (!email) {
    return NextResponse.json({ message: 'Email does not exist in billing_details' }, { status: 400 });
  }

  try {
    if (!process.env.CLICKMEETING_ROOM) {
      throw new Error('CLICKMEETING_ROOM env variable should be set');
    }
    await inviteAttendee(email, process.env.CLICKMEETING_ROOM);
  } catch (e) {
    const message = `Invite attendee failed with error: ${JSON.stringify(e)}`;
    console.error(message);
    return NextResponse.json({ message }, { status: 500 });
  }

  return NextResponse.json({ message: 'success' }, { status: 200 });
}
