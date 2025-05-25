import * as React from 'react';
import Link from 'next/link';

import { GuideWithoutHTMLContent, Lang } from '@/components/types';
import Card from '@/components/card';

interface GuideThumbnailProps {
  guide: GuideWithoutHTMLContent;
  lang: Lang;
  featured: boolean;
}

export function GuideThumbnail(props: GuideThumbnailProps): React.JSX.Element {
  const formattedDate = new Date(props.guide.publishedAt).toLocaleDateString(props.lang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/${props.lang}/guides/${props.guide.slug}`}>
      <Card className={`h-full transition-all hover:shadow-lg ${props.featured ? 'border-primary' : ''}`}>
        <div className="p-4 flex flex-col h-full">
          {props.featured && (
            <div className="inline-block mb-2">
              <span className="bg-primary text-white text-xs px-2 py-1 rounded">
                {props.lang === Lang.be ? 'Рэкамендавана' : 'Featured'}
              </span>
            </div>
          )}
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{props.guide.title}</h3>
          {props.guide.excerpt && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-3 flex-grow">{props.guide.excerpt}</p>
          )}
          <div className="mt-auto">
            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
