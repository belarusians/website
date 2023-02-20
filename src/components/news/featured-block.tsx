import { useTranslation } from "next-i18next";

import { NewsThumbnail } from "./thumbnail";
import { ArticleMeta } from "../types";
import { animatedCard, sectionTitle } from "../common.styles.css";
import { row_lg, w_lg_2, w_1, col_lg__row_md } from "../grid.css";
import { fadeInElementOnScroll } from "../../utils/animation.css";

interface FeaturedNewsBlockProps {
  main: ArticleMeta;
  secondary: [ArticleMeta, ArticleMeta];
}

export function FeaturedNewsBlock(props: FeaturedNewsBlockProps) {
  const { t } = useTranslation("main");

  return (
    <>
      <h2 className={sectionTitle}>{t("news-title")}</h2>
      <div className={`${row_lg} ${fadeInElementOnScroll}`}>
        <NewsThumbnail size={"large"} className={`${w_lg_2} ${animatedCard}`} news={props.main} />
        <div className={`${w_1} ${col_lg__row_md}`}>
          <NewsThumbnail className={`${w_1} ${animatedCard}`} news={props.secondary[0]} />
          <NewsThumbnail className={`${w_1} ${animatedCard}`} news={props.secondary[1]} />
        </div>
      </div>
    </>
  );
}
