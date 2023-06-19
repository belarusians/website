import { NewsThumbnail } from "./thumbnail";
import { ArticleMeta, Lang } from "../types";
import H2 from "../headinds/h2";

interface FeaturedNewsBlockProps {
  lang: Lang;
  main: ArticleMeta;
  secondary: [ArticleMeta, ArticleMeta];
  headingText: string;
}

export function FeaturedNewsBlock(props: FeaturedNewsBlockProps) {
  return (
    <>
      <H2>{props.headingText}</H2>
      <div className="flex flex-wrap gap-3 md:gap-4 flex-col lg:flex-row">
        <NewsThumbnail
          lang={props.lang}
          size={"large"}
          className="transition-all flex basis-28 md:basis-36 lg:basis-72 grow lg:grow-[2] shadow-lg hover:shadow-xl hover:scale-101"
          news={props.main}
        />
        <div className="flex flex-row lg:flex-col gap-3 md:gap-4 grow basis-28 md:basis-36">
          <NewsThumbnail
            lang={props.lang}
            size={"medium"}
            className="transition-all flex grow basis-28 md:basis-36 shadow-lg hover:shadow-xl hover:scale-101"
            news={props.secondary[0]}
          />
          <NewsThumbnail
            lang={props.lang}
            size={"medium"}
            className="transition-all flex grow basis-28 md:basis-36 shadow-lg hover:shadow-xl hover:scale-101"
            news={props.secondary[1]}
          />
        </div>
      </div>
    </>
  );
}
