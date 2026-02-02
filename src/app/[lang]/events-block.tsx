'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

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
  const [currentTime, setCurrentTime] = useState<number | null>(null);

  // Hydrate on client to get real current time
  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    const timeout = setTimeout(() => setCurrentTime(Date.now()), 0);

    // Update every minute to refilter events
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  // Filter out truly past events (not rescheduled)
  const activeEvents =
    currentTime !== null
      ? props.events.filter((event) => {
          const endTime = new Date(event.timeframe.end).getTime();
          return endTime >= currentTime || event.rescheduled;
        })
      : props.events; // Show all events during SSR

  // Don't render the block if no active events
  if (activeEvents.length === 0) {
    return null;
  }

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
        {activeEvents.map((event, i) => (
          <EventThumbnail lang={props.lang} event={event} key={i} displayYear={false} tbaText={props.tbaText} />
        ))}
      </div>
    </>
  );
}
