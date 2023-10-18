import { Lang } from "../components/types";

export interface CommonPageParams {
  params: {
    lng: Lang;
  };
}

export interface PropsWithClass {
  className?: string;
}
