import { NextRequest } from 'next/server';
import { saveVacancyApplication } from '../../../../lib/s3';
import { sendError, sendSuccess } from '../../utils';

export async function POST(req: NextRequest) {
  const { contact, additional, id } = await req.json();
  if (!contact || !id) {
    return sendError(400, 'Bad Request', 'Request body is missing contact or id');
  }

  try {
    await saveVacancyApplication({ contact, additionalInfo: additional, id });
    return sendSuccess('Applied');
  } catch (e) {
    console.error(e);
    return sendError(500, 'Internal Server Error', 'Failed to apply');
  }
}
