import { Lang } from '../components/types';

export interface CommonPageParams {
  params: Promise<{
    lang: Lang;
  }>;
}

export interface PageSearchParams {
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

export interface PropsWithClass {
  className?: string;
}

declare global {
  interface Window {
    gtag_report_conversion: (value: string) => void;
  }
}
