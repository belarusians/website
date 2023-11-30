import Link from 'next/link';

import { Lang } from '../../components/types';
import { NewsMeta } from '../../sanity/news/service';
import { MaraImage } from '../../components/image';

export interface NewsThumbnailProps {
  news: NewsMeta;
  lang: Lang;
  size?: 'large' | 'small' | 'medium';
  className?: string;
}

export async function NewsThumbnail(props: NewsThumbnailProps) {
  return (
    <div className={`rounded-md ${props.className}`}>
      <Link className="relative flex flex-1 flex-col" href={`/${props.lang}/news/${props.news.slug}`}>
        <MaraImage
          image={props.news.backgroundUrl}
          className="object-cover rounded-md brightness-90"
          fill
          alt={props.news.title}
        />
        <div className="p-2 z-40 mt-auto backdrop-blur-md rounded-b-md text-white uppercase">
          <span
            className={
              props.size === 'small'
                ? 'text-sm md:text-base lg:text-xl'
                : props.size === 'medium'
                  ? 'text-base md:text-xl lg:text-2xl'
                  : 'text-xl md:text-2xl'
            }
          >
            {props.news.title}
          </span>
        </div>
      </Link>
    </div>
  );
}
