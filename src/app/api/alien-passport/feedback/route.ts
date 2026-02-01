import { NextRequest } from 'next/server';

import { sendError, sendSuccess } from '../../utils';
import { saveAlienPassportFeedback } from '../../../../lib/alien-passport-feedback';

export async function POST(req: NextRequest) {
  try {
    const { gemeente, complaint, contact } = await req.json();

    if (!gemeente || typeof gemeente !== 'string' || gemeente.length > 100) {
      return sendError(400, 'Invalid gemeente');
    }

    if (!complaint || typeof complaint !== 'string' || complaint.length > 5000) {
      return sendError(400, 'Invalid complaint');
    }

    if (contact !== undefined && contact !== null && (typeof contact !== 'string' || contact.length > 200)) {
      return sendError(400, 'Invalid contact');
    }

    await saveAlienPassportFeedback({
      gemeente: gemeente.trim(),
      complaint: complaint.trim(),
      contact: contact?.trim(),
    });

    return sendSuccess('Feedback submitted successfully');
  } catch (error) {
    console.error('Failed to save alien passport feedback:', error);
    return sendError(500, 'Failed to submit feedback');
  }
}
