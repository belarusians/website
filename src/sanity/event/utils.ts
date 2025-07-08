import { EventMeta } from './service';

export function isEventPassed(event: EventMeta): boolean {
  return new Date(event.timeframe.end).getTime() < Date.now() && !event.rescheduled;
}
