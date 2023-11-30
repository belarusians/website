import { NextRequest } from 'next/server';
import { isEmailValid } from '../../../lib/email';
import { saveEmail } from '../../../lib/s3';
import { sendError, sendSuccess } from '../utils';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return sendError(400, 'Bad Request', 'Request body is missing email');
  }

  if (!isEmailValid(email)) {
    return sendError(400, 'Bad Request', 'Email is not valid');
  }

  try {
    await saveEmail(email);
    return sendSuccess('Subscribed');
  } catch (e) {
    console.error(e);
    return sendError(500, 'Internal Server Error', 'Failed to subscribe');
  }
}
