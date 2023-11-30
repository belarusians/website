import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

import { Lang } from '../../components/types';
import { EventMeta } from '../../sanity/event/service';

export interface EventThumbnailProps {
  event: EventMeta;
  lang: Lang;
}

export function FutureEventThumbnail(props: EventThumbnailProps & { className?: string }): JSX.Element {
  return (
    <Link
      className="bg-white transition-all shadow-lg hover:shadow-xl hover:scale-101 rounded-md p-4 w-full md:w-60"
      href={`/${props.lang}/events/${props.event.slug}`}
    >
      <div className="">
        <p className="text-grey">{clientSideDate(props.event.eventDate, props.lang)}</p>
        <h3 className="my-3 font-bold">{props.event.title}</h3>
        <p className="text-grey">
          <FontAwesomeIcon className="pr-2" icon={faLocationDot} />
          {props.event.location}
        </p>
      </div>
    </Link>
  );
}

function clientSideDate(eventString: string, locale: string): string {
  const eventDate = new Date(eventString);
  const eventDateString = eventDate.toLocaleDateString(locale, {
    year: 'numeric',
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
