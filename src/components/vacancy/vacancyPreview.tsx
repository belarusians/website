import { Vacancy } from "../../lib/vacancies";

export interface VacancyProps {
  vacancy: Vacancy;
}

export function VacancyPreview({ vacancy }: VacancyProps) {
  return (
    <div className="transition-all rounded-md shadow-xl hover:shadow-xl hover:scale-101 bg-white font-light text-black p-4 md:p-8">
      <h4 className="text-xl text-red mb-2 md:mb-4">{vacancy.title}</h4>
      <div>{vacancy.description}</div>
    </div>
  );
}
