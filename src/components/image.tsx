'use client';

import Image from 'next/image';
import { useNextSanityImage } from './use-sanity-image';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

import { dataset, projectId } from '../sanity/env';

interface ImageProps {
  image: SanityImageSource;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
}

export function MaraImage(props: ImageProps) {
  const sanityImageProps = useNextSanityImage(
    {
      projectId,
      dataset,
    },
    props.image,
  );

  const imgProps = props.fill
    ? {
        src: sanityImageProps.src,
        loader: sanityImageProps.loader,
      }
    : sanityImageProps;

  return (
    <Image
      className={props.className + ' w-full'}
      alt={props.alt}
      {...imgProps}
      fill={props.fill}
      priority={!!props.priority}
      loading={props.priority ? 'eager' : 'lazy'}
    />
  );
}
