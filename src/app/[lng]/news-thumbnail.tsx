import { forwardRef } from "react";
import Image from "next/image";
import Link from "next/link";

import { Lang } from "../../components/types";
import { NewsMeta } from "../../../sanity/lib/news";

export interface NewsThumbnailProps {
  news: NewsMeta;
  lang: Lang;
  size?: "large" | "small" | "medium";
  className?: string;
}

export const NewsThumbnail = forwardRef<HTMLDivElement, NewsThumbnailProps>((props: NewsThumbnailProps, ref) => {
  return (
    <div ref={ref} className={`rounded-md ${props.className}`}>
      <Link className="relative flex flex-1 flex-col" href={`/${props.lang}/news/${props.news.slug}`}>
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
