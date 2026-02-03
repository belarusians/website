import { Metadata, ResolvingMetadata } from 'next/types';

import { getTranslation } from '../../i18n';
import { Section } from '../../../components/section';
import { Lang } from '../../../components/types';
import H1 from '../../../components/headings/h1';
import H3 from '../../../components/headings/h3';
import { CommonPageParams } from '../../types';
import { getAlternates } from '../../../utils/og';
import { toLang } from '../../../utils/lang';
import { getGuideBySlug } from '@/sanity/guide/service';
import FeedbackForm from './feedback-form';

export default async function AlienPassport({ params }: CommonPageParams) {
  const { lang: langParam } = await params;
  const lang = toLang(langParam);
  const { t } = await getTranslation(lang, 'alien-passport');
  const guide = await getGuideBySlug(lang, 'vreemdelingenpaspoort-belarus');

  return (
    <Section>
      <H1>{t('heading')}</H1>
      <p className="mb-6 md:mb-8">{t('intro')}</p>
      {guide && (
        <div
          className="rounded-md bg-white shadow-lg prose-sm md:prose-lg prose-hr:my-4 prose-a:text-primary prose-a:break-words prose-blockquote:border-l-2 prose-blockquote:border-red prose-headings:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-100 prose-pre:border prose-ul:my-4 prose-ol:my-4 prose-li:my-1 p-4 lg:p-8"
          dangerouslySetInnerHTML={{ __html: guide.content }}
        />
      )}
      <H3 className="mt-8 md:mt-12 text-primary">{t('feedback-heading')}</H3>
      <p className="mb-4">{t('feedback-intro')}</p>
      <FeedbackForm lang={lang} />
    </Section>
  );
}

export async function generateMetadata({ params }: CommonPageParams, parent: ResolvingMetadata): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = toLang(langParam);
  const parentMetadata = await parent;

  return {
    alternates: getAlternates(
      lang,
      `${parentMetadata.metadataBase}${Lang.be}/alien-passport`,
      `${parentMetadata.metadataBase}${Lang.nl}/alien-passport`,
    ),
  };
}
