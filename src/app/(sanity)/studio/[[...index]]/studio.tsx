'use client';

import { NextStudio } from 'next-sanity/studio';

import config from '../../../../../sanity.config';

export function Studio() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <NextStudio config={config} />;
}