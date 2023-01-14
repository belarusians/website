import Link from "next/link";
import { beautifulButton } from "./beautiful-button.css";

interface BeautifulButtonProps {
  link: string;
  label: string;
  className?: string;
}

export function BeautifulButton(props: BeautifulButtonProps): JSX.Element {
  return (
    <Link className={beautifulButton + " " + props.className} href={props.link}>
      {props.label}
    </Link>
  );
}
