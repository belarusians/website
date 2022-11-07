import { row } from "../grid.css";
import { EventMetadata } from "../types";
import { PastEventThumbnail, FutureEventThumbnail } from "./thumbnail";

export interface EventsBlockProps {
  events: EventMetadata[];
  locale: string;
}

function isEventPast(eventString: string): boolean {
  return new Date(eventString).getTime() < Date.now();
}

export function EventsBlock(props: EventsBlockProps & { className?: string }): JSX.Element {
  function renderEventThumbnail(event: EventMetadata, i: number): JSX.Element {
    return isEventPast(event.eventDate) ?
      <PastEventThumbnail locale={props.locale} event={event} key={i}/> :
      <FutureEventThumbnail locale={props.locale} event={event} key={i}/>
  }

  return (
    <div className={row}>
      { props.events.map(renderEventThumbnail) }
    </div>
  );
}

