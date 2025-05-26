import H1 from '../../../../components/headings/h1';
import { getTranslation } from '@/app/i18n';
import { Guide, Lang } from '@/components/types';

interface GuideArticleProps {
  guide: Guide;
  lang: Lang;
}

export async function GuideArticle(props: GuideArticleProps) {
  const { t } = await getTranslation(props.lang, 'guides');
  const formattedDate = new Date(props.guide.publishedAt).toLocaleDateString(props.lang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-row">
      <div className="flex flex-col gap-4 max-w-4xl mx-auto">
        <div className="rounded-md bg-white shadow-lg p-4 lg:p-8">
          <H1>{props.guide.title}</H1>
          {props.guide.excerpt && <p className="prose-sm md:prose-lg text-gray-600 mt-2">{props.guide.excerpt}</p>}
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <span>
              {t('published_on')} {formattedDate}
            </span>
          </div>
        </div>
        <div
          className="rounded-md bg-white shadow-lg prose-sm md:prose-lg prose-hr:my-4 prose-a:text-primary prose-a:break-words prose-blockquote:border-l-2 prose-blockquote:border-red prose-headings:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-100 prose-pre:border prose-ul:my-4 prose-ol:my-4 prose-li:my-1 p-4 lg:p-8"
          dangerouslySetInnerHTML={{ __html: props.guide.content }}
        ></div>
      </div>
    </div>
  );
}
