import * as z from 'zod';
import { RequestError } from '../lib/utils';

const donationSchema = z.object({
  amount: z.coerce.number().min(1).max(1000),
  recurring: z.boolean(),
});
export function parseDonation(donation: Record<string, unknown>): Donation {
  const parsed = donationSchema.safeParse(donation);
  if (!parsed.success) {
    throw new RequestError('Validation error', 400, parsed.error);
  }

  return parsed.data;
}
export type Donation = z.infer<typeof donationSchema>;
