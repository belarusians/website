import { forwardRef } from "react";
import Image from "next/image";
import Link from "next/link";

import { ArticleMeta, ArticleType } from "../types";
import { image, largeTitle, mediumTitle, smallTitle, thumbnail, titleContainer } from "./thumbnail.css";

export interface NewsThumbnailProps {
  news: ArticleMeta;
  size?: "large" | "small" | "medium";
}

const mapSizeToClass = {
  large: largeTitle,
  medium: mediumTitle,
  small: smallTitle,
};

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
        <Link className={thumbnail} href={getLinkToArticle(props.news)}>
          <Image className={image} fill src={props.news.backgroundUrl} alt={props.news.title} />
          <div className={titleContainer}>
            <span className={mapSizeToClass[props.size || "medium"]}>{props.news.title}</span>
          </div>
        </Link>
      </div>
    );
  },
);

NewsThumbnail.displayName = "NewsThumbnail";
