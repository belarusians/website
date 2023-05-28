import { forwardRef } from "react";
import Image from "next/image";
import Link from "next/link";

import { ArticleMeta, ArticleType } from "../types";

export interface NewsThumbnailProps {
  news: ArticleMeta;
  size?: "large" | "small" | "medium";
}

function getLinkToArticle(article: ArticleMeta): string {
  if (article.type === ArticleType.News) {
    return `/news/${article.slug}`;
  }
  if (article.type === ArticleType.Event) {
    return `/events/${article.slug}`;
  }
  return "/";
}

export const NewsThumbnail = forwardRef<HTMLDivElement, NewsThumbnailProps & { className?: string }>(
  (props: NewsThumbnailProps & { className?: string }, ref) => {
    return (
      <div ref={ref} className={props.className}>
        <Link className="relative flex flex-1 flex-col" href={getLinkToArticle(props.news)}>
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
                  ? "text-xs md:text-base lg:text-xl"
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
  },
);

NewsThumbnail.displayName = "NewsThumbnail";
