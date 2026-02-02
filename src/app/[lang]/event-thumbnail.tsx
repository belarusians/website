'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Lang } from '../../components/types';
import { EventMeta } from '../../sanity/event/service';

export interface EventThumbnailProps {
  event: EventMeta;
  lang: Lang;
  displayYear?: boolean;
  tbaText?: string;
}

export function EventThumbnail(props: EventThumbnailProps) {
  const [currentTime, setCurrentTime] = useState<number | null>(null);

  // Hydrate on client to get real current time
  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    const timeout = setTimeout(() => setCurrentTime(Date.now()), 0);

    // Update every minute to catch ongoing→past transitions
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  const isRescheduled = props.event.rescheduled;
  const isCancelled = props.event.cancelled;

  // Calculate time-based states
  const startTime = new Date(props.event.timeframe.start).getTime();
  const endTime = new Date(props.event.timeframe.end).getTime();

  // Only calculate after hydration to avoid SSR/client mismatch
  const isPast = currentTime !== null && endTime < currentTime && !isRescheduled;
  const isOngoing = currentTime !== null && startTime <= currentTime && endTime >= currentTime && !isCancelled;

  return (
    <Link
      className={`bg-white transition-all no-underline shadow-lg hover:shadow-xl rounded-md p-2 md:p-4 w-full md:max-w-xs ${
        isCancelled || isPast ? 'opacity-60' : ''
      }`}
      href={`/${props.lang}/events/${props.event.slug}`}
    >
      <div className="flex flex-col gap-2 md:gap-3 h-full text-sm md:text-base">
        {isOngoing && (
          <div className="flex justify-center">
            <span className="bg-primary text-white px-2 py-1 text-xs font-bold rounded uppercase">
              {props.lang === 'nl' ? 'Live nu' : 'Зараз'}
            </span>
          </div>
        )}
        <div>
          <p
            className={
              (isCancelled || isPast ? 'text-gray-300' : 'text-gray-500') +
              ' ' +
              (isRescheduled || isCancelled ? 'line-through' : '')
            }
          >
            {renderDate(props.event.timeframe.start, props.lang, props.displayYear)}
          </p>
          {isRescheduled && (
            <p className={`${isCancelled ? 'text-gray-400 line-through' : 'text-primary'}`}>
              {props.event.rescheduledTimeframe
                ? renderDate(props.event.rescheduledTimeframe.start, props.lang, props.displayYear)
                : props.tbaText}
            </p>
          )}
        </div>
        <p className={`font-bold ${isCancelled || isPast ? 'text-gray-400' : 'text-primary'} ${isCancelled ? 'line-through' : ''}`}>
          {props.event.title}
        </p>
        <p className={`mt-auto ${isCancelled || isPast ? 'text-gray-300' : 'text-gray-500'} ${isCancelled ? 'line-through' : ''}`}>
          <FontAwesomeIcon className="pr-2" icon={faLocationDot} />
          {props.event.location}
        </p>
      </div>
    </Link>
  );
}

function renderDate(eventString: string, locale: Lang, renderYear = true): string {
  const eventDate = new Date(eventString);
  const eventDateString = eventDate.toLocaleDateString(locale, {
    year: renderYear ? 'numeric' : undefined,
    month: 'long',
    day: 'numeric',
  });
  const eventTimeString = eventDate.toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: 'numeric',
    second: undefined,
    timeZone: 'Europe/Amsterdam',
  });
  return `${eventDateString} ${eventTimeString}`;
}
