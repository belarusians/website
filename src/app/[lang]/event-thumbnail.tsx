import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

import { Lang } from '../../components/types';
import { EventMeta } from '../../sanity/event/service';
import { isEventPassed } from '../../sanity/event/utils';

export interface EventThumbnailProps {
  event: EventMeta;
  lang: Lang;
  displayYear?: boolean;
}

export function EventThumbnail(props: EventThumbnailProps) {
  const isPassed = isEventPassed(props.event);

  return (
    <Link
      className="bg-white transition-all no-underline shadow-lg hover:shadow-xl hover:scale-101 rounded-md p-2 md:p-4 w-full md:max-w-xs"
      href={`/${props.lang}/events/${props.event.slug}`}
    >
      <div className="flex flex-col gap-2 md:gap-3 h-full text-sm md:text-base">
        <p className={isPassed ? 'text-gray-300' : 'text-gray-500'}>
          {renderDate(props.event.eventDate, props.lang, props.displayYear)}
        </p>
        <p className={`font-bold ${isPassed ? 'text-gray-400' : 'text-red-500'}`}>{props.event.title}</p>
        <p className={`mt-auto ${isPassed ? 'text-gray-300' : 'text-gray-500'}`}>
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
