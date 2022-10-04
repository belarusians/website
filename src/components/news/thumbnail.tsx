import Image from "next/image";
import Link from "next/link";

import { NewsMetadata } from "../types";
import { image, thumbnail, title } from "./thumbnail.css";

interface NewsThumbnailProps {
  news: NewsMetadata;
}

export function NewsThumbnail(props: NewsThumbnailProps & { className?: string }): JSX.Element {
  return (
    <div className={props.className}>
      <Link href={`/news/${props.news.slug}`}>
        <a>
          <div className={thumbnail}>
            <Image className={image} layout="fill" src={props.news.backgroundUrl} objectFit="cover"></Image>
            <span className={title}>{props.news.title}</span>
          </div>
        </a>
      </Link>
    </div>
  );
}
