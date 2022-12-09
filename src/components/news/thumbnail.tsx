import { forwardRef, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import { NewsMetadata } from "../types";
import { image, largeTitle, smallTitle, thumbnail, titleContainer } from "./thumbnail.css";

export interface NewsThumbnailProps {
  news: NewsMetadata;
  size: "large" | "small";
}

const mapSizeToClass = {
  large: largeTitle,
  small: smallTitle,
};

export const NewsThumbnail = forwardRef<HTMLDivElement, NewsThumbnailProps & { className?: string }>(
  (props: NewsThumbnailProps & { className?: string }, ref) => {
    return (
      <div ref={ref} className={props.className}>
        <Link className={thumbnail} href={`/news/${props.news.slug}`}>
          <Image className={image} fill src={props.news.backgroundUrl} alt={"test"} />
          <div className={titleContainer}>
            <span className={mapSizeToClass[props.size]}>{props.news.title}</span>
          </div>
        </Link>
      </div>
    );
  },
);

NewsThumbnail.displayName = "NewsThumbnail";
