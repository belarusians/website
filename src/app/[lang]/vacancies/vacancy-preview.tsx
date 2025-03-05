import { Vacancy } from '../../../sanity/vacancy/type';

export interface VacancyProps {
  vacancy: Vacancy;
  buttonLabel: string;
}

export function VacancyPreview({ vacancy, buttonLabel }: VacancyProps) {
  return (
    <div className="transition-all flex flex-col rounded-md shadow-xl hover:shadow-xl bg-white font-light text-black p-4 md:p-8">
      <h4 className="text-xl text-red mb-2 md:mb-4">{vacancy.title}</h4>
      <div className="mb-2 md:mb-4">{vacancy.description}</div>
      <button className="text-white text-sm p-2 lg:px-3 rounded-md bg-red self-end">{buttonLabel}</button>
    </div>
  );
}
