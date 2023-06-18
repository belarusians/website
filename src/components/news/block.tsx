"use client";

import * as React from "react";

import { useTranslation } from "../../app/i18n/client";
import { ArticleMeta, Lang } from "../types";
import { NewsThumbnail } from "./thumbnail";
import H2 from "../headinds/h2";

interface NewsBlockProps {
  news: ArticleMeta[];
  lang: Lang;
}

export function NewsBlock(props: NewsBlockProps): React.JSX.Element {
  const { t } = useTranslation(props.lang, "main");

  return (
    <>
      <H2>{t("other-news-title")}</H2>
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
