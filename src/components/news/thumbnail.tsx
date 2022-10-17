import Image from "next/image";
import Link from "next/link";

import { NewsMetadata } from "../types";
import { image, largeTitle, smallTitle, thumbnail, titleContainer } from "./thumbnail.css";

export interface NewsThumbnailProps {
  news: NewsMetadata;
  size: 'large' | 'small';
}

const mapSizeToClass = {
  large: largeTitle,
  small: smallTitle,
}

export function NewsThumbnail(props: NewsThumbnailProps & { className?: string }): JSX.Element {
  return (
    <div className={props.className}>
      <Link href={`/news/${props.news.slug}`}>
        <a className={thumbnail}>
          <Image className={image} layout="fill" src={props.news.backgroundUrl} objectFit="cover"></Image>
          <div className={titleContainer}>
            <span className={mapSizeToClass[props.size]}>{props.news.title}</span>
          </div>
        </a>
      </Link>
    </div>
  );
}
