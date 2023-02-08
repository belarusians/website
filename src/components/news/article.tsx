import Image from "next/image";
import * as React from "react";
import { News } from "../types";
import { article, articleImage, articleContent, articleImageContainer, ratio16x9, withoutRatio } from "./article.css";

interface ArticleProps {
  news: News;
}

export function Article(props: ArticleProps): JSX.Element {
  return (
    <div className={article}>
      <div className={articleImageContainer + ` ${props.news.imageRatio ? ratio16x9 : withoutRatio}`}>
        <Image className={articleImage} fill src={props.news.backgroundUrl} alt={props.news.title} />
      </div>
      <div className={articleContent} dangerouslySetInnerHTML={{ __html: props.news.content }}></div>
    </div>
  );
}
