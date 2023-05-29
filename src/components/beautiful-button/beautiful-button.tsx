import { Button, ButtonProps } from "../button/button";

export function BeautifulButton(props: ButtonProps): JSX.Element {
  return (
    <Button
      label={props.label}
      link={props.link}
      className={`${props.className} bg-[length:350%_100%] bg-beautiful-button shadow-none hover:shadow-none active:shadow-none md:shadow-lg md:hover:shadow-xl md:active:shadow-2xl text-white animate-beautiful-button`}
      trackingName={props.trackingName}
    />
  );
}
