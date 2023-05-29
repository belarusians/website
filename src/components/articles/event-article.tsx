import Image from "next/image";
import * as React from "react";
import { Event } from "../types";
import { Button } from "../button/button";
import { useTranslation } from "next-i18next";

interface ArticleProps {
  event: Event;
}

export function EventArticle(props: ArticleProps): JSX.Element {
  const { t } = useTranslation("events");

  return (
    <div className="rounded-md shadow-lg">
      <div
        className={
          "relative rounded-t-md before:z-10 before:bg-white-gradient before:absolute before:h-16 before:right-0 before:bottom-0 before:left-0 " +
          `${props.event.imageRatio ? "aspect-video" : "h-36 md:h-72"}`
        }
      >
        <Image className="object-cover rounded-t-md" fill src={props.event.backgroundUrl} alt={props.event.title} />
      </div>
      <div className="flex flex-col md:flex-row gap-4 px-4 lg:px-8 pb-4 lg:pb-8 my-8 md:my-4">
        <div className="md:basis-2/6 lg:basis-1/5">
          <Button
            link={props.event.ticketsLink}
            target="_blank"
            label={t("buy-ticket")}
            trackingName={`buy-${props.event.slug}-ticket-button`}
            className="w-full bg-red-gradient animate-button-background-rotation bg-[length:350%_100%] text-white"
          />
        </div>
        <div
          className="max-w-full prose prose-sm md:prose-base prose-a:text-red prose-a:break-words prose-blockquote:border-l-2 prose-blockquote:border-red md:basis-4/6 lg:basis-4/5"
          dangerouslySetInnerHTML={{ __html: props.event.content }}
        ></div>
      </div>
    </div>
  );
}
