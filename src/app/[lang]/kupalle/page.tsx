import { Metadata, ResolvingMetadata } from 'next/types';
import { getTranslation } from '../../i18n';
import { CommonPageParams } from '../../types';
import { Section } from '../../../components/section';
import H1 from '../../../components/headings/h1';
import H2 from '../../../components/headings/h2';
import { Lang } from '../../../components/types';
import { getAlternates } from '../../../utils/og';
import Card from '../../../components/card';
import CopiableHashtag from '../../../components/copiable-hashtag';
import CopyAllHashtags from '../../../components/copy-all-hashtags';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { toLang } from '../../../utils/lang';

export default async function KupallePage({ params }: CommonPageParams) {
  const { lang: langParam } = await params;
  const lang = toLang(langParam);
  const { t } = await getTranslation(lang, 'kupalle');

  const hashtags = [
    '#КупаллеНаПаўночнымМоры',
    '#KupalleNoordzee',
    '#KupalleNorthSea',
    '#Купалле2025',
    '#СвятаСонца',
    '#FolkByTheSea',
    '#KupalaNight',
    '#feestaanzee',
    '#traditioneelFeestAanZee',
  ];

  return (
    <Section>
      <H1>{t('title')}</H1>

      <div className="flex flex-col gap-6">
        <div className="">
          <H2>{t('map.title')}</H2>
          <Card>
            <div className="w-full overflow-auto">
              <img src="/kupalle-plan.svg" alt={t('map.title')} className="w-full h-auto max-w-none" />
            </div>
          </Card>
        </div>

        <div className="">
          <H2>{t('hashtags.title')}</H2>
          <Card>
            <div className="flex flex-wrap gap-2 mb-4">
              {hashtags.map((hashtag) => (
                <CopiableHashtag key={hashtag} hashtag={hashtag} />
              ))}
            </div>
            <CopyAllHashtags
              hashtags={hashtags}
              buttonText={t('hashtags.copy-all')}
              copiedText={t('hashtags.copied')}
            />
          </Card>
        </div>

        <div className="mb-12">
          <H2>{t('links.title')}</H2>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="https://docs.google.com/document/d/12c3k0_OYJeA2NSj4uLbqjF9QGJRzohUoZcB7bjvxcbY/edit?usp=drive_link"
              className="inline-flex items-center gap-2 text-primary transition-colors hover:text-primary-dark"
              rel="noopener noreferrer"
              target="_blank"
            >
              {t('links.song-lyrics.link')}
              <FontAwesomeIcon icon={faExternalLinkAlt} className="w-3 h-3" />
            </a>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeAVbabp2UCdghus1rBIWqr0rxCbHR8URkqQsYNQE02pwfMJg/viewform"
              className="inline-flex items-center gap-2 text-primary transition-colors hover:text-primary-dark"
              rel="noopener noreferrer"
              target="_blank"
            >
              {t('links.quiz.link')}
              <FontAwesomeIcon icon={faExternalLinkAlt} className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}

const titleLang = {
  be: 'Купалле на Паўночным моры 2025',
  nl: 'Kupalle aan de Noordzee 2025!',
};

const descriptionLang = {
  be: 'Мапа, расклад, спасылкі і важная інфармацыя для наведвальнікаў фестываля',
  nl: 'Kaart, programma, links en belangrijke informatie voor festivalbezoekers',
};

export async function generateMetadata({ params }: CommonPageParams, parent: ResolvingMetadata): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = toLang(langParam);
  const parentMetadata = await parent;

  const images = [];
  if (parentMetadata.openGraph?.images) {
    images.push(...parentMetadata.openGraph.images);
  }

  const description = descriptionLang[lang];
  const title = titleLang[lang];

  return {
    title,
    description,
    alternates: getAlternates(
      lang,
      `${parentMetadata.metadataBase}${Lang.be}/kupalle`,
      `${parentMetadata.metadataBase}${Lang.nl}/kupalle`,
    ),
    openGraph: {
      ...parentMetadata.openGraph,
      title,
      description,
      url: `${lang}/kupalle`,
      images,
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    twitter: {
      ...parentMetadata.twitter,
      title,
      description,
      images,
    },
  };
}
