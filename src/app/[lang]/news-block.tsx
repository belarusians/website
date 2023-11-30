import * as React from 'react';

import { Lang } from '../../components/types';
import { NewsThumbnail } from './news-thumbnail';
import H2 from '../../components/headings/h2';
import { NewsMeta } from '../../sanity/news/service';

interface NewsBlockProps {
  news: NewsMeta[];
  headingText: string;
  lang: Lang;
}

export function NewsBlock(props: NewsBlockProps): React.JSX.Element {
  return (
    <>
      <H2>{props.headingText}</H2>
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 flex-wrap">
        {props.news.map((n, i) => (
          <NewsThumbnail
            lang={props.lang}
            className="transition-all flex grow h-[160px] min-w-[320px] shadow-lg hover:shadow-xl hover:scale-101"
            size={'small'}
            key={i}
            news={n}
          />
        ))}
      </div>
    </>
  );
}
