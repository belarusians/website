import { forwardRef } from "react";
import Image from "next/image";
import Link from "next/link";

import { ArticleMeta, ArticleType, Lang } from "../../components/types";

export interface NewsThumbnailProps {
  news: ArticleMeta;
  lang: Lang;
  size?: "large" | "small" | "medium";
  className?: string;
}

function getLinkToArticle(article: ArticleMeta, lang: Lang): string {
  if (article.type === ArticleType.News) {
    return `/${lang}/news/${article.slug}`;
  }
  if (article.type === ArticleType.Event) {
    return `/${lang}/events/${article.slug}`;
  }
  return `/${lang}`;
}

export const NewsThumbnail = forwardRef<HTMLDivElement, NewsThumbnailProps>((props: NewsThumbnailProps, ref) => {
  return (
    <div ref={ref} className={`rounded-md ${props.className}`}>
      <Link className="relative flex flex-1 flex-col" href={getLinkToArticle(props.news, props.lang)}>
        <Image
          className="object-cover rounded-md brightness-90"
          fill
          src={props.news.backgroundUrl}
          alt={props.news.title}
        />
        <div className="p-2 z-40 mt-auto backdrop-blur-md rounded-b-md text-white uppercase">
          <span
            className={
              props.size === "small"
                ? "text-sm md:text-base lg:text-xl"
                : props.size === "medium"
                ? "text-base md:text-xl lg:text-2xl"
                : "text-xl md:text-2xl"
            }
          >
            {props.news.title}
          </span>
        </div>
      </Link>
    </div>
  );
});

NewsThumbnail.displayName = "NewsThumbnail";
