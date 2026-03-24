import { NextRequest } from 'next/server';
import * as z from 'zod';
import { saveEmail } from '../../../lib/s3';
import { sendError, sendSuccess } from '../utils';
import { checkRateLimit } from '../rate-limit';

const subscribeSchema = z.object({
  email: z.string().email().max(254),
});

export async function POST(req: NextRequest) {
  const rateLimitError = checkRateLimit(req, { limit: 5, windowMs: 60_000 });
  if (rateLimitError) return rateLimitError;

  const body = await req.json().catch(() => null);
  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    return sendError(400, 'Bad Request', 'Invalid or missing email');
  }

  try {
    await saveEmail(parsed.data.email);
    return sendSuccess('Subscribed');
  } catch (e) {
    console.error(e);
    return sendError(500, 'Internal Server Error', 'Failed to subscribe');
  }
}
