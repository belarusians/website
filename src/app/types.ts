import { Lang } from '../components/types';

export interface CommonPageParams {
  params: {
    lang: Lang;
  };
}

export interface PageSearchParams {
  searchParams?: {
    [key: string]: string | string[] | undefined
  };
}

export interface PropsWithClass {
  className?: string;
}
