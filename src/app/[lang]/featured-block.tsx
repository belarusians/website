import { NewsThumbnail } from './news-thumbnail';
import { Lang } from '../../components/types';
import H2 from '../../components/headings/h2';
import { NewsMeta } from '../../sanity/news/service';

interface FeaturedNewsBlockProps {
  lang: Lang;
  main: NewsMeta;
  secondary: [NewsMeta, NewsMeta];
  headingText: string;
}

export function FeaturedNewsBlock(props: FeaturedNewsBlockProps) {
  return (
    <>
      <H2>{props.headingText}</H2>
      <div className="grid grod-rows-2 grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        <NewsThumbnail
          lang={props.lang}
          size={'large'}
          className="h-36 sm:h-48 md:h-64 lg:h-96 transition-transform col-span-2 lg:col-span-3 row-span-1 lg:row-span-2 shadow-lg hover:shadow-xl hover:scale-101"
          news={props.main}
        />
        <NewsThumbnail
          lang={props.lang}
          size={'medium'}
          className="h-36 md:h-48 lg:h-full transition-transform col-span-1 lg:col-span-2 row-span-1 shadow-lg hover:shadow-xl hover:scale-101"
          news={props.secondary[0]}
        />
        <NewsThumbnail
          lang={props.lang}
          size={'medium'}
          className="h-36 md:h-48 lg:h-full transition-transform col-span-1 lg:col-span-2 row-span-1 shadow-lg hover:shadow-xl hover:scale-101"
          news={props.secondary[1]}
        />
      </div>
    </>
  );
}
