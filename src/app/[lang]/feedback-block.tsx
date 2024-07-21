import H2 from '../../components/headings/h2';
import { Feedback } from '../../components/types';

interface FeedbackBlockProps {
  headingText: string;
  feedbacks: Feedback[];
}

export function FeedbackBlock(props: FeedbackBlockProps) {
  return (
    <>
      <H2 className="text-xl md:text-2xl mt-2 md:mt-4">{props.headingText}</H2>
      <div className="flex flex-col md:flex-row flex-wrap">
        {props.feedbacks.map((feedback, i) => (
          <div key={i} className="grow md:basis-1/3 first:ml-0 first:mt-0 mt-6 md:mt-0 md:ml-8 lg:ml-12">
            {
              // TODO: replace margins with gap when safari 14+13.1+9.1 will be less than 0.1%
            }
            <p className="text-sm text-justify border-l-red border-l-2 pl-4 mb-2 md:mb-3">{feedback.text}</p>
            <p className="text-xs text-right">{feedback.signature}</p>
          </div>
        ))}
      </div>
    </>
  );
}
