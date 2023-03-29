import { useTranslation } from "next-i18next";

import { animatedCard, sectionTitle } from "../common.styles.css";
import { fadeInElementOnScroll } from "../../utils/animation.css";
import { ArticleMeta } from "../types";
import { NewsThumbnail } from "./thumbnail";
import { newsItem, newsBlock } from "./block.css";

interface NewsBlockProps {
  news: ArticleMeta[];
}

export function NewsBlock(props: NewsBlockProps): JSX.Element {
  const { t } = useTranslation("main");

  return (
    <>
      <h2 className={sectionTitle}>{t("other-news-title")}</h2>
      <div className={`${newsBlock} ${fadeInElementOnScroll}`}>
        {props.news.map((n, i) => (
          <NewsThumbnail className={`${newsItem} ${animatedCard}`} size={"small"} key={i} news={n} />
        ))}
      </div>
    </>
  );
}
