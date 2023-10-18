import Link from "next/link";
import * as React from "react";
import { HTMLAttributeAnchorTarget, PropsWithChildren } from "react";

export interface ButtonProps extends PropsWithChildren {
  label?: string;
  size?: "large" | "medium";
  link?: string;
  target?: HTMLAttributeAnchorTarget;
  disabled?: boolean;
  className?: string;
  trackingName?: string;
  type?: "submit" | "button";
  click?: (event: React.MouseEvent) => void;
}

export function Button(props: ButtonProps): React.ReactElement {
  const buttonAttributes: { "data-umami-event"?: string } = {};
  if (props.trackingName) {
    buttonAttributes["data-umami-event"] = props.trackingName;
  }

  if (props.link) {
    return (
      <Link target={props.target} href={props.link} {...buttonAttributes}>
        <InnerButton {...props} />
      </Link>
    );
  } else {
    return (
      <InnerButton {...props} />
    );
  }
}

function InnerButton(props: ButtonProps) {
  return (
    <button
      className={`transition-all ${props.size === "large" ? "p-2 md:p-3 lg:p-4 text-lg" : "p-1 md:p-2 lg:p-3"} rounded-md shadow-lg ${props.disabled ? "" : "hover:shadow-xl active:shadow-2xl"} ${props.className ?? ""}`}
      disabled={props.disabled}
      onClick={props.click}
    >
      {props.label ?? props.children}
    </button>
  );
}
