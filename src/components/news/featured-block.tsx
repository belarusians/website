import { useTranslation } from "next-i18next";

import { NewsThumbnail } from "./thumbnail";
import { ArticleMeta } from "../types";

interface FeaturedNewsBlockProps {
  main: ArticleMeta;
  secondary: [ArticleMeta, ArticleMeta];
}

export function FeaturedNewsBlock(props: FeaturedNewsBlockProps) {
  const { t } = useTranslation("main");

  return (
    <>
      <h2 className="text-xl font-medium md:text-3xl mb-2">{t("news-title")}</h2>
      <div className="flex flex-wrap gap-3 md:gap-4 flex-col lg:flex-row">
        <NewsThumbnail
          size={"large"}
          className="transition-all flex basis-28 md:basis-36 lg:basis-72 grow lg:grow-[2] shadow-lg hover:shadow-xl hover:scale-101"
          news={props.main}
        />
        <div className="flex flex-row lg:flex-col gap-3 md:gap-4 grow basis-28 md:basis-36">
          <NewsThumbnail
            size={"medium"}
            className="transition-all flex grow basis-28 md:basis-36 shadow-lg hover:shadow-xl hover:scale-101"
            news={props.secondary[0]}
          />
          <NewsThumbnail
            size={"medium"}
            className="transition-all flex grow basis-28 md:basis-36 shadow-lg hover:shadow-xl hover:scale-101"
            news={props.secondary[1]}
          />
        </div>
      </div>
    </>
  );
}
