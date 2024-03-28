import Link from 'next/link';

import { Lang } from '../../components/types';
import { EventThumbnail } from './event-thumbnail';
import { EventMeta } from '../../sanity/event/service';
import H2 from '../../components/headings/h2';

export interface EventsBlockProps {
  headingText: string;
  events: EventMeta[];
  lang: Lang;
  tbaText: string;
}

export function EventsBlock(props: EventsBlockProps) {
  return (
    <>
      <H2>
        <Link
          className="text-black transition-colors underline decoration-transparent hover:decoration-red decoration-2"
          href={`/${props.lang}/events`}
        >
          {props.headingText}
        </Link>
      </H2>
      <div className="grid grid-cols-2 md:flex md:flex-row justify-center gap-3 md:gap-4">
        {props.events.map((event, i) => (
          <EventThumbnail lang={props.lang} event={event} key={i} displayYear={false} tbaText={props.tbaText} />
        ))}
      </div>
    </>
  );
}
