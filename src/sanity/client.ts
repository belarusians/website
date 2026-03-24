import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId, useCdn } from './env';

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
});

export function sanityFetch<QueryResponse>(
  query: string,
  tags: string[] = [],
  params: Record<string, unknown> = {},
): Promise<QueryResponse> {
  return client.fetch<QueryResponse>(query, params, {
    cache: 'force-cache',
    next: { tags },
  });
}
