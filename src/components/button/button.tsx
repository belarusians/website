import Link from "next/link";

import { button, loadingSpace, spinner } from "./button.css";
import * as React from "react";

export interface ButtonProps {
  label: string;
  link?: string;
  disabled?: boolean;
  className?: string;
  trackingName?: string;
  isLoading?: boolean;
  click?: (event: React.MouseEvent) => void;
}

export function Button(props: ButtonProps): JSX.Element {
  let className = button;
  if (props.className) {
    className += ` ${props.className}`;
  }
  if (props.trackingName) {
    className += ` umami--click--${props.trackingName}`;
  }
  if (props.isLoading) {
    className += ` ${loadingSpace}`;
  }
  return (
    <button className={className} disabled={props.disabled} onClick={props.click}>
      {props.isLoading ? <Spinner /> : null}
      {props.link ? <Link href={props.link}>{props.label}</Link> : props.label}
    </button>
  );
}

function Spinner(): JSX.Element {
  return <span className={spinner}></span>;
}
