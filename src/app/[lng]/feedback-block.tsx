import H2 from "../../components/headinds/h2";
import { Feedback } from "../../../sanity.config";

interface FeedbackBlockProps {
  headingText: string;
  feedbacks: Feedback[];
}

export function FeedbackBlock(props: FeedbackBlockProps) {
  return (
    <>
      <H2 className="text-xl md:text-2xl mt-2 md:mt-4">{props.headingText}</H2>
      <div className="flex flex-col md:flex-row flex-wrap gap-6 md:gap-8 lg:gap-12">
        {props.feedbacks.map((feedback, i) => (
          <div key={i} className="grow md:basis-1/3">
            <p className="text-sm text-justify border-l-red border-l-2 pl-4 mb-2 md:mb-3">{feedback.text}</p>
            <p className="text-xs text-right">{feedback.signature}</p>
          </div>
        ))}
      </div>
    </>
  );
}
