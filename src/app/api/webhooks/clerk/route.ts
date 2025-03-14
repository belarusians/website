import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { SessionWebhookEvent, WebhookEvent } from '@clerk/nextjs/server';
import { createClerkClient } from '@clerk/backend';
import { getUserGroups, mapGroupsToRole } from '@/lib/google-directory';

if (!process.env.CLERK_SECRET_KEY) {
  throw new Error('CLERK_SECRET_KEY has to be set');
}
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

function isSessionEvent(event: WebhookEvent): event is SessionWebhookEvent {
  return event.type === 'session.created';
}

export async function POST(req: NextRequest): Promise<void | NextResponse> {
  if (!process.env.CLERK_WEBHOOK_SECRET) {
    throw new Error('CLERK_WEBHOOK_SECRET has to be set');
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Missing svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new NextResponse('Error verifying webhook', { status: 400 });
  }

  if (isSessionEvent(evt)) {
    const userId = evt.data.user_id as string;

    try {
      const user = await clerkClient.users.getUser(userId);

      const primaryEmailId = user.primaryEmailAddressId;
      const primaryEmail = user.emailAddresses.find((email) => email.id === primaryEmailId);

      if (primaryEmail && primaryEmail.emailAddress.endsWith(`@${process.env.GOOGLE_WORKSPACE_DOMAIN}`)) {
        const groups = await getUserGroups(primaryEmail.emailAddress);

        const role = mapGroupsToRole(groups);

        await clerkClient.users.updateUser(userId, {
          publicMetadata: {
            role,
            lastSyncedAt: new Date().toISOString(),
          },
        });

        console.log(`Updated role for user ${userId} to ${role}`);
      }
    } catch (error) {
      console.error('Error syncing user role:', error);
      return new NextResponse('Error syncing user role', { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
