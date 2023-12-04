import { MaraImage } from '../../../../components/image';
import { Event, Lang } from '../../../../components/types';
import { Button } from '../../../../components/button';

interface ArticleProps {
  event: Event;
  lang: Lang;
  ticketsLabel: string;
  tipsLabel?: string;
  paymentSucceeded?: boolean;
  paymentSucceededText?: string;
}

export function EventArticle(props: ArticleProps) {
  return (
    <div className="flex flex-col md:flex-row gap-2 mg:gap-3 lg:gap-4">
      <div className="md:basis-1/3 lg:basis-2/5">
        <div className="flex flex-col gap-2 mg:gap-3 lg:gap-4">
          <MaraImage
            className="object-cover rounded-md shadow-lg"
            image={props.event.backgroundUrl}
            alt={props.event.title}
          />
          {props.paymentSucceeded && props.paymentSucceededText && <ThanksText text={props.paymentSucceededText} />}
          {!props.paymentSucceeded && props.event.ticketsLink && (
            <Button
              size="large"
              link={props.event.ticketsLink}
              target="_blank"
              label={props.ticketsLabel}
              trackingName={`buy-${props.event.slug}-ticket-button`}
              className="w-full bg-red-gradient animate-bg-rotation-fast bg-[length:350%_100%] text-white"
            />
          )}
          {props.event.tipsLink && (
            <TipsButton
              tipsLink={props.event.tipsLink}
              tipsLabel={props.event.tipsLabel ?? props.tipsLabel}
              slug={props.event.slug}
            />
          )}
        </div>
      </div>
      <div className="md:basis-2/3 lg:basis-3/5">
        <div
          className="rounded-md bg-white shadow-lg p-4 lg:p-8 prose-sm md:prose lg:prose-lg prose-hr:my-4 prose-a:text-red prose-a:break-words prose-blockquote:border-l-2 prose-blockquote:border-red"
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

function TipsButton(props: { tipsLink: string; tipsLabel?: string; slug: string }) {
  return (
    <Button
      link={props.tipsLink}
      target="_blank"
      label={props.tipsLabel}
      trackingName={`buy-${props.slug}-tips-button`}
      className="w-full bg-white border-2 border-red bg-[length:350%_100%] text-red"
    />
  );
}
