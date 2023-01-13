import Link from "next/link";
import { beautifulButton } from "./beautiful-button.css";

interface BeautifulButtonProps {
  link: string;
  label: string;
  className?: string;
}

export function BeautifulButton(props: BeautifulButtonProps): JSX.Element {
  return (
    <button className={beautifulButton + " " + props.className}>
      <Link href={props.link}>{props.label}</Link>
    </button>
  );
}
