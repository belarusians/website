import { Lang } from '../../components/types';
import { EventThumbnail } from './event-thumbnail';
import { EventMeta } from '../../sanity/event/service';

export interface EventsBlockProps {
  events: EventMeta[];
  lang: Lang;
}

export function EventsBlock(props: EventsBlockProps) {
  return (
    <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-4">
      {props.events.map((event, i) => (
        <EventThumbnail lang={props.lang} event={event} key={i} />
      ))}
    </div>
  );
}
