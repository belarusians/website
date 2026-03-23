import Link from 'next/link';
import { Section } from '../../components/section';
import H1 from '../../components/headings/h1';

export default function NotFound() {
  return (
    <Section>
      <div className="flex flex-col items-center justify-center py-16">
        <H1 className="text-primary mb-4">404</H1>
        <h2 className="text-2xl font-medium text-gray-700 mb-2">Старонка не знойдзена / Pagina niet gevonden</h2>
        <p className="text-gray-500 mb-8 text-center">
          На жаль, старонка, якую вы шукаеце, не існуе.
          <br />
          Helaas bestaat de pagina die u zoekt niet.
        </p>
        <div className="flex gap-4">
          <Link href="/be" className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
            Галоўная (BE)
          </Link>
          <Link href="/nl" className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
            Home (NL)
          </Link>
        </div>
      </div>
    </Section>
  );
}
