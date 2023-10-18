import { Lang } from "../components/types";

export interface CommonPageParams {
  params: {
    lng: Lang;
  };
  searchParams?: {
    [key: string]: string | string[] | undefined
  };
}

export interface PropsWithClass {
  className?: string;
}
