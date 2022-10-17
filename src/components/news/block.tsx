import { Trans } from "next-i18next";

import { NewsThumbnail } from "./thumbnail";
import { NewsMetadata } from "../types";
import { animatedCard, sectionTitle } from "../styles.css";
import { row_lg, w_lg_2, w_1, col } from "../grid.css";
import { HTMLAttributes } from "react";

interface NewsCarouselProps {
  news: NewsMetadata[];
}

export function NewsBlock(props: NewsCarouselProps & HTMLAttributes<HTMLElement>) {
  if (props.news.length === 0) {
    return null;
  }

  // TODO: fucking dumb, but I'm in hurry :)
  const mainNews = props.news.find(news => news.tags.includes('featured-main'));
  const otherNews = props.news.filter(news => news !== mainNews);

  return (
    <div className={props.className}>
      <h1 className={sectionTitle}>
        <Trans>news-title</Trans>
      </h1>
      <div className={row_lg}>
        <NewsThumbnail size={'large'} className={`${w_lg_2} ${animatedCard}`} news={mainNews || props.news[0]} />
        <div className={`${w_1} ${col}`}>
          <NewsThumbnail size={'small'} className={`${w_1} ${animatedCard}`} news={otherNews[0]} />
          <NewsThumbnail size={'small'} className={`${w_1} ${animatedCard}`} news={otherNews[1]} />
        </div>
      </div>
    </div>
  );
}
