import { Lang } from '../../components/types';
import { EventThumbnail } from './event-thumbnail';
import { EventMeta } from '../../sanity/event/service';

export interface EventsBlockProps {
  events: EventMeta[];
  lang: Lang;
}

export function EventsBlock(props: EventsBlockProps) {
  return (
    <div className="grid grid-cols-2 md:flex md:flex-row justify-center gap-3 md:gap-4">
      {props.events.map((event, i) => (
        <EventThumbnail lang={props.lang} event={event} key={i} />
      ))}
    </div>
  );
}
