import * as React from 'react';

import { GuideWithoutHTMLContent, Lang } from '@/components/types';
import { GuideThumbnail } from './guide-thumbnail';
import H2 from '../../../components/headings/h2';

interface GuidesBlockClientProps {
  guides: GuideWithoutHTMLContent[];
  lang: Lang;
  translations: {
    all: string;
    featuredGuides: string;
    allGuides: string;
    noGuidesFound: string;
  };
}

export function GuidesBlockClient(props: GuidesBlockClientProps): React.JSX.Element {
  // Separate featured and regular guides
  const featuredGuides = props.guides.filter((guide) => guide.featured);
  const regularGuides = props.guides.filter((guide) => !guide.featured);

  return (
    <div className="flex flex-col gap-6">
      {/* Featured guides */}
      {featuredGuides.length > 0 && (
        <div>
          <H2>{props.translations.featuredGuides}</H2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {props.guides.map((guide, i) => (
              <GuideThumbnail key={i} guide={guide} lang={props.lang} featured={true} />
            ))}
          </div>
        </div>
      )}

      {/* Regular guides */}
      {regularGuides.length > 0 && (
        <div>
          {featuredGuides.length > 0 && <H2>{props.translations.allGuides}</H2>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularGuides.map((guide, i) => (
              <GuideThumbnail key={i} guide={guide} lang={props.lang} featured={false} />
            ))}
          </div>
        </div>
      )}

      {props.guides.length === 0 && (
        <div className="text-center py-8 text-gray-500">{props.translations.noGuidesFound}</div>
      )}
    </div>
  );
}
