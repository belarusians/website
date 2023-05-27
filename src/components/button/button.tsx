import Link from "next/link";
import * as React from "react";
import { HTMLAttributeAnchorTarget } from "react";

import { button, loadingSpace, spinner } from "./button.css";

export interface ButtonProps {
  label: string;
  link?: string;
  target?: HTMLAttributeAnchorTarget;
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
  if (props.isLoading) {
    className += ` ${loadingSpace}`;
  }
  const buttonAttributes: { "data-umami-event"?: string } = {};
  if (props.trackingName) {
    buttonAttributes["data-umami-event"] = props.trackingName;
  }

  if (props.link) {
    return (
      <Link target={props.target} href={props.link} {...buttonAttributes}>
        <button className={className} disabled={props.disabled} onClick={props.click}>
          {props.isLoading ? <Spinner /> : null}
          {props.label}
        </button>
      </Link>
    );
  } else {
    return (
      <button className={className} disabled={props.disabled} onClick={props.click}>
        {props.isLoading ? <Spinner /> : null}
        {props.label}
      </button>
    );
  }
}

function Spinner(): JSX.Element {
  return <span className={spinner}></span>;
}
