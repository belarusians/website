import { row } from "../grid.css";
import { EventMetadata } from "../types";
import { EventThumbnail } from "./thumbnail";
import { eventsBlock } from "./thumbnail.css";

export interface EventsBlockProps {
  events: EventMetadata[];
  locale: string;
}

export function EventsBlock(props: EventsBlockProps & { className?: string }): JSX.Element {
  function renderEventThumbnail(event: EventMetadata, i: number): JSX.Element {
    return <EventThumbnail locale={props.locale} event={event} key={i}/>
  }

  return (
    <div className={eventsBlock}>
      <div className={row}>
        { props.events.map(renderEventThumbnail) }
      </div>
    </div>
  );
}

