'use client';

import Image from 'next/image';
import { useNextSanityImage } from 'next-sanity-image';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

import { dataset, projectId } from '../sanity/env';
import { ImageProps } from 'next/dist/shared/lib/get-img-props';

interface ArticleProps {
  image: SanityImageSource;
  alt: string;
  className?: string;
  fill?: boolean;
}

export function MaraImage(props: ArticleProps) {
  const sanityImageProps = useNextSanityImage(
    {
      projectId,
      dataset,
    },
    props.image,
  );

  const imgProps: ImageProps = {
    alt: props.alt,
    ...(props.fill
      ? {
          src: sanityImageProps.src,
          loader: sanityImageProps.loader,
        }
      : sanityImageProps),
  };

  return <Image className={props.className + ' w-full'} {...imgProps} fill={props.fill} />;
}
