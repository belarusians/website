import { EventMeta } from './service';

export function isEventPassed(event: EventMeta): boolean {
  return new Date(event.eventDate).getTime() < Date.now() && !event.rescheduled;
}
