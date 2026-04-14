import { NextRequest } from 'next/server';
import * as z from 'zod';
import { findByUnsubscribeToken, markUnsubscribed } from '@/lib/subscriptions/service';
import { sendError, sendSuccess } from '../../utils';
import { checkRateLimit } from '../../rate-limit';

export const tokenSchema = z.object({
  token: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[A-Za-z0-9_-]+$/, 'Invalid token format'),
});

async function handleUnsubscribe(token: string) {
  const subscription = await findByUnsubscribeToken(token);
  if (!subscription) {
    return sendError(404, 'Invalid token');
  }

  if (subscription.status === 'unsubscribed') {
    return sendSuccess('Already unsubscribed');
  }

  await markUnsubscribed(subscription.id, 'user');
  return sendSuccess('Unsubscribed');
}

export async function GET(req: NextRequest) {
  const rateLimitError = checkRateLimit(req, { limit: 10, windowMs: 60_000 });
  if (rateLimitError) return rateLimitError;

  const parsed = tokenSchema.safeParse({
    token: req.nextUrl.searchParams.get('token') ?? undefined,
  });
  if (!parsed.success) {
    return sendError(400, 'Bad Request', 'Missing or invalid token');
  }

  try {
    return await handleUnsubscribe(parsed.data.token);
  } catch (e) {
    console.error('Unsubscribe error:', e);
    return sendError(500, 'Internal Server Error');
  }
}

export async function POST(req: NextRequest) {
  const rateLimitError = checkRateLimit(req, { limit: 10, windowMs: 60_000 });
  if (rateLimitError) return rateLimitError;

  const body = await req.json().catch(() => null);
  const parsed = tokenSchema.safeParse(body);
  if (!parsed.success) {
    return sendError(400, 'Bad Request', 'Missing or invalid token');
  }

  try {
    return await handleUnsubscribe(parsed.data.token);
  } catch (e) {
    console.error('Unsubscribe error:', e);
    return sendError(500, 'Internal Server Error');
  }
}
