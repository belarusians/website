import * as React from "react";
import { useTranslation } from "next-i18next";

import { ArticleMeta } from "../types";
import { NewsThumbnail } from "./thumbnail";

interface NewsBlockProps {
  news: ArticleMeta[];
}

export function NewsBlock(props: NewsBlockProps): React.JSX.Element {
  const { t } = useTranslation("main");

  return (
    <>
      <h2 className="text-xl font-medium md:text-3xl mb-2">{t("other-news-title")}</h2>
      <div className="flex flex-col lg:flex-row gap-3 md:gap-4 flex-wrap">
        {props.news.map((n, i) => (
          <NewsThumbnail
            className="transition-all flex grow basis-28 md:basis-36 h-[160px] min-w-[320px] shadow-lg hover:shadow-xl hover:scale-101"
            size={"small"}
            key={i}
            news={n}
          />
        ))}
      </div>
    </>
  );
}
