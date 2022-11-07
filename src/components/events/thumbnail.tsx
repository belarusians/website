import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

import { EventMetadata } from "../types";
import { pastThumbnail, futureThumbnail, date, title, locationText, locationIcon, placeholder } from "./thumbnail.css";
import { vertical } from "../grid.css";
import { useTranslation } from "next-i18next";
import { toCenterAll } from "../styles.css";

export interface EventThumbnailProps {
  event: EventMetadata;
  locale: string;
}

export function FutureEventThumbnail(props: EventThumbnailProps & { className?: string }): JSX.Element {
  const { eventDate } = props.event;

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <Link href={`/news/${props.event.slug}`}>
      <a className={futureThumbnail}>
        <div className={vertical}>
          <p className={date}>{hydrated ? clientSideDate(eventDate, props.locale) : serverSideDate(eventDate)}</p>
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

export function PastEventThumbnail(props: EventThumbnailProps & { className?: string }): JSX.Element {
  const { eventDate } = props.event;
  const { t } = useTranslation("main");

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <div className={toCenterAll}>
      <div className={pastThumbnail}>
        <div className={vertical}>
          <p className={date}>{hydrated ? clientSideDate(eventDate, props.locale) : serverSideDate(eventDate)}</p>
          <h3 className={title}>{props.event.title}</h3>
          <p className={locationText}>
            <FontAwesomeIcon className={locationIcon} icon={faLocationDot} />
            {props.event.location}
          </p>
        </div>
      </div>
      <div className={placeholder}>{t("past-event-message")}</div>
    </div>
  );
}

function clientSideDate(eventString: string, locale: string): string {
  const eventDate = new Date(eventString);
  const eventDateString = eventDate.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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
