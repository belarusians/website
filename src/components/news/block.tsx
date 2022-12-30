import { useTranslation } from "next-i18next";

import { animatedCard, sectionTitle } from "../styles.css";
import { row_lg, w_1 } from "../grid.css";
import { fadeInElementOnScroll } from "../../utils/animation.css";
import { NewsMetadata } from "../types";
import { NewsThumbnail } from "./thumbnail";
import { newsItem } from "./block.css";

interface NewsBlockProps {
  news: NewsMetadata[];
}

export function NewsBlock(props: NewsBlockProps): JSX.Element {
  const { t } = useTranslation("main");

  return (
    <>
      <h1 className={sectionTitle}>{t("other-news-title")}</h1>
      <div className={`${row_lg} ${fadeInElementOnScroll}`}>
        {props.news.map((n, i) => (
          <NewsThumbnail className={`${w_1} ${newsItem} ${animatedCard}`} size={"small"} key={i} news={n} />
        ))}
      </div>
    </>
  );
}
