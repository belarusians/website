import { MaraImage } from "../../../../components/image";
import { News } from "../../../../components/types";
import H1 from "../../../../components/headings/h1";

interface ArticleProps {
  news: News;
}

export function NewsArticle(props: ArticleProps) {
  return (
    <div className="flex flex-row">
      <div className="flex flex-col gap-4">
        <div className="rounded-md bg-white shadow-lg p-4 lg:p-8">
          <H1>{props.news.title}</H1>
          <p className="prose-sm md:prose-lg">{props.news.description}</p>
        </div>
        <MaraImage
          image={props.news.backgroundUrl}
          className="object-cover rounded-md"
          alt={props.news.title}
        />
        <div
          className="rounded-md bg-white shadow-lg prose-sm md:prose-lg prose-hr:my-4 prose-a:text-red prose-a:break-words prose-blockquote:border-l-2 prose-blockquote:border-red p-4 lg:p-8"
          dangerouslySetInnerHTML={{ __html: props.news.content }}
        ></div>
      </div>
    </div>
  );
}
