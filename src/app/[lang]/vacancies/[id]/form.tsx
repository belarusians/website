'use client';

import { useState } from 'react';
import H3 from '../../../../components/headings/h3';
import { getTranslation } from '../../../i18n/client';
import { Lang } from '../../../../components/types';

interface VacancyFormProps {
  lang: Lang;
  vacancyId?: string;
}

export default function VacancyForm({ lang, vacancyId }: VacancyFormProps) {
  const { t } = getTranslation(lang, 'vacancies');

  const [formContact, setFormContact] = useState('');
  const [formAdditional, setFormAdditional] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  function submit() {
    if (!formContact || !vacancyId) {
      setIsValid(false);
      return;
    }

    setIsValid(true);

    fetch('/api/vacancies/apply', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ contact: formContact, additional: formAdditional, id: vacancyId }),
    }).then((response) => {
      if (!response.ok) {
        setIsValid(false);
        setIsSuccess(false);
      } else {
        setIsSuccess(true);
      }
    });
  }

  return (
    <>
      <H3>{t('feedback-form-title')}</H3>
      {isSuccess ? (
        <span>{t('feedback-form-success')}</span>
      ) : (
        <>
          <label>
            <span>{t('feedback-form-contact')}</span>
            <span className="text-red"> *</span>
            <input
              onChange={(event) => setFormContact(event.target.value)}
              type="text"
              className={`transition-all w-full rounded-md border-light-grey focus:border-grey focus:ring-3 focus:ring-grey focus:ring-opacity-20 ${
                isValid ? 'border-light-grey' : 'border-red animate-shake'
              }`}
            />
          </label>
          <label>
            <span>{t('feedback-form-additional')}</span>
            <textarea
              onChange={(event) => setFormAdditional(event.target.value)}
              className="transition-all w-full rounded-md border-light-grey focus:border-grey focus:ring-3 focus:ring-grey focus:ring-opacity-20"
            />
          </label>
          <button
            className="transition-all self-start p-2 lg:px-3 rounded-md border border-light-grey focus:border-grey focus:ring-3 focus:ring-grey focus:ring-opacity-20"
            onClick={submit}
          >
            {t('feedback-form-button')}
          </button>
        </>
      )}
    </>
  );
}
