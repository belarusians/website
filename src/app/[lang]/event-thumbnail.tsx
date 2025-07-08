import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

import { Lang } from '../../components/types';
import { EventMeta } from '../../sanity/event/service';

export interface EventThumbnailProps {
  event: EventMeta;
  lang: Lang;
  displayYear?: boolean;
  tbaText?: string;
}

export function EventThumbnail(props: EventThumbnailProps) {
  const isRescheduled = props.event.rescheduled;
  const isCancelled = props.event.cancelled;

  return (
    <Link
      className={`bg-white transition-all no-underline shadow-lg hover:shadow-xl rounded-md p-2 md:p-4 w-full md:max-w-xs ${
        isCancelled ? 'opacity-60' : ''
      }`}
      href={`/${props.lang}/events/${props.event.slug}`}
    >
      <div className="flex flex-col gap-2 md:gap-3 h-full text-sm md:text-base">
        <div>
          <p
            className={
              (isCancelled ? 'text-gray-300' : 'text-gray-500') +
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
        <p className={`font-bold ${isCancelled ? 'text-gray-400 line-through' : 'text-primary'}`}>
          {props.event.title}
        </p>
        <p className={`mt-auto ${isCancelled ? 'text-gray-300 line-through' : 'text-gray-500'}`}>
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
