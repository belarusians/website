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
    <div className="flex flex-col md:flex-row gap-2">
      <div className="md:basis-1/3 lg:basis-2/5">
        <div className="flex flex-col gap-4">
          <MaraImage className="object-cover rounded-md" image={props.event.backgroundUrl} alt={props.event.title} />
          <ButtonGroup
            slug={props.event.slug}
            ticketsLink={props.event.ticketsLink}
            ticketsLabel={props.ticketsLabel}
            tipsLink={props.event.tipsLink}
            tipsLabel={props.event.tipsLabel ?? props.tipsLabel}
            paymentSucceeded={props.paymentSucceeded}
            paymentSucceededText={props.paymentSucceededText}
          />
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

interface ButtonGroupProps {
  slug: string;
  ticketsLink?: string;
  ticketsLabel: string;
  tipsLink?: string;
  tipsLabel?: string;
  paymentSucceeded?: boolean;
  paymentSucceededText?: string;
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

function ButtonGroup(props: ButtonGroupProps) {
  return (
    <div className="flex flex-col gap-4">
      {props.paymentSucceeded && (
        <p className="mt-4 text-center">
          <span className="">{props.paymentSucceededText}</span>
        </p>
      )}
      {!props.paymentSucceeded && props.ticketsLink && (
        <Button
          link={props.ticketsLink}
          target="_blank"
          label={props.ticketsLabel}
          trackingName={`buy-${props.slug}-ticket-button`}
          className="w-full bg-red-gradient animate-bg-rotation-fast bg-[length:350%_100%] text-white"
        />
      )}
      {props.tipsLink && <TipsButton tipsLink={props.tipsLink} tipsLabel={props.tipsLabel} slug={props.slug} />}
    </div>
  );
}
