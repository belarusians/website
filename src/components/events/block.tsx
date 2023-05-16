import * as React from "react";

import { row } from "../grid.css";
import { EventMeta } from "../types";
import { FutureEventThumbnail } from "./thumbnail";
import { fadeInElementOnScroll } from "../../utils/animation.css";

export interface EventsBlockProps {
  events: EventMeta[];
  locale: string;
}

function isEventPast(eventString: string): boolean {
  return new Date(eventString).getTime() < Date.now();
}

export function EventsBlock(props: EventsBlockProps): React.JSX.Element {
  function renderEventThumbnail(event: EventMeta, i: number): React.JSX.Element | null {
    return isEventPast(event.eventDate) ? null : <FutureEventThumbnail locale={props.locale} event={event} key={i} />;
  }

  return <div className={`${row} ${fadeInElementOnScroll}`}>{props.events.map(renderEventThumbnail)}</div>;
}
