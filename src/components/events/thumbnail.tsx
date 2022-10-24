import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

import { EventMetadata } from "../types";
import { thumbnail, date, title, locationText, locationIcon } from "./thumbnail.css";
import { vertical } from "../grid.css";

export interface EventThumbnailProps {
  event: EventMetadata;
  locale: string;
}

export function EventThumbnail(props: EventThumbnailProps & { className?: string }): JSX.Element {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  
  return (
    <Link href={`/news/${props.event.slug}`}>
      <a className={thumbnail}>
        <div className={vertical}>
          <p className={date}>
            {hydrated ? clientSideDate(props.event.eventDate, props.locale) : serverSideDate(props.event.eventDate)}
          </p>
          <h3 className={title}>{props.event.title}</h3>
          <p className={locationText}>
            <FontAwesomeIcon className={locationIcon} icon={faLocationDot} />
            {props.event.location}
          </p>
        </div>
      </a>
    </Link>
  );
}

function clientSideDate(eventString: string, locale: string): string {
  const eventDate = new Date(eventString);
  const eventDateString = eventDate.toLocaleDateString(locale);
  const eventTimeString = eventDate.toLocaleTimeString(locale, {
        hour: "numeric",
        minute: "numeric",
        second: undefined,
      });
  return `${eventDateString} ${eventTimeString}`;
}

function serverSideDate(dateString: string): string {
  return dateString;
}
