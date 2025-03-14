'use client';

import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

export function StudioLink() {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) return null;

  const userRole = user.publicMetadata.role as string | undefined;
  const hasAccess = userRole === 'admin' || userRole === 'editor';

  if (!hasAccess) return null;

  return (
    <Link href="/studio" className="transition-all p-1 md:p-2 lg:p-3 bg-red text-white rounded-md hover:shadow-lg">
      Studio
    </Link>
  );
}
