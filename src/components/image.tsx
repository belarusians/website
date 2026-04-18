'use client';

import Image from 'next/image';
import { useNextSanityImage } from 'next-sanity-image';
import type { SanityImageSource } from '@sanity/image-url';

import { dataset, projectId } from '../sanity/env';

interface ImageProps {
  image: SanityImageSource;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
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
      sizes={props.sizes}
      priority={!!props.priority}
      fetchPriority={props.fetchPriority ?? (props.priority ? 'high' : undefined)}
      loading={props.priority ? 'eager' : 'lazy'}
    />
  );
}
