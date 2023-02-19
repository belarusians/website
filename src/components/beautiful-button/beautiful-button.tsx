import { beautifulButton } from "./beautiful-button.css";
import { Button, ButtonProps } from "../button/button";

export function BeautifulButton(props: ButtonProps): JSX.Element {
  return (
    <Button
      label={props.label}
      link={props.link}
      className={beautifulButton + " " + props.className}
      trackingName={props.trackingName}
    />
  );
}
