import Image from "next/image";
import * as React from "react";
import { News } from "../types";

interface ArticleProps {
  news: News;
}

export function NewsArticle(props: ArticleProps): JSX.Element {
  return (
    <div className="rounded-md shadow-lg">
      <div
        className={
          "relative rounded-t-md before:z-10 before:bg-white-gradient before:absolute before:h-16 before:right-0 before:bottom-0 before:left-0 " +
          `${props.news.imageRatio ? "aspect-video" : "h-36 md:h-72"}`
        }
      >
        <Image className="object-cover rounded-t-md" fill src={props.news.backgroundUrl} alt={props.news.title} />
      </div>
      <div
        className="prose-sm md:prose-lg prose-hr:my-4 prose-a:text-red prose-a:break-words prose-blockquote:border-l-2 prose-blockquote:border-red px-4 lg:px-8 pb-4 lg:pb-8 my-8 md:my-4"
        dangerouslySetInnerHTML={{ __html: props.news.content }}
      ></div>
    </div>
  );
}
