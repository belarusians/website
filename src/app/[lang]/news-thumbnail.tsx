import Link from 'next/link';

import { Lang } from '../../components/types';
import { NewsMeta } from '../../sanity/news/service';
import { MaraImage } from '../../components/image';

export interface NewsThumbnailProps {
  news: NewsMeta;
  lang: Lang;
  size?: 'large' | 'small' | 'medium';
  className?: string;
  priority?: boolean;
}

export function NewsThumbnail(props: NewsThumbnailProps) {
  return (
    <div className={`rounded-md ${props.className}`}>
      <Link className="h-full relative flex flex-1 flex-col" href={`/${props.lang}/news/${props.news.slug}`}>
        <MaraImage
          image={props.news.backgroundUrl}
          className="object-cover rounded-md brightness-85"
          fill
          alt={props.news.title}
          priority={props.priority}
        />
        <div className="px-2 py-1 z-40 mt-auto backdrop-blur-md rounded-b-md text-white uppercase">
          <span
            className={`text-sm inline-block ${
              props.size === 'small'
                ? 'md:text-base lg:text-xl'
                : props.size === 'medium'
                ? 'md:text-xl lg:text-2xl'
                : 'md:text-2xl'
            }`}
          >
            {props.news.title}
          </span>
        </div>
      </Link>
    </div>
  );
}
