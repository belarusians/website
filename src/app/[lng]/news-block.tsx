"use client";

import * as React from "react";

import { useTranslation } from "../i18n/client";
import { LegacyNewsMeta, Lang } from "../../components/types";
import { NewsThumbnail } from "./news-thumbnail";
import H2 from "../../components/headinds/h2";
import { NewsMeta } from "../../../sanity/lib/news";

interface NewsBlockProps {
  news: (LegacyNewsMeta | NewsMeta)[];
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
            lang={props.lang}
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
