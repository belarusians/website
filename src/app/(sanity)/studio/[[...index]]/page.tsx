/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

import { Studio } from './studio';
import { type ReactElement } from 'react';

export { metadata } from 'next-sanity/studio';

// Ensures the Studio route is statically generated
export const dynamic = 'force-static';

export default function StudioPage(): ReactElement {
  return <Studio />;
}
