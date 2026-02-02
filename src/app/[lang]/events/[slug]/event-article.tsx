'use client';

import { ReactElement, useEffect, useState } from 'react';

import { MaraImage } from '../../../../components/image';
import { Event, Lang } from '../../../../components/types';
import { Button, ButtonProps } from '../../../../components/button';

interface ArticleProps {
  event: Event;
  lang: Lang;
  pastEvent: boolean;
  defaultTicketsLabel: string;
  defaultPaymentSuccessText: string;
  rescheduledEventText?: string;
  cancelledEventText?: string;
  defaultTipsLabel?: string;
  paymentSucceeded?: boolean;
}

export function EventArticle(props: ArticleProps) {
  const [currentTime, setCurrentTime] = useState<number | null>(null);

  // Hydrate on client to get real current time
  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    const timeout = setTimeout(() => setCurrentTime(Date.now()), 0);

    // Update every minute
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  // Calculate if event is past based on current client time
  const isPastEvent =
    currentTime !== null
      ? new Date(props.event.timeframe.end).getTime() < currentTime && !props.event.rescheduled
      : props.pastEvent; // Fallback to server-side calculation during SSR
  return (
    <div className="flex flex-col md:flex-row gap-2 mg:gap-3 lg:gap-4">
      <div className="md:basis-1/3 lg:basis-2/5">
        <div className="flex flex-col gap-2 mg:gap-3 lg:gap-4">
          <MaraImage
            className={`object-cover rounded-md shadow-lg ${props.event.cancelled ? 'opacity-60 grayscale' : ''}`}
            image={props.event.backgroundUrl}
            alt={props.event.title}
          />
          {props.paymentSucceeded && <ThanksText text={props.event.successText ?? props.defaultPaymentSuccessText} />}
          {!props.paymentSucceeded && props.event.ticketsLink && !props.event.cancelled && (
            <Button
              size="large"
              link={props.event.ticketsLink}
              target="_blank"
              disabled={isPastEvent}
              label={props.event.ticketsLabel ?? props.defaultTicketsLabel}
              trackingName={`buy-${props.event.slug}-ticket-button`}
              click={
                props.event.gtmEventValue ? () => window.gtag_report_conversion(props.event.gtmEventValue!) : undefined
              }
              className={`${isPastEvent ? 'contrast-50' : ''} bg-primary w-full text-white`}
            />
          )}
          {props.event.tipsLink && !props.event.cancelled && (
            <TipsButton
              disabled={false}
              tipsLink={props.event.tipsLink}
              tipsLabel={props.event.tipsLabel ?? props.defaultTipsLabel}
              slug={props.event.slug}
            />
          )}
        </div>
      </div>
      <div className="md:basis-2/3 lg:basis-3/5 flex flex-col gap-2 mg:gap-3 lg:gap-4">
        {props.event.cancelled && (
          <div className="rounded-md bg-white shadow-lg p-4 lg:p-8 text-gray-500 text-2xl">
            {props.cancelledEventText}
          </div>
        )}
        {props.event.rescheduled && !props.event.cancelled && (
          <div className="rounded-md bg-white shadow-lg p-4 lg:p-8 text-primary text-2xl">
            {props.rescheduledEventText}
          </div>
        )}
        <div
          className={`rounded-md bg-white shadow-lg p-4 lg:p-8 prose-sm md:prose lg:prose-lg prose-hr:my-4 prose-a:text-primary prose-a:break-words prose-blockquote:border-l-2 prose-blockquote:border-red ${
            props.event.cancelled ? 'opacity-60' : ''
          }`}
          dangerouslySetInnerHTML={{ __html: props.event.content }}
        ></div>
      </div>
    </div>
  );
}

function ThanksText(props: { text: string }) {
  return (
    <p className="p-2 md:p-3 lg:p-4 text-lg text-center">
      <span className="">{props.text}</span>
    </p>
  );
}

function TipsButton(props: { tipsLink: string; tipsLabel?: string; slug: string } & ButtonProps): ReactElement {
  return (
    <Button
      {...props}
      link={props.tipsLink}
      target="_blank"
      label={props.tipsLabel}
      trackingName={`buy-${props.slug}-tips-button`}
      className="w-full bg-white border-2 border-primary bg-[length:350%_100%] text-primary"
    />
  );
}
