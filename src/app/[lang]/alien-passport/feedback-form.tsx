'use client';

import { useState } from 'react';

import { getTranslation } from '../../i18n/client';
import { Lang } from '../../../components/types';

interface FeedbackFormProps {
  lang: Lang;
}

export default function FeedbackForm({ lang }: FeedbackFormProps) {
  const { t } = getTranslation(lang, 'alien-passport');

  const [gemeente, setGemeente] = useState('');
  const [complaint, setComplaint] = useState('');
  const [contact, setContact] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  function validate(): boolean {
    const errors: Record<string, boolean> = {};

    if (!gemeente.trim()) {
      errors.gemeente = true;
    }
    if (!complaint.trim()) {
      errors.complaint = true;
    }
    if (!gdprConsent) {
      errors.gdpr = true;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function submit() {
    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setIsError(false);

    try {
      const response = await fetch('/api/alien-passport/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ gemeente: gemeente.trim(), complaint: complaint.trim(), contact: contact.trim() || undefined }),
      });

      if (!response.ok) {
        setIsError(true);
      } else {
        setIsSuccess(true);
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return <p className="text-green-700 font-medium py-4">{t('form-success')}</p>;
  }

  const inputClass =
    'transition-all w-full rounded-md border-light-grey focus:border-grey focus:ring-3 focus:ring-grey focus:ring-opacity-20';
  const errorClass = 'border-red animate-shake';

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      <label>
        <span>{t('form-gemeente-label')}</span>
        <span className="text-red"> *</span>
        <input
          type="text"
          value={gemeente}
          onChange={(e) => setGemeente(e.target.value)}
          placeholder={t('form-gemeente-placeholder')}
          maxLength={100}
          className={`${inputClass} ${validationErrors.gemeente ? errorClass : 'border-light-grey'}`}
        />
        {validationErrors.gemeente && <span className="text-red text-sm">{t('form-validation-gemeente')}</span>}
      </label>

      <label>
        <span>{t('form-complaint-label')}</span>
        <span className="text-red"> *</span>
        <textarea
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          placeholder={t('form-complaint-placeholder')}
          maxLength={5000}
          rows={6}
          className={`${inputClass} ${validationErrors.complaint ? errorClass : 'border-light-grey'}`}
        />
        {validationErrors.complaint && <span className="text-red text-sm">{t('form-validation-complaint')}</span>}
      </label>

      <label>
        <span>{t('form-contact-label')}</span>
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder={t('form-contact-placeholder')}
          maxLength={200}
          className={inputClass}
        />
      </label>

      <label className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={gdprConsent}
          onChange={(e) => setGdprConsent(e.target.checked)}
          className={`mt-1 rounded border-light-grey focus:ring-grey focus:ring-opacity-20 ${validationErrors.gdpr ? 'border-red' : ''}`}
        />
        <span className={validationErrors.gdpr ? 'text-red' : ''}>
          {t('form-gdpr-consent')}
          <span className="text-red"> *</span>
        </span>
      </label>
      {validationErrors.gdpr && <span className="text-red text-sm">{t('form-validation-gdpr')}</span>}

      {isError && <p className="text-red">{t('form-error')}</p>}

      <button
        className="transition-all self-start p-2 lg:px-3 rounded-md border border-light-grey focus:border-grey focus:ring-3 focus:ring-grey focus:ring-opacity-20 disabled:opacity-50"
        onClick={submit}
        disabled={isLoading}
      >
        {t('form-submit')}
      </button>

      <p className="text-sm text-grey mt-2">{t('privacy-notice')}</p>
    </div>
  );
}
