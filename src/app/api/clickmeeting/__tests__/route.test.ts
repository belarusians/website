import { describe, expect, test } from '@jest/globals';
import { NextRequest } from 'next/server';

import { POST } from '../route';

function makeRequest(body: string | null, headers: Record<string, string> = {}): NextRequest {
  return new NextRequest('http://localhost/api/clickmeeting', {
    method: 'POST',
    ...(body ? { body } : {}),
    headers,
  });
}

describe('ClickMeeting Webhook - Error Response Sanitization', () => {
  test('should return generic error without internal details for missing signature', async () => {
    const req = makeRequest('{}');
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.message).toBe('Lack of signature');
    // Ensure no stack traces or internal info
    expect(JSON.stringify(json)).not.toContain('Error:');
    expect(JSON.stringify(json)).not.toContain('stack');
  });

  test('should return generic error without internal details for invalid signature', async () => {
    const req = makeRequest('{"test": true}', { 'stripe-signature': 'invalid_sig_value' });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.message).toBe('Webhook verification failed');
    // Ensure no Stripe internals, keys, or stack traces leak
    expect(JSON.stringify(json)).not.toContain('sk_');
    expect(JSON.stringify(json)).not.toContain('whsec_');
    expect(JSON.stringify(json)).not.toContain('STRIPE_');
    expect(JSON.stringify(json)).not.toContain('Error:');
    expect(JSON.stringify(json)).not.toContain('stack');
    expect(JSON.stringify(json)).not.toContain('at ');
  });
});
