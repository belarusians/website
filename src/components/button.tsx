'use client';

import Link from 'next/link';
import * as React from 'react';
import { HTMLAttributeAnchorTarget, PropsWithChildren } from 'react';

export type ButtonSize = 'large' | 'medium' | 'sm';
export type ButtonVariant = 'primary' | 'ghost';

export interface ButtonProps extends PropsWithChildren {
  label?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  link?: string;
  target?: HTMLAttributeAnchorTarget;
  disabled?: boolean;
  className?: string;
  trackingName?: string;
  type?: 'submit' | 'button';
  click?: (event: React.MouseEvent) => void;
}

export function Button(props: ButtonProps): React.ReactElement {
  if (props.link) {
    return (
      <Link target={props.target} href={props.link}>
        <InnerButton {...props} />
      </Link>
    );
  } else {
    return <InnerButton {...props} />;
  }
}

function sizeClasses(size: ButtonSize | undefined): string {
  switch (size) {
    case 'large':
      return 'p-2 md:p-3 lg:p-4 text-lg';
    case 'sm':
      return 'px-4 py-2.5 text-sm font-normal';
    case 'medium':
    default:
      return 'p-1 md:p-2 lg:p-3';
  }
}

function variantClasses(variant: ButtonVariant | undefined): string {
  switch (variant) {
    case 'primary':
      return 'bg-primary text-white active:bg-primary-shade';
    case 'ghost':
      return 'bg-white text-black-tint active:bg-white-shade';
    default:
      return '';
  }
}

function InnerButton(props: ButtonProps) {
  const buttonAttributes: { 'data-umami-event'?: string } = {};
  if (props.trackingName) {
    buttonAttributes['data-umami-event'] = props.trackingName;
  }

  const interactive = props.disabled
    ? ''
    : 'cursor-pointer hover:shadow-2xl hover:-translate-y-0.5 active:shadow-md active:translate-y-px';

  return (
    <button
      type={props.type ?? 'button'}
      className={`transition-all duration-150 rounded-md shadow-lg ${sizeClasses(props.size)} ${variantClasses(props.variant)} ${interactive} ${props.className ?? ''}`}
      disabled={props.disabled}
      onClick={props.click}
      {...buttonAttributes}
    >
      {props.label ?? props.children}
    </button>
  );
}