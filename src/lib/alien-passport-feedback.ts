import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId } from '../sanity/env';

const writeClient = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});

interface AlienPassportFeedbackInput {
  gemeente: string;
  complaint: string;
  contact?: string;
}

export async function saveAlienPassportFeedback({ gemeente, complaint, contact }: AlienPassportFeedbackInput) {
  return writeClient.create({
    _type: 'alienPassportFeedback',
    gemeente,
    complaint,
    contact: contact || undefined,
    submittedAt: new Date().toISOString(),
  });
}
