import { forwardRef } from "react";
import Image from "next/image";
import Link from "next/link";

import { NewsMetadata } from "../types";
import { image, largeTitle, mediumTitle, smallTitle, thumbnail, titleContainer } from "./thumbnail.css";

export interface NewsThumbnailProps {
  news: NewsMetadata;
  size?: "large" | "small" | "medium";
}

const mapSizeToClass = {
  large: largeTitle,
  medium: mediumTitle,
  small: smallTitle,
};

export const NewsThumbnail = forwardRef<HTMLDivElement, NewsThumbnailProps & { className?: string }>(
  (props: NewsThumbnailProps & { className?: string }, ref) => {
    return (
      <div ref={ref} className={props.className}>
        <Link className={thumbnail} href={`/news/${props.news.slug}`}>
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
