import Image from "next/image";
import * as React from "react";
import { Event } from "../types";
import { eventContainer, eventContent, eventButtons, ticketButton } from "./event-article.css";
import { article, articleImage, articleImageContainer, ratio16x9, withoutRatio } from "./article.css";
import { Button } from "../button/button";
import { useTranslation } from "next-i18next";

interface ArticleProps {
  event: Event;
}

export function EventArticle(props: ArticleProps): JSX.Element {
  const { t } = useTranslation("events");

  return (
    <div className={article}>
      <div className={articleImageContainer + ` ${props.event.imageRatio ? ratio16x9 : withoutRatio}`}>
        <Image className={articleImage} fill src={props.event.backgroundUrl} alt={props.event.title} />
      </div>
      <div className={eventContainer}>
        <div className={eventButtons}>
          <Button
            link={props.event.ticketsLink}
            target="_blank"
            label={t("buy-ticket")}
            trackingName={`buy-${props.event.slug}-ticket-button`}
            className={ticketButton}
          />
        </div>
        <div className={eventContent} dangerouslySetInnerHTML={{ __html: props.event.content }}></div>
      </div>
    </div>
  );
}
