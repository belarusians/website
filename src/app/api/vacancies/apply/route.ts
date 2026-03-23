import { NextRequest } from 'next/server';
import * as z from 'zod';
import { saveVacancyApplication } from '../../../../lib/s3';
import { sendError, sendSuccess } from '../../utils';
import { checkRateLimit } from '../../rate-limit';

const applySchema = z.object({
  id: z.string().min(1).max(100),
  contact: z.string().min(1).max(500),
  additional: z.string().max(5000).optional(),
});

export async function POST(req: NextRequest) {
  const rateLimitError = checkRateLimit(req, { limit: 5, windowMs: 60_000 });
  if (rateLimitError) return rateLimitError;

  const body = await req.json().catch(() => null);
  const parsed = applySchema.safeParse(body);
  if (!parsed.success) {
    return sendError(400, 'Bad Request', 'Invalid request body');
  }

  const { contact, additional, id } = parsed.data;

  try {
    await saveVacancyApplication({ contact, additionalInfo: additional, id });
    return sendSuccess('Applied');
  } catch (e) {
    console.error(e);
    return sendError(500, 'Internal Server Error', 'Failed to apply');
  }
}
