import { VacancySchema } from '../../../sanity.config';
import { Lang, Modify } from '../../components/types';

export type Vacancy = Modify<VacancySchema, {
  id: string;
  title: string;
  description: string;
  tasks: {
    title: Record<Lang, string>;
    description: Record<Lang, string>;
  }[]
}>;
