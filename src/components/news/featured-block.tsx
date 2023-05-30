import { useTranslation } from "next-i18next";

import { NewsThumbnail } from "./thumbnail";
import { ArticleMeta } from "../types";
import H2 from "../headinds/h2";

interface FeaturedNewsBlockProps {
  main: ArticleMeta;
  secondary: [ArticleMeta, ArticleMeta];
}

export function FeaturedNewsBlock(props: FeaturedNewsBlockProps) {
  const { t } = useTranslation("main");

  return (
    <>
      <H2>{t("news-title")}</H2>
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
