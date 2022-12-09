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

export function NewsThumbnail(props: NewsThumbnailProps & { className?: string }) {
  return (
    <div className={props.className}>
      <Link className={thumbnail} href={`/news/${props.news.slug}`}>
        <Image className={image} fill src={props.news.backgroundUrl} alt={"test"} />
        <div className={titleContainer}>
          <span className={mapSizeToClass[props.size]}>{props.news.title}</span>
        </div>
      </Link>
    </div>
  );
}
