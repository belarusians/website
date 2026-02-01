'use client';

import H3 from '../../../components/headings/h3';
import { getTranslation } from '../../i18n/client';
import { Lang } from '../../../components/types';

interface FaqProps {
  lang: Lang;
}

export default function Faq({ lang }: FaqProps) {
  const { t } = getTranslation(lang, 'alien-passport');

  return (
    <div>
      <H3 className="text-primary">{t('faq-heading')}</H3>
      <div className="flex flex-col gap-4 md:gap-6">
        <div>
          <p className="font-medium">{t('faq-what-question')}</p>
          <p>{t('faq-what-answer')}</p>
        </div>
        <div>
          <p className="font-medium">{t('faq-who-question')}</p>
          <p>{t('faq-who-answer')}</p>
        </div>
        <div>
          <p className="font-medium">{t('faq-how-question')}</p>
          <p>{t('faq-how-answer')}</p>
        </div>
        <div>
          <p className="font-medium">{t('faq-problems-question')}</p>
          <p>{t('faq-problems-answer')}</p>
        </div>
      </div>
    </div>
  );
}
