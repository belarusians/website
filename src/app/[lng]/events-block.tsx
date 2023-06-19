import { EventMeta, Lang } from "../../components/types";
import { FutureEventThumbnail } from "./event-thumbnail";

export interface EventsBlockProps {
  events: EventMeta[];
  lang: Lang;
}

function isEventPast(eventString: string): boolean {
  return new Date(eventString).getTime() < Date.now();
}

export function EventsBlock(props: EventsBlockProps) {
  function renderEventThumbnail(event: EventMeta, i: number) {
    return isEventPast(event.eventDate) ? null : <FutureEventThumbnail lang={props.lang} event={event} key={i} />;
  }

  return (
    <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-4">
      {props.events.map(renderEventThumbnail)}
    </div>
  );
}
