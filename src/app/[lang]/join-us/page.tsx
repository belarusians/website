import { getTranslation } from '../../i18n';
import { Section } from '../../../components/section';
import H1 from '../../../components/headings/h1';
import Form from './form';
import { CommonPageParams } from '../../types';
import { Metadata, ResolvingMetadata } from 'next/types';
import { Lang } from '../../../components/types';
import { getAlternates } from '../../../utils/og';
import { toLang } from '../../../utils/lang';

export default async function IndexPage({ params }: CommonPageParams) {
  const { lang: langParam } = await params;
  const lang = toLang(langParam);
  const { t } = await getTranslation(lang, 'join-us');

  return (
    <Section>
      <H1>{t('heading')}</H1>
      <div className="mb-2 md:mb-4">
        {/*<Link target="_blank" href={"/targets"}>*/}
        {/*  {t("targets-text")}*/}
        {/*</Link>*/}
      </div>
      <Form />
    </Section>
  );
}

const titleLang = {
  be: 'Далучайся да MARA!',
  nl: 'Word lid van MARA!',
};

const descriptionLang = {
  be: 'Запоўні форму і далучайся да MARA! Разам мы зможам болей!',
  nl: 'Vul het formulier in en word lid van MARA! Samen kunnen we meer doen!',
};

export async function generateMetadata({ params }: CommonPageParams, parent: ResolvingMetadata): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = toLang(langParam);
  const parentMetadata = await parent;
  const description = descriptionLang[lang];
  const title = titleLang[lang];

  return {
    title,
    description,
    alternates: getAlternates(
      lang,
      `${parentMetadata.metadataBase}${Lang.be}/join-us`,
      `${parentMetadata.metadataBase}${Lang.nl}/join-us`,
    ),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    openGraph: {
      ...parentMetadata.openGraph,
      title,
      description,
      url: `${lang}/join-us`,
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    twitter: {
      ...parentMetadata.twitter,
      title,
      description,
    },
  };
}
