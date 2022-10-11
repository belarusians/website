import { Trans } from "next-i18next";

import { NewsThumbnail } from "./thumbnail";
import { NewsMetadata } from "../types";
import { card, sectionTitle } from "../styles.css";
import { row_lg, w_lg_2, w_1, col } from "../grid.css";
import { HTMLAttributes } from "react";

interface NewsCarouselProps {
  news: NewsMetadata[];
}

export function NewsBlock(props: NewsCarouselProps & HTMLAttributes<HTMLElement>) {
  if (props.news.length === 0) {
    return null;
  }

  return (
    <div className={props.className}>
      <h1 className={sectionTitle}>
        <Trans>news-title</Trans>
      </h1>
      <div className={row_lg}>
        <NewsThumbnail className={`${w_lg_2} ${card}`} news={props.news[0]} />
        <div className={`${w_1} ${col}`}>
          <NewsThumbnail className={`${w_1} ${card}`} news={props.news[1]} />
          <NewsThumbnail className={`${w_1} ${card}`} news={props.news[2]} />
        </div>
      </div>
    </div>
  );
}
