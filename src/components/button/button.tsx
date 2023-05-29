import Link from "next/link";
import * as React from "react";
import { HTMLAttributeAnchorTarget } from "react";

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
  let className = "";
  if (props.className) {
    className += `${props.className}`;
  }
  const buttonAttributes: { "data-umami-event"?: string } = {};
  if (props.trackingName) {
    buttonAttributes["data-umami-event"] = props.trackingName;
  }

  if (props.link) {
    return (
      <Link target={props.target} href={props.link} {...buttonAttributes}>
        <button
          className={className + " transition-all p-2 lg:p-3 shadow-lg hover:shadow-xl active:shadow-2xl rounded-md"}
          disabled={props.disabled}
          onClick={props.click}
        >
          {props.label}
        </button>
      </Link>
    );
  } else {
    return (
      <button
        className={className + " transition-all p-2 lg:p-3 shadow-lg hover:shadow-xl active:shadow-2xl rounded-md"}
        disabled={props.disabled}
        onClick={props.click}
      >
        {props.label}
      </button>
    );
  }
}
