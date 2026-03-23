import Link from 'next/link';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
});

export default function NotFound() {
  return (
    <html>
      <body>
        <div className={`${roboto.className} min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4`}>
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-medium text-gray-700 mb-2">Старонка не знойдзена / Pagina niet gevonden</h2>
          <p className="text-gray-500 mb-8 text-center">
            На жаль, старонка, якую вы шукаеце, не існуе.
            <br />
            Helaas bestaat de pagina die u zoekt niet.
          </p>
          <div className="flex gap-4">
            <Link
              href="/be"
              className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Галоўная (BE)
            </Link>
            <Link
              href="/nl"
              className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Home (NL)
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
