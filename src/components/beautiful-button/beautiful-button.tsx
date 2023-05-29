import { Button, ButtonProps } from "../button/button";

export function BeautifulButton(props: ButtonProps): JSX.Element {
  return (
    <Button
      label={props.label}
      link={props.link}
      className={`${props.className} bg-[length:350%_100%] bg-beautiful-button text-white animate-beautiful-button`}
      trackingName={props.trackingName}
    />
  );
}
